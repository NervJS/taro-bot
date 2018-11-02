import { GitHubAPI } from 'probot/lib/github'
import { LoggerWithTarget } from 'probot/lib/wrap-logger'
import { Context } from 'probot'

interface Config {
  label: string,
  comment: string
}

export class App {
  protected context: Context
  protected github: GitHubAPI
  protected logger: LoggerWithTarget
  protected config: Config
  static TO_BE_CLOSED_LABEL = 'to-be-closed'

  constructor (context: Context, github: GitHubAPI, logger: LoggerWithTarget, config: Config) {
    this.context = context
    this.github = github
    this.logger = logger
    this.config = config
  }

  protected async ensureLabelExists (name: string): Promise<any> {
    return this.github.issues.getLabel(this.context.repo({ name })).catch(() => {
      return this.github.issues.createLabel(this.context.repo({ name, color: '#E0E0E0' }))
    })
  }

}
