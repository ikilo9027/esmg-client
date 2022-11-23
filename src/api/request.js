import axios from 'axios'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // api base_url
})

service.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    } else {
      config.headers['Authorization'] = `Bearer None`
    }
  
  return config

}, async (error) => {
  return Promise.reject(error)
})

export default service
