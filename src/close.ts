import { LoggerWithTarget } from 'probot/lib/wrap-logger'
import { Context } from 'probot'
import { App } from './app'
import { DAYS_UNTIL_CLOSE, TO_BE_CLOSED_LABEL } from './config'
import { Issue } from './interface'

const scramjet = require('scramjet')

export class Closeable extends App {

  constructor (context: Context, logger: LoggerWithTarget) {
    super(context, logger)
  }

  async sweep () {
    this.logger.debug('Starting sweep Closeable')

    await this.ensureLabelExists(this.context.repo({name: TO_BE_CLOSED_LABEL }).name)

    const issues = await this.getClosableIssues()
    issues.forEach(({ number }) => this.close(this.context.repo({ number })))
  }

  async unmark (issue: Issue) {
    const { owner, repo, number } = issue
    const comment = this.context.payload.comment

    const issueInfo = await this.github.issues.get(issue)

    const isMarked = await this.hasResponseLabel(issue, TO_BE_CLOSED_LABEL)
    if (isMarked && issueInfo.data.user.login === comment.user.login) {
      this.logger.info('%s/%s#%d is being unmarked', owner, repo, number)
      await this.github.issues.removeLabel({owner, repo, number, name: TO_BE_CLOSED_LABEL})
      if (issueInfo.data.state === 'closed' && issueInfo.data.user.login !== issueInfo.data.closed_by.login) {
        this.github.issues.edit({owner, repo, number, state: 'open'})
      }
    }
  }

  private async close (issue: Issue) {
    const { owner, repo, number } = issue
    this.logger.info('%s/%s#%d is being closed', issue.owner, issue.repo, issue.number)
    await this.github.issues.removeLabel({owner, repo, number, name: TO_BE_CLOSED_LABEL})
    return this.github.issues.edit(Object.assign({}, issue, {state: 'closed'}))
  }

  private async findLastLabeledEvent (owner, repo, number) {
    const params = { owner, repo, number, per_page: 100 }
    const events = await (this.github.paginate as any)(this.github.issues.getEvents(params))
    return events[0].data
      .reverse()
      .find(event => event.event === 'labeled' && event.label.name === TO_BE_CLOSED_LABEL);
  }

  private async getClosableIssues () {
    const { owner, repo } = this.context.repo()
    const q = `repo:${owner}/${repo} is:issue is:open label:"${TO_BE_CLOSED_LABEL}"`
    const params = {q, sort: 'updated' as 'updated', order: 'desc' as 'desc', per_page: 30}
    const labeledEarlierThan = this.since(DAYS_UNTIL_CLOSE)

    const issues = await this.github.search.issues(params)
    const closableIssues = scramjet.fromArray(issues.data.items).filter(async issue => {
      const event = await this.findLastLabeledEvent(owner, repo, issue.number)
      const creationDate = new Date(event.created_at)
      return creationDate < labeledEarlierThan
    }).toArray()
    return closableIssues
  }

  private since (days: number) {
    const ttl = days * 24 * 60 * 60 * 1000
    return new Date(Date.now() - ttl)
  }
}
