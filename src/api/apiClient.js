import axios from 'axios'
import store from '@/store'

const API_URL = 'http://127.0.0.1:8081'

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use(config => {
    const token = store.state.user.token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            store.commit('user/CLEAR_AUTH')
        }
        return Promise.reject(error)
    }
)

export default apiClient