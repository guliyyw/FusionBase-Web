import apiClient from './apiClient'

export default {
    getAlbumList() {
        return apiClient.get('/album')
    },
    getSharedAlbums() {
        return apiClient.get('/album/shared')
    },
    createAlbum(albumData) {
        return apiClient.post('/album', albumData)
    },
    updateAlbum(albumId, data) {
        return apiClient.put(`/album/${albumId}`, data)
    },
    getAlbumDetail(albumId) {
        return apiClient.get(`/album/${albumId}`, albumId)
    },
    deleteAlbum(albumId) {
        return apiClient.post(`/album/${albumId}/share`, shareData)
    },
    shareAlbum(albumId, shareData) {
        return apiClient.post(`/album/${albumId}/share`, shareData)
    }
}