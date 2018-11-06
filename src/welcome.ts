import { Context } from 'probot'
import { welcomeConfig } from './config'

function welcome (type: 'issue' | 'pr') {
  return async (context: Context) => {
    const response = await context.github.issues.getForRepo(context.repo({
      state: 'all',
      creator: context.payload.issue.user.login
    }))
  
    const countIssue = response.data.find(data => !data.pull_request)
    if (countIssue && type === 'issue') {
      try {
        context.github.issues.createComment(context.issue({ body: welcomeConfig.newIssueWelcomeComment }))
      } catch (err) {
        if (err.code !== 404) {
          context.log.info(err)
        }
      }
    }
  
    const countPR = response.data.find(data => !!data.pull_request)
  
    if (countPR && type === 'pr') {
      try {
        context.github.issues.createComment(context.issue({body: welcomeConfig.newPRWelcomeComment}))
  
      } catch (err) {
        if (err.code !== 404) {
          context.log.info(err)
        }
      }
    }
  }
}

export const welcomeNewIssue = welcome('issue')
export const welcomeNewPR = welcome('pr')
