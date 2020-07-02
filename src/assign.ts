import { Context } from 'probot'
import { labelsResponser } from './config'
import getlatestVersion from 'latest-version'
import * as semver from 'semver'

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

  if (labels.some(l => l.name === 'duplicate')) {
    try {
      await context.github.issues.edit({
        ...context.repo(),
        state: 'closed'
      }) 
    } catch (error) {
      context.log.error(error)
    }
  }

  await assignMilestone(context, labels, number)
}

async function assignMilestone (context: Context, labels: any[], number: number) {
  // const { data: currentMilestone } = await context.github.issues.getMilestone({
  //   ...context.repo(),
  //   number
  // })

  // if (currentMilestone && currentMilestone.id) {
  //   return
  // }

  const latestVersion = await getlatestVersion('@tarojs/runtime')

  const { data: milestones = [] } = await context.github.issues.getMilestones({...context.repo()})

  const nextPatch = semver.inc(latestVersion, 'patch')
  const nextMinor = semver.inc(latestVersion, 'minor')

  if (labels.find(l => l.name === 'P-0' || l.name === 'P-1')) {
    const milestone = milestones.find(m => m.title === nextPatch)
    if (milestone) {
      try {
        await context.github.issues.edit({
          ...context.repo(),
          milestone: milestone.number
        })
      } catch (error) {
        context.log.error(error)
      }
    }
  }

  if (labels.find(l => l.name === 'P-2')) {
    const milestone = milestones.find(m => m.title === nextMinor)
    if (milestone) {
      try {
        await context.github.issues.edit({
          ...context.repo(),
          milestone: milestone.number
        })
      } catch (error) {
        context.log.error(error)
      }
    }
  }
}

export async function informAssignees (context: Context) {
  const { sender, assignee, issue } = context.payload
  if (sender.login === assignee.login) {
    return
  }

  try {
    await context.github.issues.createComment({
      ...context.repo(),
      body: `CC @${assignee.login} `,
      number: issue.number,
    })
  } catch (error) {
    context.log.error(error)
  }
}
