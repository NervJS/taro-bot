import moment from 'moment'
export const markdownContributors = (commits, headDate, tailDate) => {
  console.log('In markdownContributors.js...')
  let data = commits
  if (!data) {
    data = []
  }
  data = data.filter((item) => {
    return moment(item.commit.committer.date).isBetween(tailDate, headDate) && item.author.login !== 'taro-bot[bot]'
  })
  let contributorsString = '# CONTRIBUTORS\n'
  if (data.length === 0) {
    contributorsString += `上周没有贡献者.\n`
  } else {
    let contributors: any[] = []
    data.forEach((item) => {
      contributors.push({ login: item.author.login, html_url: item.author.html_url })
    })
    let uniqueContributors: any = Object.values(contributors.reduce((acc, cul) => Object.assign(acc, {[cul.login]: cul}), {}))
    contributorsString += `上周共有 ${uniqueContributors.length} 名独立贡献者：\n`
    contributorsString += `\n`
    uniqueContributors.forEach((item) => {
      contributorsString += `:bust_in_silhouette: [${item.login}](${item.html_url})\n`
    })
    contributorsString += `\n`
    contributorsString += `感谢你们对开源事业做出的贡献。:+1:`

  }
  return contributorsString
}
