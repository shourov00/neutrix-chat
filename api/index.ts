import { api } from '@/lib/axios'

export const getSiteData = async () => {
  return await api.get('/external-sites')
}
