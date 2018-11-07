import { MarkerConfig, WelcomeConfig } from './interface'

export const TO_BE_CLOSED_LABEL = 'to be closed'

export const DAYS_UNTIL_CLOSE = 15

const newIssueWelcomeComment = `欢迎提交 Issue~

如果你提交的是 bug 报告，请务必遵循 [Issue 模板](https://github.com/NervJS/taro/blob/master/.github/ISSUE_TEMPLATE/bug_report.md)的规范，尽量用简洁的语言描述你的问题，最好能提供一个稳定简单的复现。🙏🙏🙏

如果你的信息提供过于模糊或不足，或者已经其他 issue 已经存在相关内容，你的 issue 有可能会被关闭。`

const newPRWelcomeComment = `欢迎提交 Pull Request~

请检查您的代码符合 [JavaScript Standard Guide](https://github.com/standard/standard) 规范，您的提交信息也应当遵循 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)。

如果相关的包存在测试的话请务必确保所有测试用例都能通过，并添加 PR 内容相关的测试用例。

Taro 非常感谢您对开源事业做出的贡献。👏👏👏`

export const welcomeConfig: WelcomeConfig = {
  newIssueWelcomeComment,
  newPRWelcomeComment
}

function buildComment (str: string) {
  return `Hello~

${str}

如果您在这 15 天中更新更多信息自动关闭的流程会自动取消，如有其他问题也可以发起新的 Issue。

Good luck and happy coding~`
}

export const markerConfigs: MarkerConfig[] = [
  {
    label: '信息不足',
    comment: buildComment('您的问题所提供的信息不足，我们无法定位到具体的问题。如果有空的话还请拔冗提供更具体的信息，否则这个 issue 将在 15 天后被自动关闭。')
  },
  {
    label: '无法复现',
    comment: buildComment('您的问题我们无法复现。如果有空的话还请拔冗提供一个简单的复现 demo，否则这个 issue 将在 15 天后被自动关闭。')
  },
  {
    label: 'answsered',
    comment: buildComment('您的问题楼上已经有回答了，如果没有更多的问题这个 issue 将在 15 天后被自动关闭。')
  },
  {
    label: 'resovled',
    comment: buildComment('您的问题楼上已经提供了解决方案，如果没有更多的问题这个 issue 将在 15 天后被自动关闭。')
  }
]

interface LabelsResponser {
  [key: string]: string[]
}

export const labelsResponser: LabelsResponser = {
  '编译器': ['yuche'],
  'CLI': ['luckyadam'],
  '组件化': ['Chen-jj'],
  'H5 组件库': ['jinjinjin0731'],
  'React Native': ['Pines-Cheng'],
  'H5': ['Littly']
}
