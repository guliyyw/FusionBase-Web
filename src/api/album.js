import axios from 'axios'

const API_URL = 'http://127.0.0.1:8080'

export default {
    getAlbumDetail(id) {
        return axios.get(`${API_URL}/album/${id}`)
    },
    updateAlbum(id, albumData) {
        return axios.put(`${API_URL}/album/${id}`, albumData)
    },
    deleteAlbum(id) {
        return axios.delete(`${API_URL}/album/${id}`)
    },
    getAlbumList() {
        return axios.get(`${API_URL}/album`)
    },
    createAlbum(albumData) {
        return axios.post(`${API_URL}/album`, albumData)
    },
    shareAlbum(id, shareData) {
        return axios.post(`${API_URL}/album/${id}/share`, shareData)
    },
    getSharedAlbums() {
        return axios.get(`${API_URL}/album/shared`)
    }
}