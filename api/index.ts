import { api } from '@/lib/axios'
import qs from 'qs'
import { VisitorResponse } from '@/models/responseModels'
import { VisitorChat } from '@/models/chatModels'

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

export const getChatMessages = async (
  id: string,
  filterDto?: Record<string, any>,
) => {
  const queryString = new URLSearchParams(filterDto).toString()
  const url = `/visitors-chat/${id}${queryString ? `?${queryString}` : ''}`

  return await api.get(url)
}
