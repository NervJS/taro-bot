
import moment from 'moment'

export const markdownIssues = (issues: any[], headDate: string, tailDate: string) => {
  let issuesString = `# ISSUES\n`
  let data = issues || []
  data = data.filter((item) => {
    return moment(item.created_at).isBetween(tailDate, headDate) && (item.user.login !== 'taro-bot[bot]')
  })
  if (data.length === 0) {
    issuesString += `上周没有新 issue。\n`
  } else {
    let openIssueString
    let closedIssueString
    issuesString += `上周有 ${data.length} 个新 issue。\n`
    let openIssue = data.filter((item) => item.state === 'open')
    if (openIssue.length > 0) {
      openIssueString = `## OPEN ISSUES\n`
    }
    let closedIssue = data.filter((item) => item.state === 'closed')
    if (closedIssue.length > 0) {
      closedIssueString = `## CLOSED ISSUES\n`
    }
    if (data.length === 1 && openIssue.length === 1) {
      issuesString += `这个 issue 仍然保持打开。\n`
    } else if (data.length === 1 && closedIssue.length === 1) {
      issuesString += `这个 issue 已经关闭。\n`
    } else {
      issuesString += `${closedIssue.length} 个 issue 已经被关闭，${openIssue.length} 个 issue 仍然保持打开状态。\n`
    }
    openIssue.forEach((item) => {
      openIssueString += `:green_heart: #${item.number} [${item.title.replace(/\n/g, ' ')}](${item.html_url}), by [${item.user.login}](${item.user.html_url})\n`
    })
    closedIssue.forEach((item) => {
      closedIssueString += `:heart: #${item.number} [${item.title.replace(/\n/g, ' ')}](${item.html_url}), by [${item.user.login}](${item.user.html_url})\n`
    })
    if (openIssueString) {
      issuesString += openIssueString
    }
    if (closedIssueString) {
      issuesString += closedIssueString
    }
  }
  return issuesString
}
