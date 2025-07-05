import apiClient from './apiClient'

export default {
    getUserInfo() {
        return apiClient.get('/user/me')
    },
    updateUserInfo(userData) {
        return apiClient.put('/user/me', userData)
    },
    register(userData) {
        return apiClient.post('/user/register', userData)
    },
    login(credentials) {
        return apiClient.post('/user/login', credentials)
    }
}