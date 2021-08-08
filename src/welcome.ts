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
  const { repository, pull_request } = context.payload
  const user = pull_request.user.login

  const res = await context.github.repos.getContributors({
    owner: repository.owner.login,
    repo: repository.name,
    per_page: 30
  })

  const contributors = res.data.map(item => item.login)

  // 老熟人就不需要回复了
  if (contributors.includes(user)) return

  try {
    await context.github.issues.createComment(context.issue({body: welcomeConfig.newPRWelcomeComment}))
  } catch (err) {
    if (err.code !== 404) {
      context.log.info(err)
    }
  }
}
