import { AudienceSettings, CommunicationStatusEnumType } from './surveyModels'
import { AnnouncementDevice } from '@/models/announcementModels'

export interface RuleValue {
  source?: 'all' | 'specific'
  matchType?: 'contains' | 'exact'
  url?: string
}

export interface Rule {
  type?: string
  value?: RuleValue
}

export interface Icon {
  iconType?: 'user' | 'company' | 'none'
  id?: string
}

export enum ChatInviteTimingEnumType {
  ALWAYS = 'always',
  SPECIFIC = 'specific',
}

export interface Timing {
  timingType?: ChatInviteTimingEnumType
}

export interface SendTo {
  teams?: string[]
  users?: string[]
}

export interface PreQualification {
  active?: boolean
  name?: {
    label?: string
    active?: boolean
  }
  contact?: {
    label?: string
    active?: boolean
  }
  question?: {
    label?: string
    active?: boolean
  }
  submit?: {
    label?: string
  }
}

export interface ChatInviteSettings {
  audience: AudienceSettings
  displayFullMessage?: boolean
  autoHide?: boolean
  preQualification?: PreQualification
  icon?: Icon
  message?: string
  sendTo?: SendTo
  timing?: Timing
}

export interface ChatInvite {
  _id?: string
  name: string
  siteId?: string
  status?: CommunicationStatusEnumType
  settings: ChatInviteSettings
}

export interface ChatInviteResponseProps {
  status?: 'viewed' | 'completed' | 'dismissed'
  chatInvite: ChatInvite
  devices: AnnouncementDevice[]
  responseTime?: number
}
