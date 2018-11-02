import { LoggerWithTarget } from 'probot/lib/wrap-logger'
import { Context } from 'probot'
import { App } from './app'

const scramjet = require('scramjet')

interface Issue {
  owner: string;
  repo: string;
  number: number;
}

export class Closeable extends App {
  static daysUntilClose = 15

  constructor (context: Context, logger: LoggerWithTarget) {
    super(context, logger)
  }

  async sweep () {
    this.logger.debug('Starting sweep Closeable')

    await this.ensureLabelExists(this.context.repo({name: App.toBeClosedLabel }).name)

    const issues = await this.getClosableIssues()
    issues.forEach(issue => this.close(this.context.repo({number: issue.number})))
  }

  async unmark (issue: Issue) {
    const { owner, repo, number } = issue
    const comment = this.context.payload.comment

    const issueInfo = await this.github.issues.get(issue)

    const isMarked = await this.hasResponseRequiredLabel(issue)
    if (isMarked && issueInfo.data.user.login === comment.user.login) {
      this.logger.info('%s/%s#%d is being unmarked', owner, repo, number)
      await this.github.issues.removeLabel({owner, repo, number, name: App.toBeClosedLabel})
      if (issueInfo.data.state === 'closed' && issueInfo.data.user.login !== issueInfo.data.closed_by.login) {
        this.github.issues.edit({owner, repo, number, state: 'open'})
      }
    }
  }

  private async close (issue: Issue) {
    const { owner, repo, number } = issue
    this.logger.info('%s/%s#%d is being closed', issue.owner, issue.repo, issue.number)
    await this.github.issues.removeLabel({owner, repo, number, name: App.toBeClosedLabel})
    return this.github.issues.edit(Object.assign({}, issue, {state: 'closed'}))
  }

  private async findLastLabeledEvent (owner, repo, number) {
    const params = { owner, repo, number, per_page: 100 }
    const events = await (this.github.paginate as any)(this.github.issues.getEvents(params))
    return events[0].data
      .reverse()
      .find(event => event.event === 'labeled' && event.label.name === App.toBeClosedLabel);
  }

  private async getClosableIssues () {
    const { owner, repo } = this.context.repo()
    const q = `repo:${owner}/${repo} is:issue is:open label:"${App.toBeClosedLabel}"`
    const params = {q, sort: 'updated' as 'updated', order: 'desc' as 'desc', per_page: 30}
    const labeledEarlierThan = this.since(Closeable.daysUntilClose)

    const issues = await this.github.search.issues(params)
    const closableIssues = scramjet.fromArray(issues.data.items).filter(async issue => {
      const event = await this.findLastLabeledEvent(owner, repo, issue.number)
      const creationDate = new Date(event.created_at)
      return creationDate < labeledEarlierThan
    }).toArray()
    return closableIssues
  }

  private async hasResponseRequiredLabel (issue: Issue) {
    const labels = await this.github.issues.getIssueLabels(issue)

    return labels.data.map(label => label.name).includes(App.toBeClosedLabel)
  }

  private since (days: number) {
    const ttl = days * 24 * 60 * 60 * 1000
    return new Date(Date.now() - ttl)
  }
}