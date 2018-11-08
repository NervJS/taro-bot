import moment from 'moment'
import { Context } from 'probot'
import { activate } from 'nock';

export const getHeadDate = () => {
  return moment.utc().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format()
}

export const getTailDate = () => {
  return moment.utc().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format()
}

const getDayBeforeDate = (date) => {
  return moment(date).subtract(1, 'days').format()
}

export async function getAllIssues (context: Context, tailDate: string) {
  // method returns all the issues and pull requests
  const { owner, repo } = context.repo()
  return await context.github.paginate(
    context.github.issues.getForRepo({
      owner,
      repo,
      state: 'all',
      since: tailDate,
      per_page: 100
    }),
    res => res.data
  )
}

export async function getAllPullRequests (context: Context) {
  const { owner, repo } = context.repo()
  // method returns all the pull requests
  let pullRequests = await context.github.paginate(
    context.github.pullRequests.getAll({
      owner,
      repo,
      state: 'all',
      per_page: 100
    }),
    res => res.data
  )
  return pullRequests
}

export const getCommits = async (context: Context, tailDate) => {
  const { owner, repo } = context.repo()
  let commits = await context.github.paginate(
    context.github.repos.getCommits({
      owner,
      repo,
      since: tailDate,
      per_page: 100
    }),
    res => res.data
  )
  return commits
}


export const getContributors = async (context: Context) => {
  const { owner, repo } = context.repo()
  let contributors = await context.github.paginate(
    context.github.repos.getContributors({
      owner,
      repo,
      per_page: 100
    }),
    res => res.data
  )
  return contributors
}

export const getReleases = async (context: Context) => {
  const { owner, repo } = context.repo()
  let releases = await context.github.paginate(
    context.github.repos.getReleases({
      owner,
      repo,
      per_page: 100
    }),
    res => res.data
  )
  return releases
}

export const getSearchIssues = async (context: Context, {owner, repo, date, label, type}): Promise<any> => {
  let searchIssues = await context.github.search.issues({
    q: `repo:${owner}/${repo} type:${type} label:"${label}" created:>=${date}`,
    per_page: 100
  })
  return searchIssues
}


export const getStargazers = async (context: Context) => {
  const { owner, repo } = context.repo()
  let stargazers = await context.github.paginate(
    context.github.activity.getStargazersForRepo({
      owner,
      repo,
      headers: {
        accept: 'application/vnd.github.v3.star+json'
      }
    } as any ),
    res => res.data
  )
  return stargazers
}

export const checkDuplicates = async (context: Context, headDate: string) => {
  const { owner, repo } = context.repo()
  const label = 'weekly-digest'
  const type = 'issues'
  const date = getDayBeforeDate(headDate).substr(0, 19)
  const issues = await getSearchIssues(context, {owner, repo, date, label, type})
  const totalCount = issues.data.total_count
  return totalCount >= 1
}

export const getMouthName = (month: number) => {
  return `${month + 1} 月`
}

export const getNumDayFromLongDay = (day) => {
  if (typeof day === 'number' && day >= 0 && day < 7) {
    return day
  } else {
    const longDay = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ]
    for (let i = 0; i < 7; i++) {
      if (longDay[i].includes(String(day).toLowerCase())) {
        return i
      }
    }
  }
  return null
}
