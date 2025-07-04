import axios from 'axios'

const API_URL = 'http://127.0.0.1:8080'

export default {
    getUserInfo() {
        return axios.get(`${API_URL}/user/me`)
    },
    updateUserInfo(userData) {
        return axios.put(`${API_URL}/user/me`, userData)
    },
    register(userData) {
        return axios.post(`${API_URL}/user/register`, userData)
    },
    login(credentials) {
        return axios.post(`${API_URL}/user/login`, credentials)
    }
}