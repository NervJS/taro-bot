import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { Marker } from './marker'
import { welcomeNewIssue, welcomeNewPR } from './welcome'
import { assignAccordingLabel, informAssignees } from './assign'

const createScheduler = require('probot-scheduler')

export = (robot: Application) => {
  createScheduler(robot)

  robot.on('schedule.repository', sweep)

  robot.on('pull_request.opened', welcomeNewPR)

  robot.on('issues.opened', welcomeNewIssue)

  robot.on('issues.labeled', assignAccordingLabel)

  robot.on('issues.assigned', informAssignees)

  async function sweep (context: Context) {
    const marker = new Marker(context, context.log, { label: 'resolved', comment: 'test' })
    marker.sweep()
  }
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
