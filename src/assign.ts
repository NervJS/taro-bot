import { Context } from 'probot'
import { labelsResponser } from './config'

export async function assignAccordingLabel (context: Context) {
  const { issue: { labels, number } } = context.payload
  context.log.info(labels, number)
  for (const labelName in labelsResponser) {
    if (labelsResponser.hasOwnProperty(labelName)) {
      const responsers = labelsResponser[labelName]
      const label = labels.find(({ name }) => name === labelName)
      context.log.info(responsers, label)
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
  const { sender, assignees } = context.payload
  const isSelfAssign = assignees.some((a => a.login === sender.login))
  if (isSelfAssign) {
    return
  }

  try {
    await Promise.all(assignees.map(a => context.github.issues.createComment({
      body: `CC @${a.login} `,
      ...context.repo()
    })))
  } catch (error) {
    context.log.error(error)
  }
}
