import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { Marker } from './marker'
import { Closeable } from './close'
// import { welcomeNewIssue, welcomeNewPR } from './welcome'
import { assignAccordingLabel, informAssignees } from './assign'
import { markerConfigs } from './config'
import { WeeklyDigest } from './weekly-digest/digest'
import { validate } from './validate'

const createScheduler = require('probot-scheduler')

export = (robot: Application) => {
  // robot.on('pull_request.opened', welcomeNewPR)

  robot.on('issues.opened', validate)

  robot.on('issues.labeled', assignAccordingLabel)

  // robot.on('issues.assigned', informAssignees)

  async function sweep (context: Context) {
    const markers = markerConfigs.map((config) => {
      const marker = new Marker(context, context.log, config)
      return marker.sweep()
    })
    const closeable = new Closeable(context, context.log)
    const weeklyDigest = new WeeklyDigest(context, context.log)
    await Promise.all([...markers, closeable.sweep(), weeklyDigest.sweep()])
  }

  async function unmark (context: Context) {
    const closeable = new Closeable(context, context.log)
    await closeable.unmark(context.issue())
  }

  createScheduler(robot)

  robot.on('schedule.repository', sweep)

  robot.on('issue_comment', unmark)

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
