export interface VisitorChoice {
  id?: string
  name: string
  responseTime?: number
}

export interface VisitorMeta {
  choices?: VisitorChoice[]
  comment?: string
  commentPreview?: string
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
}

export interface VisitorResponse {
  siteId?: string
  type?: string
  subType?: string
  responseType?: 'survey' | 'announcement'
  responseId?: string
  status?: 'viewed' | 'completed' | 'dismissed'
  meta?: ResponseMeta
  visitor?: Visitor | string
}
