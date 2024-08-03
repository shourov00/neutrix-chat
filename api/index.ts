import { api } from '@/lib/axios'
import qs from 'qs'
import { VisitorResponse } from '@/src/models/responseModels'

export const getSiteData = async () => {
  return await api.get('/external-sites')
}

export const addVisitor = async (data: Visitor) => {
  return await api.post('/visitors', qs.stringify(data))
}

export const addVisitorResponse = async (data: VisitorResponse) => {
  return await api.post('/visitors-response', qs.stringify(data))
}
