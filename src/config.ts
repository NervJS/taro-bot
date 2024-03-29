import { MarkerConfig, WelcomeConfig } from './interface'


// 倒数关闭的 issue 标签名字
export const TO_BE_CLOSED_LABEL = 'to be closed'

// 倒数关闭时间
export const DAYS_UNTIL_CLOSE = 7

// 首次提交 issue 的欢迎语
const newIssueWelcomeComment = `欢迎提交 Issue~

如果你提交的是 bug 报告，请务必遵循 [Issue 模板](https://github.com/NervJS/taro/blob/master/.github/ISSUE_TEMPLATE/bug_report.md)的规范，尽量用简洁的语言描述你的问题，最好能提供一个稳定简单的复现。🙏🙏🙏

如果你的信息提供过于模糊或不足，或者已经其他 issue 已经存在相关内容，你的 issue 有可能会被关闭。

Good luck and happy coding~`

// 首次提交 PR 的欢迎语
const newPRWelcomeComment = `欢迎提交 PR~ Taro 非常感谢您对开源事业做出的贡献！🌷🌷🌷

一般 PR 会在**一到两周**内进行 review，成功合入后会随下一个版本进行发布。

Review 需要耗费大量时间，所以请遵循以下规范，协助我们提高 review 效率🙏🙏🙏

1. 详细介绍 PR 的背景（**非常重要**，例如解决了什么问题，该问题如何复现等）
2. 确保 CI 顺利运行。
3. 最好能提供对应的测试用例。

为了更好地进行沟通，请加入 Taro 开发者微信群：

<img src="http://storage.360buyimg.com/taro-jd-com/static/contact_taro_devlop_qr.png" width="200px" height="200px">
`

export const welcomeConfig: WelcomeConfig = {
  newIssueWelcomeComment,
  newPRWelcomeComment
}

export const ISSUE_HELPER_MESSAGE = '<!-- generated by taro-issues. 请勿修改或删除此行注释 -->'

export const INVALID_MESSAGE = `您的 Issue 没有按照规范从 [Taro Issue Helper]() 创建，因此会被直接关闭。

维护开源项目是一项非常辛苦的工作，还请多多包涵。
[了解为什么这么严格？](https://nervjs.github.io/taro-issue-helper/#why-strict)
`



// 自动关闭 issue 的模板
function buildComment (str: string) {
  return `Hello~

${str}

如果您在这 ${DAYS_UNTIL_CLOSE} 天中更新更多信息自动关闭的流程会自动取消，如有其他问题也可以发起新的 Issue。

Good luck and happy coding~`
}


// 需要自动关闭的 issue 标签
export const markerConfigs: MarkerConfig[] = [
  // {
  //   label: '信息不足',
  //   comment: buildComment(`您的问题所提供的信息不足，我们无法定位到具体的问题。如果有空的话还请拔冗提供更具体的信息，否则这个 issue 将在 ${DAYS_UNTIL_CLOSE} 天后被自动关闭。`)
  // },
  // {
  //   label: '需要复现',
  //   comment: buildComment(`您的问题我们无法复现。如果有空的话还请拔冗提供一个简单的复现 demo，否则这个 issue 将在 ${DAYS_UNTIL_CLOSE} 天后被自动关闭。`)
  // },
  // {
  //   label: 'answered',
  //   comment: buildComment(`您的问题楼上已经有了确切的回答，如果没有更多的问题这个 issue 将在 ${DAYS_UNTIL_CLOSE} 天后被自动关闭。`)
  // },
  {
    label: 'resolved',
    comment: buildComment(`你的问题楼上已经提供了解决方案，如果没有更多的问题这个 issue 将在 ${DAYS_UNTIL_CLOSE} 天后被自动关闭。`)
  },
  {
    label: 'wonfix',
    comment: buildComment(`这个问题由于客观原因不会被修复，如果没有更多的问题这个 issue 将在 ${DAYS_UNTIL_CLOSE} 天后被自动关闭。`)
  }
]

interface LabelsResponser {
  [key: string]: string[]
}

// 根据标签自动指派负责人，如果不是自己指派自己，就新建评论 at 负责人
export const labelsResponser: LabelsResponser = {
  'A-typings': ['ZakaryCode'],
  'A-runner': ['Chen-jj'],
  'A-cli': ['Chen-jj'],
  'A-taroize': ['luckyadam'],
  'A-rn': ['Pines-Cheng'],
  'A-runtime': ['Chen-jj']
}
