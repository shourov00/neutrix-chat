import { api } from '@/lib/axios'

export const getSurveys = async () => {
  return await api.get('/surveys/sites')
}

export const getAnnouncements = async () => {
  return await api.get('/announcements/sites')
}
