import { axiosInstance as api } from '@/lib/axios'

export const getSurveys = async (siteId: string) => {
  console.log(siteId)
  return await api.get('/surveys/sites', {
    headers: {
      'x-site-id': siteId,
    },
  })
}
