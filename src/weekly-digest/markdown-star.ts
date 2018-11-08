
import moment from 'moment'

export const markdownStargazers = (stargazers: any[], headDate: string, tailDate: string) => {
  console.log('In markdownStargazers.js...')
  let stargazersString = `# STARGAZERS\n`
  let data = stargazers || []
  data = data.filter((item) => {
    return moment(item.starred_at).isBetween(tailDate, headDate)
  })
  if (data.length === 0) {
    stargazersString += `上周没有新的 star.\n`
  } else {
    stargazersString += `上周获得了 ${data.length} 个 star。它们分别来自于：\n`
    data.forEach((item) => {
      stargazersString += `:star: [${item.user.login}](${item.user.html_url}) | `
    })
    stargazersString += `You all are the stars! :star2:\n`
  }
  return stargazersString
}
