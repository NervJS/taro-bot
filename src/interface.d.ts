export interface Issue {
  owner: string
  repo: string
  number: number
}

export interface MarkerConfig {
  label: string,
  comment: string
}

export interface WelcomeConfig {
  newIssueWelcomeComment: string,
  newPRWelcomeComment: string
}
