
import moment from 'moment'

export const markdownReleases = (releases: any[], headDate: string, tailDate: string) => {
  let releaseString = '# RELEASES\n'
  let data = releases || []
  data = data.filter((item) => {
    return moment(item.published_at).isBetween(tailDate, headDate)
  })
  if (data.length === 0) {
    releaseString += `上周没有发布新版本。\n`
  } else {
    releaseString += `上周有 ${data.length} 个新版本发布。\n`
    data.forEach((item) => {
      releaseString += `:rocket: [${item.tag_name.replace(/\n/g, ' ')}${(item.name != null) ? ` ${item.name.replace(/\n/g, ' ')}` : ''}](${item.html_url})\n`
    })
  }
  return releaseString
}
