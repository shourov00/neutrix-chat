import { api } from '@/lib/axios'
import qs from 'qs'

export const getSiteData = async () => {
  return await api.get('/external-sites')
}

export const addVisitor = async (data: Visitor) => {
  return await api.post('/visitors', qs.stringify(data))
}
