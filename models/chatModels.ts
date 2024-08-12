export interface VisitorChat {
  siteId: string
  status: 'active' | 'closed'
  visitor: string
}

export interface ChatMessage {
  _id?: string
  siteId?: string
  chatId?: string
  name?: string
  messageType?: 'text' | 'image' | 'video' | 'file' | 'audio'
  status?: 'sent' | 'delivered' | 'read'
  content?: string
  senderId?: string
  attachments?: Attachment[]
  createdAt?: Date
  isLoading?: boolean
  isError?: boolean
}

export interface Attachment {
  type?: 'image' | 'video' | 'file' | 'audio' | null
  url?: string | null
  file?: File
}

export interface QueryFilter {
  page?: string
  limit?: string
  searchKeyword?: string
}
