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
        await context.github.issues.createComment(context.issue({ body: welcomeConfig.newIssueWelcomeComment }))
      } catch (err) {
        if (err.code !== 404) {
          context.log.info(err)
        }
      }
    }
  
    const countPR = response.data.find(data => !!data.pull_request)
  
    if (countPR && type === 'pr') {
      try {
        await context.github.issues.createComment(context.issue({body: welcomeConfig.newPRWelcomeComment}))
      } catch (err) {
        if (err.code !== 404) {
          context.log.info(err)
        }
      }
    }
  }
}

export const welcomeNewIssue = welcome('issue')

export const welcomeNewPR = async function (context: Context) {
  try {
    await context.github.issues.createComment(context.issue({body: welcomeConfig.newPRWelcomeComment}))
  } catch (err) {
    if (err.code !== 404) {
      context.log.info(err)
    }
  }
}
