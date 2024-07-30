import axios from 'axios'
import { server } from '@/config/serverPoint'

export const axiosInstance = axios.create({
  baseURL: server + 'api/v1/',
})
