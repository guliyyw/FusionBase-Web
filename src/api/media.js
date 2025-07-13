import apiClient, { fileUploadClient, downloadFile } from './apiClient'

export default {
    // 上传媒体文件
    uploadMedia(albumId, file, onUploadProgress) {
        const formData = new FormData()
        formData.append('file', file)

        return fileUploadClient.post(`/media/upload/${albumId}`, formData, {
            onUploadProgress,
            headers: {
                'Content-Type': 'multipart/form-data'  // 明确设置内容类型
            }
        })
    },

    // 下载媒体文件
    async downloadMedia(mediaId, fileName) {
        return downloadFile(`/media/download/${mediaId}`, fileName)
    },

    // 删除媒体文件
    deleteMedia(mediaId) {
        return apiClient.delete(`/media/${mediaId}`)
    },

    // 获取相册媒体列表
    getAlbumMedia(albumId) {
        return apiClient.get(`/media/album/${albumId}`)
    }
}