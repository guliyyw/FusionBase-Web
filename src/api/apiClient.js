// src/api/apiClient.js
import axios from 'axios'
import store from '@/store'
import { useToast } from 'vue-toast-notification'

const API_URL = 'http://127.0.0.1:8081'

const toast = useToast()

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器 - 添加认证令牌
apiClient.interceptors.request.use(config => {
    const token = store.state.user.token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
    response => {
        // 成功响应直接返回
        return response
    },
    error => {
        if (!error.response) {
            // 无响应错误（网络问题）
            toast.error('网络错误，请检查网络连接')
            return Promise.reject({ message: '网络错误' })
        }

        const status = error.response.status
        const message = error.response.data?.message || '未知错误'
        const errorData = error.response.data

        // 处理特定状态码
        switch (status) {
            case 400:
                toast.error(`请求错误: ${message}`)
                break
            case 401:
                toast.error('登录已过期，请重新登录')
                store.commit('user/CLEAR_AUTH')
                // 可以添加重定向逻辑
                // router.push('/login')
                break
            case 403:
                toast.error(`权限不足: ${message}`)
                break
            case 404:
                toast.error(`资源未找到: ${message}`)
                break
            case 500:
                toast.error(`服务器错误: ${message}`)
                break
            default:
                toast.error(`操作失败: ${message}`)
        }

        // 返回统一格式的错误对象
        return Promise.reject({
            status,
            message,
            ...errorData
        })
    }
)

// 创建专门的文件上传客户端
export const fileUploadClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})

// 文件上传拦截器 - 添加认证
fileUploadClient.interceptors.request.use(config => {
    const token = store.state.user.token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

// 文件下载方法
export const downloadFile = async (url, fileName) => {
    try {
        const response = await apiClient.get(url, {
            responseType: 'blob'
        })

        // 从 Content-Disposition 头提取文件名
        const contentDisposition = response.headers['content-disposition'];
        let finalFileName = fileName;

        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (fileNameMatch && fileNameMatch[1]) {
                finalFileName = fileNameMatch[1].replace(/['"]/g, '');
            }
        }

        // 创建下载链接
        const blob = new Blob([response.data])
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = finalFileName || `download-${Date.now()}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // 释放内存
        setTimeout(() => URL.revokeObjectURL(link.href), 100)

        return true
    } catch (error) {
        toast.error('文件下载失败: ' + (error.message || '未知错误'))
        console.error('下载失败:', error)
        return false
    }
}

export default apiClient