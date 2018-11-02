import { GitHubAPI } from 'probot/lib/github'
import { LoggerWithTarget } from 'probot/lib/wrap-logger'
import { Context } from 'probot'

export class App {
  protected context: Context
  protected github: GitHubAPI
  protected logger: LoggerWithTarget
  static toBeClosedLabel = 'to-be-closed'

  constructor (context: Context, logger: LoggerWithTarget) {
    this.context = context
    this.github = context.github
    this.logger = logger
  }

  protected async ensureLabelExists (name: string): Promise<any> {
    return this.github.issues.getLabel(this.context.repo({ name })).catch(() => {
      return this.github.issues.createLabel(this.context.repo({ name, color: '#E0E0E0' }))
    })
  }

}
