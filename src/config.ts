import { MarkerConfig, WelcomeConfig } from './interface'

export const TO_BE_CLOSED_LABEL = 'to be closed'

export const DAYS_UNTIL_CLOSE = 15

export const welcomeConfig: WelcomeConfig = {
  newIssueWelcomeComment: '',
  newPRWelcomeComment: ''
}

function buildComment (str: string) {
  return `Hello~

${str}

如果您在这 15 天中更新更多信息自动关闭的流程会自动取消，如有其他问题也可以发起新的 Issue。

Good luck and happy coding~
`
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
