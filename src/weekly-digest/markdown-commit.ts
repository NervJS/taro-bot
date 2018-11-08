import moment from 'moment'

export const markdownCommits = (commits, headDate, tailDate) => {
  console.log('In markdown commits...')
  let commitsString = '# COMMITS\n'
  let data = commits
  if (!data) {
    data = []
  }
  data = data.filter((item) => {
    return moment(item.commit.committer.date).isBetween(tailDate, headDate) && item.author.login !== 'taro-bot[bot]'
  })
  if (data.length === 0) {
    commitsString += `上周没有提交。\n`
  } else {
    commitsString += `上周共有 ${data.length} 个 提交：\n`
    commitsString += `\n`
    data.forEach((item) => {
      commitsString += `:hammer_and_wrench: [${item.commit.message.replace(/\n/g, ' ')}](${item.html_url}) by [${item.author.login}](${item.author.html_url})\n`
    })
  }
  return commitsString
}