export enum AnnouncementStepEnum {
  CONTENT = 'content',
  AUDIENCE = 'audience',
  DELIVERY = 'delivery',
  SUMMARY = 'summary',
}

export enum AnnouncementEnumType {
  STICKER = 'sticker',
  LIGHTBOX = 'lightbox',
}

export enum LocationAudienceSourceEnum {
  ALL = 'all',
  SPECIFIC = 'specific',
}

export enum LocationAudienceMatchType {
  CONTAINS = 'contains',
  EXACT = 'exact',
}

export enum AnnouncementCategoryEnumType {
  PROMO = 'promo',
  UPDATES = 'update',
  EVENT = 'event',
}

export enum SurveyStepEnum {
  INVITE = 'invite',
  QUESTION = 'question',
  THANKS = 'thanks',
  AUDIENCE = 'audience',
  DELIVERY = 'delivery',
  SUMMARY = 'summary',
}

export enum SurveyStatusEnumType {
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

interface AudienceSettings {
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
}

export interface Question {
  meta?: QuestionMeta
  subtitle?: string | null
  includeSubtitle?: boolean
  id?: string
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
}

export interface Thanks {
  default: ThanksSettings
  lowRating?: (ThanksSettings & { enabled: boolean }) | null
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
  status: SurveyStatusEnumType
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
