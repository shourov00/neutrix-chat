export enum LocationAudienceSourceEnum {
  ALL = 'all',
  SPECIFIC = 'specific',
}

export enum CommunicationRuleEnumType {
  URL = 'url',
  TIME = 'time',
  DEVICE = 'device',
}

export enum CommunicationRuleURLEnumType {
  ALL = 'all',
  SPECIFIC = 'specific',
}

export enum CommunicationRuleURLMatchEnumType {
  CONTAINS = 'contains',
  EXACT = 'exact',
}

export enum LocationAudienceMatchType {
  CONTAINS = 'contains',
  EXACT = 'exact',
}

export enum SurveyStepEnum {
  INVITE = 'invite',
  QUESTION = 'question',
  THANKS = 'thanks',
  AUDIENCE = 'audience',
  DELIVERY = 'delivery',
  SUMMARY = 'summary',
}

export enum CommunicationStatusEnumType {
  READY = 'ready',
  PAUSED = 'paused',
  ACTIVE = 'active',
  INCOMPLETE = 'incomplete',
}

export enum SurveyEnumType {
  MULTIPLE_CHOICE = 'multipleChoice',
  OPEN_ENDED = 'longText',
  RATING = 'rating',
  LIKE_DISLIKE = 'likeDislike',
}

export enum SurveyEnumSubType {
  SINGLE = 'single',
  SEVERAL = 'several',
}

export interface AudienceRuleValue {
  source?: string
  matchType?: string
  url?: string | null
  delay?: number
  device?: string
}

export interface AudienceRule {
  type: string
  value: AudienceRuleValue
}

export interface AudienceSettings {
  ruleType: string
  randomSamplingPercent: number
  rules: AudienceRule[][]
}

export interface DeliverySettings {
  durationDays: number
  redeliver: string
  redeliverDays: number
  startAt: string
}

export interface InviteSettings {
  buttonNoLabel: string
  buttonYesLabel: string
  enabled: boolean
  includeSubtitle: boolean
  subtitle: string
  title: string
}

export interface QuestionChoices {
  name: string
}

export interface QuestionMeta {
  choices?: QuestionChoices[]
  multipleSelect?: boolean
  includeOther?: boolean
  comment?: string
  commentPreview?: string
}

export interface Question {
  meta?: QuestionMeta
  subtitle?: string | null
  includeSubtitle?: boolean
  id: string
  title?: string
  type?: string
  order?: number
}

export interface QuestionsSettings {
  data: Question[]
}

export interface ThanksButton {
  active: boolean
  label: string
  link: string
}

export interface ThanksSettings {
  placeholder?: string | null
  title: string
  allowFeedback: boolean
  button: ThanksButton | null
  enabled?: boolean
}

export interface Thanks {
  default: ThanksSettings
  lowRating?: ThanksSettings
}

export interface Settings {
  audience: AudienceSettings
  delivery: DeliverySettings
  invite: InviteSettings
  questions: QuestionsSettings
  thanks: Thanks
}

export interface Draft {
  stepsCompleted: string[]
  lastPage: string
  issues: number
}

export interface Survey {
  _id?: string
  name: string
  siteId: string
  type: SurveyEnumType
  subType: SurveyEnumSubType
  status: CommunicationStatusEnumType
  draft: Draft
  settings: Settings
}

export interface WebLocation {
  location: string
  device: string
  delay: string
}

export interface Device {
  id: number
  text: string
}

export interface TriggerDataOption {
  id: number
  option: LocationAudienceMatchType.CONTAINS | string
}

export interface LocationSource {
  id: number
  name: string
  label: string
}
