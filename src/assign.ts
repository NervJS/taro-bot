import { Context } from 'probot'
import { labelsResponser } from './config'

export async function assignAccordingLabel (context: Context) {
  const { issue: { labels, number } } = context.payload
  for (const labelName in labelsResponser) {
    if (labelsResponser.hasOwnProperty(labelName)) {
      const responsers = labelsResponser[labelName]
      const label = labels.find(({ name }) => name === labelName)
      if (!label) {
        continue
      }
      try {
        const repo = context.repo()
        await context.github.issues.addAssigneesToIssue({
          number,
          assignees: responsers,
          ...repo
        })
      } catch (error) {
        context.log.error(error)
      }
    }
  }
}

export async function informAssignees (context: Context) {
  const { sender, assignee } = context.payload
  if (sender.login === assignee.login) {
    return
  }

  try {
    await context.github.issues.createComment({
      body: `CC @${assignee.login} `,
      ...context.repo()
    })
  } catch (error) {
    context.log.error(error)
  }
}
