
import moment from 'moment'
export const markdownPullRequests = (pullRequests: any[], headDate: string, tailDate: string) => {
  let pullRequestsString = `# PULL REQUESTS\n`
  let data = pullRequests || []
  data = data.filter((item) => {
    if (moment(item.created_at).isBetween(tailDate, headDate) && item.state === 'open' && !item.merged_at && moment(item.created_at).isSame(item.updated_at) && item.user.login !== 'weekly-digest[bot]') {
      return true
    }
    if (moment(item.updated_at).isBetween(tailDate, headDate) && item.state === 'open' && !item.merged_at && item.user.login !== 'weekly-digest[bot]') {
      return true
    }
    if (moment(item.merged_at).isBetween(tailDate, headDate) && item.state === 'closed' && item.user.login !== 'weekly-digest[bot]') {
      return true
    }
    return false
  })
  if (data.length === 0) {
    pullRequestsString += '上周 pull request 被创建、更新或 merge。\n'
  } else {
    pullRequestsString += ` 上周有 ${data.length} 个 pull request 被创建、更新或 merge。\n`
    let openPullRequest = data.filter((item) => {
      return moment(item.created_at).isBetween(tailDate, headDate) && moment(item.created_at).isSame(item.updated_at) && !item.merged_at
    })
    let updatedPullRequest = data.filter((item) => {
      return moment(item.updated_at).isBetween(tailDate, headDate) && !moment(item.updated_at).isSame(item.created_at) && !item.merged_at
    })
    let mergedPullRequest = data.filter((item) => {
      return item.merged_at && moment(item.merged_at).isBetween(tailDate, headDate)
    })
    let mergedPullRequestString
    let openPullRequestString
    let updatedPullRequestString
    if (mergedPullRequest.length > 0) {
      mergedPullRequestString = '## MERGED PULL REQUEST\n'
      mergedPullRequestString += `上周 merge 了 ${mergedPullRequest.length} 个 pull request。\n`
      mergedPullRequest.forEach((item) => {
        mergedPullRequestString += `:purple_heart: #${item.number} [${item.title.replace(/\n/g, ' ')}](${item.html_url}), by [${item.user.login}](${item.user.html_url})\n`
      })
    }
    if (openPullRequest.length > 0) {
      openPullRequestString = '## OPEN PULL REQUEST\n'
      openPullRequestString += `上周打开了 ${openPullRequest.length} 个 pull request。\n`
      openPullRequest.forEach((item) => {
        openPullRequestString += `:green_heart: #${item.number} [${item.title.replace(/\n/g, ' ')}](${item.html_url}), by [${item.user.login}](${item.user.html_url})\n`
      })
    }
    if (updatedPullRequest.length > 0) {
      updatedPullRequestString = '## UPDATED PULL REQUEST\n'
      updatedPullRequestString += `上周有 ${updatedPullRequest.length} 个 pull request 更新。\n`
      updatedPullRequest.forEach((item) => {
        updatedPullRequestString += `:yellow_heart: #${item.number} [${item.title.replace(/\n/g, ' ')}](${item.html_url}), by [${item.user.login}](${item.user.html_url})\n`
      })
    }
    if (typeof openPullRequestString !== 'undefined') {
      pullRequestsString += openPullRequestString
    }
    if (typeof updatedPullRequestString !== 'undefined') {
      pullRequestsString += updatedPullRequestString
    }
    if (typeof mergedPullRequestString !== 'undefined') {
      pullRequestsString += mergedPullRequestString
    }
  }
  return pullRequestsString
}
