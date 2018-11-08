import { Context } from 'probot'
import { getAllIssues, getStargazers, getReleases, getAllPullRequests } from './utils'
import { markdownIssues } from './markdown-issue'
import { markdownPullRequests } from './markdown-pr'
import { markdownStargazers } from './markdown-star'
import { markdownReleases } from './markdown-release'

export const markdownBody = async (context: Context, headDate: string, tailDate: string) => {
  let body = ''
  const issues = await getAllIssues(context, tailDate)
  const pullRequests = await getAllPullRequests(context)
  const stargazers = await getStargazers(context)
  const releases = await getReleases(context)

  const pullRequestsString = markdownPullRequests(pullRequests, headDate, tailDate)
  const issuesString = markdownIssues(issues, headDate, tailDate)
  const stargazersString = markdownStargazers(stargazers, headDate, tailDate)
  const releasesString = markdownReleases(releases, headDate, tailDate)

  if (issuesString) {
    body += `\n - - - \n`
    body += issuesString
  }
  if (pullRequestsString) {
    body += `\n - - - \n`
    body += pullRequestsString
  }
  if (stargazersString) {
    body += `\n - - - \n`
    body += stargazersString
  }
  if (releasesString) {
    body += `\n - - - \n`
    body += releasesString
  }

  body += `\n - - - \n`
  body += '\n'
  return body
}
