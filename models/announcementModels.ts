import {
  AudienceSettings,
  CommunicationStatusEnumType,
  DeliverySettings,
  Draft,
} from './surveyModels'

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

export enum AnnouncementCategoryEnumType {
  PROMO = 'promo',
  UPDATES = 'update',
  EVENT = 'event',
}

export interface Display {
  title?: string | null
  content?: string | null
  type?: 'vertical' | null
  image?: Image | null
  actionButton?: ActionButton | null
  dismissButton?: DismissButton | null
  reversed?: boolean
  overlayState?: string | null
}

export interface Image {
  name?: string | null
  url?: string | null
  mobileUrl?: string | null
  originalUrl?: string | null
  fileId?: string | null
  side?: string | null
}

export interface ActionButton {
  label?: string | null
  action?: 'goToUrl' | 'dismiss' | null
  url?: string | null
  dismissLabel?: string | null
  urlLabel?: string | null
}

export interface DismissButton {
  label?: string | null
}

export interface AnnouncementSettings {
  audience: AudienceSettings
  delivery: DeliverySettings
  display: Display
}

export interface Announcement {
  _id?: string
  name: string
  siteId: string
  type: AnnouncementEnumType
  category: AnnouncementCategoryEnumType
  status: CommunicationStatusEnumType
  draft: Draft
  settings: AnnouncementSettings
}

export interface AnnouncementDevice {
  id: string
  name: string
  responseTime: number
}

export interface AnnouncementResponseProps {
  status?: 'viewed' | 'completed' | 'dismissed'
  announcement: Announcement
  devices: AnnouncementDevice[]
  responseTime?: number
}
