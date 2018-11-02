import { LoggerWithTarget } from 'probot/lib/wrap-logger'
import { Context } from 'probot'
import { App } from './app'
import { TO_BE_CLOSED_LABEL } from "./config"

const scramjet = require('scramjet')

interface Config {
  label: string,
  comment: string
}

export class Marker extends App {
  private config: Config

  constructor (context: Context, logger: LoggerWithTarget, config: Config) {
    super(context, logger)
    this.config = config
  }

  async sweep () {
    this.logger.debug('Starting sweep')

    await this.ensureLabelExists(this.context.repo({name: this.config.label }).name)

    const markableIssues = await this.getMarkableIssue()

    markableIssues.forEach(({ number }) => this.mark(number))
  }

  private async mark (number: number) {
    const { comment } = this.config

    const repo = this.context.repo({ number })
    console.log(number)
    // await this.github.issues.addLabels({
    //   labels: [TO_BE_CLOSED_LABEL],
    //   ...repo
    // })

    // await this.github.issues.createComment({
    //   body: comment,
    //   ...repo
    // })
  }

  private async getMarkableIssue () {
    const { owner, repo } = this.context.repo()
    const { label } = this.config
    const q = `repo:${owner}/${repo} is:issue is:open label:"${label}"`
    const params = { q, sort: 'updated' as 'updated', order: 'desc' as 'desc', per_page: 30 }
    const issues = await this.github.search.issues(params)
    const markableIssues = scramjet.fromArray(issues.data.items).filter(async (issue) => {
      return await this.hasResponseLabel({ owner, repo, number: issue.number }, label)
    }).toArray()
    return markableIssues
  }
}
