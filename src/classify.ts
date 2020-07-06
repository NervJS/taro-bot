
import { Context } from 'probot'

export async function classify (context: Context) {
  const response = await context.github.issues.getForRepo(context.repo({
    state: 'all',
    creator: context.payload.issue.user.login
  }))

  const issue = response.data.find(data => !data.pull_request)

  if (!issue) return

  const repo = context.repo({ number: issue.number })

  const match = /<!--labels=(.*)-->/g.exec(issue.body)

  if (!match || !match[1]) return

  const labels = match[1].split(',')

  await context.github.issues.addLabels({
    labels,
    ...repo
  })
}
