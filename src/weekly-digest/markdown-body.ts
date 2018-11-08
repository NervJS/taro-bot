import { Context } from 'probot'
import { getAllIssues, getStargazers, getReleases, getAllPullRequests, getCommits } from './utils'
import { markdownIssues } from './markdown-issue'
import { markdownPullRequests } from './markdown-pr'
import { markdownStargazers } from './markdown-star'
import { markdownReleases } from './markdown-release'
import { markdownCommits } from './markdown-commit'
import { markdownContributors } from './markdown-contributors'

export const markdownBody = async (context: Context, headDate: string, tailDate: string) => {
  let body = ''
  const issues = await getAllIssues(context, tailDate)
  const pullRequests = await getAllPullRequests(context)
  const commits = await getCommits(context, tailDate)
  const stargazers = await getStargazers(context)
  // const releases = await getReleases(context)

  const pullRequestsString = markdownPullRequests(pullRequests, headDate, tailDate)
  const issuesString = markdownIssues(issues, headDate, tailDate)
  const stargazersString = markdownStargazers(stargazers, headDate, tailDate)
  const commitsString = markdownCommits(commits, headDate, tailDate)
  const contributorsString = markdownContributors(commits, headDate, tailDate)
  // const releasesString = markdownReleases(releases, headDate, tailDate)

  if (issuesString) {
    body += `\n - - - \n`
    body += issuesString
  }
  if (pullRequestsString) {
    body += `\n - - - \n`
    body += pullRequestsString
  }
  if (commitsString) {
    body += `\n - - - \n`
    body += commitsString
  }
  if (contributorsString) {
    body += `\n - - - \n`
    body += contributorsString
  }
  if (stargazersString) {
    body += `\n - - - \n`
    body += stargazersString
  }
  // if (releasesString) {
  //   body += `\n - - - \n`
  //   body += releasesString
  // }

  body += `\n - - - \n`
  body += '\n'
  body += `以上就是本周的项目周报。你可以点击 [weekly-digest](https://github.com/NervJS/taro/issues?q=is%3Aopen+is%3Aissue+label%3Aweekly-digest) 查看往期的项目周报。`
  return body
}
