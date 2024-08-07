export interface VisitorChat {
  siteId: string
  status: 'active' | 'closed'
  visitor: string
}

export interface ChatMessage {
  _id?: string
  siteId?: string
  chatId?: string
  messageType?: 'text' | 'image' | 'video' | 'file' | 'audio'
  status?: 'sent' | 'delivered' | 'read'
  content?: string
  senderId?: string
  attachments?: Attachment[]
  createdAt?: Date
}

interface Attachment {
  type?: 'image' | 'video' | 'file' | 'audio' | null
  url?: string | null
}
