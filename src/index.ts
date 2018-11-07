import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { Marker } from './marker'
import { Closeable } from './close'
import { welcomeNewIssue, welcomeNewPR } from './welcome'
import { assignAccordingLabel, informAssignees } from './assign'
import { markerConfigs } from './config'

const createScheduler = require('probot-scheduler')

export = (robot: Application) => {
  robot.on('pull_request.opened', welcomeNewPR)

  robot.on('issues.opened', welcomeNewIssue)

  robot.on('issues.labeled', assignAccordingLabel)

  robot.on('issues.assigned', informAssignees)

  async function sweep (context: Context) {
    markerConfigs.forEach((config) => {
      const marker = new Marker(context, context.log, config)
      marker.sweep()
    })
    const closeable = new Closeable(context, context.log)
    closeable.sweep()
  }

  async function unmark (context: Context) {
    const closeable = new Closeable(context, context.log)
    closeable.unmark(context.issue())
  }

  createScheduler(robot)

  robot.on('schedule.repository', sweep)

  robot.on('issue_comment', unmark)

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
