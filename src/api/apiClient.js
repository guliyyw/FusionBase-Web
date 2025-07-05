import axios from 'axios'
import store from '../store/store.js'

const API_URL = 'http://127.0.0.1:8081'

// 创建axios实例
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器 - 自动添加token
apiClient.interceptors.request.use(config => {
    const token = store.state.token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

export default apiClient