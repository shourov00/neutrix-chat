import { api } from '@/lib/axios'
import qs from 'qs'
import { VisitorResponse } from '@/src/models/responseModels'
import { VisitorChat } from '@/src/models/chatModels'

export const getSiteData = async () => {
  return await api.get('/external-sites')
}

export const addVisitor = async (data: Visitor) => {
  return await api.post('/visitors', qs.stringify(data))
}

export const addVisitorResponse = async (data: VisitorResponse) => {
  return await api.post('/visitors-response', qs.stringify(data))
}

export const addVisitorChat = async (data: VisitorChat) => {
  return await api.post('/visitors-chat', qs.stringify(data))
}

export const getChatMessages = async (id: string) => {
  return await api.get(`/visitors-chat/${id}`)
}
