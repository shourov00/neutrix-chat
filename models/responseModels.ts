import { AnnouncementDevice } from '@/models/announcementModels'

export interface VisitorChoice {
  id?: string
  name: string
  responseTime?: number
}

export interface VisitorMeta {
  choices?: VisitorChoice[]
  comment?: string
  commentPreview?: string
  responseTime?: number
}

export interface VisitorQuestion {
  id?: string
  meta?: VisitorMeta
  type: string
}

export interface VisitorQuestions {
  data?: VisitorQuestion[]
}

export interface ResponseMeta {
  questions?: VisitorQuestions
  devices?: AnnouncementDevice[]
  feedback?: string
}

export interface VisitorResponse {
  siteId?: string
  type?: string
  subType?: string
  responseType?: 'survey' | 'announcement' | 'chat-invite'
  responseId?: string
  status?: 'viewed' | 'completed' | 'dismissed'
  meta?: ResponseMeta
  visitor?: Visitor | string
}
