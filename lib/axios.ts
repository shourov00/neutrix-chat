import axios from 'axios'
import { getSiteIdAtom } from '@/hooks/siteIdStore'

const axiosInstance = axios.create({
  baseURL: process.env.SERVER_API_ENDPOINT + 'api/v1/',
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const siteId = getSiteIdAtom()
    if (siteId) {
      config.headers['x-site-id'] = siteId
    }
    return config
  },
  (error) => Promise.reject(error),
)

export { axiosInstance as api }
