import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { Marker } from './marker'

const createScheduler = require('probot-scheduler')

export = (robot: Application) => {
  createScheduler(robot)

  robot.on('schedule.repository', sweep)

  async function sweep (context: Context) {
    const marker = new Marker(context, context.log, { label: 'resolved', comment: 'test' })
    marker.sweep()
  }
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
