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

interface Padding {
  top: string
  left: string
  bottom: string
  right: string
  _id: string
}

interface Launcher {
  active: boolean
  padding: Padding
  position: string
  miniChatLabel: string
  launcherType: 'default' | 'minimal'
  displayMode: string
  reverseColors: boolean
  _id: string
}

interface Personal {
  backgroundColor: string
  headerImage: string
  title: string
  _id: string
}

interface Introduction {
  backgroundColor: string
  headerImage: 'companyIcon' | 'availableTeam'
  companyTitle: string
  preQualification: string | null
  _id: string
}

interface PreQualification {
  active: boolean
  nameLabel: string
  contactLabel: string
  questionLabel: string
  _id: string
}

export interface Messaging {
  preQualificationActive: boolean
  preQualification: PreQualification
  active: boolean
  message: string
  waiting: string
  buttonLabel: string
  _id: string
}

export interface AwayMessage {
  sendToEmails: string[]
  sendTo: string[]
  thankYou: string
  showAfterUnacceptedTimeout: number
  deliveryMode: string
  preQualification: PreQualification
  active: boolean
  message: string
  displayOfficeHours: boolean
  buttonLabel: string
  requireTeamActive: boolean | null
  requireTeamLabel: string | null
  _id: string
}

interface OfficeHours {
  active: boolean
  min: number
  max: number
  _id: string
}

export interface ChatAwayAdvance {
  officeHours: {
    tuesday: OfficeHours
    wednesday: OfficeHours
    thursday: OfficeHours
    friday: OfficeHours
    monday: OfficeHours
    sunday: OfficeHours
    saturday: OfficeHours
  }
  autoAwayActive: boolean | null
  autoAwayMinutes: number | null
  feedbackCollection: boolean
  conversationForwardingActive: boolean | null
  conversationForwardingEmails: string[]
  _id: string
}

interface Chat {
  launcher: Launcher
  accentColor: string
  accentColorGradient: string
  personal: Personal
  introduction: Introduction
  messaging: Messaging
  awayMessage: AwayMessage
  advanced: ChatAwayAdvance
  _id: string
}

export interface ChatSettings {
  _id: string
  isDeleted: boolean
  siteId: string
  chat: Chat
  user: string
  createdAt: string
  updatedAt: string
}

export interface CompanyInfo {
  _id: string
  image: string
  userType: 'client'
  status: 'Active' | 'Inactive'
  companyName: string
  fullName: string
  companyImage: string
}
