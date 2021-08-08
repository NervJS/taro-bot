import moment, { MomentObjectOutput } from 'moment'
import { Context } from 'probot'
import { LoggerWithTarget } from 'probot/lib/wrap-logger'
import { getMouthName, getHeadDate, getTailDate, checkDuplicates, getNumDayFromLongDay } from './utils'
import { markdownBody } from './markdown-body'
import { App } from '../app'

const WEEKLY_DIGEST = 'weekly-digest'

function buildDate (date: MomentObjectOutput) {
  return `${date.years} 年 ${getMouthName(date.months)} ${date.date} 日`
}

export class WeeklyDigest extends App {
  constructor (context: Context, logger: LoggerWithTarget) {
    super(context, logger)
  }

  async sweep () {
    await this.ensureLabelExists(WEEKLY_DIGEST, '9C27B0')

    const headDate = getHeadDate()
    const tailDate = getTailDate()

    let hasDuplicates = await checkDuplicates(this.context, headDate)
    if (hasDuplicates) {
      return
    }

    if (moment.utc().day() === getNumDayFromLongDay(6)) {
      await this.digest(headDate, tailDate)
    }
  }

  private async digest (headDate: string, tailDate: string) {
    const headDateObject = moment(headDate).toObject()
    const tailDateObject = moment(tailDate).toObject()
    const title = `项目周报 (${buildDate(tailDateObject)} - ${buildDate(headDateObject)})`
    const body = await markdownBody(this.context, headDate, tailDate)
    const labels = [WEEKLY_DIGEST]

    // 删除上一个周报
    await this.closeLastDigest()

    await this.createIssue({ title, body, labels })
    console.log('released')
    // console.log(title, labels, body)
    // console.log(title)
    // console.log(body)
  }

  private async createIssue ({ title, body, labels }) {
    const { owner, repo } = this.context.repo()
    // method is used to create issues
    await this.context.github.issues.create({
      owner,
      repo,
      title,
      body,
      labels
    })
  }

  private async closeLastDigest () {
    const { context } = this
    const res = await context.github.issues.getForRepo(context.repo({
      labels: WEEKLY_DIGEST
    }))
    const openWeeklyDigest = res.data.find(item => item.state === 'open')
    if (openWeeklyDigest) {
      await context.github.issues.edit({
        ...context.repo(),
        number: openWeeklyDigest.number,
        state: 'closed'
      })
      console.log(`close weekly digest: #${openWeeklyDigest.number}`)
    }
  }
  
}
