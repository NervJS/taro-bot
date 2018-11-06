import { MarkerConfig, WelcomeConfig } from './interface'

export const TO_BE_CLOSED_LABEL = 'to be closed'

export const DAYS_UNTIL_CLOSE = 15

export const welcomeConfig: WelcomeConfig = {
  newIssueWelcomeComment: '',
  newPRWelcomeComment: ''
}

export const markerConfigs: MarkerConfig[] = []

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
