
import { Context } from 'probot'
import { ISSUE_HELPER_MESSAGE, INVALID_MESSAGE } from './config'

export async function validate (context: Context) {
  const response = await context.github.issues.getForRepo(context.repo({
    state: 'all',
    creator: context.payload.issue.user.login
  }))

  const issue = response.data.find(data => !data.pull_request)

  if (
    issue == null ||
    issue.labels.some(l => l.name === 'Announcement')
  ) {
    return
  }

  if (!issue.body || !issue.body.includes(ISSUE_HELPER_MESSAGE)) {
    const res = await context.github.issues.listComments(context.repo({
      ...context.repo(),
      number: context.payload.issue.number,
    })) || { data: [] }

    if (!res.data.some(comment => comment.body.includes(INVALID_MESSAGE))) {
      await context.github.issues.createComment(context.issue({
        body: INVALID_MESSAGE
      }))
    }

    if (context.payload.issue.state === 'closed') {
      return
    }

    try {
      await context.github.issues.edit({
        ...context.repo(),
        number: context.payload.issue.number,
        state: 'closed'
      }) 
    } catch (error) {
      context.log.error(error)
    }
  }
}
