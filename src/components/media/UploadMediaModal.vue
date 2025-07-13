<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl"> <!-- 增大模态框尺寸 -->
      <div class="p-6">
        <!-- 标题和关闭按钮 -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900 mb-0">上传媒体文件</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <div class="flex items-center justify-center w-full">
            <div class="flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <div class="flex flex-col items-center justify-center w-full p-4">
                <!-- 预览区域 -->
                <div class="w-full overflow-y-auto p-2 max-h-64">
                  <div class="grid grid-cols-4 gap-3"> <!-- 增加为4列 -->
                    <!-- 预览项目 -->
                    <div v-for="preview in previews" :key="preview.id" class="relative">
                      <div class="group">
                        <!-- 图片预览 -->
                        <div v-if="preview.type === 'image'" class="h-28 w-full rounded overflow-hidden border border-gray-200 relative">
                          <img :src="preview.url" class="h-full w-full object-cover">
                          <!-- 移除按钮 - 右上角 -->
                          <button
                              @click.stop="removeFile(preview.id)"
                              class="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity z-10"
                          >
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>

                        <!-- 视频预览 -->
                        <div v-else-if="preview.type === 'video'" class="h-28 w-full bg-gray-200 rounded flex items-center justify-center relative border border-gray-200">
                          <img v-if="preview.thumbnail" :src="preview.thumbnail" class="absolute inset-0 h-full w-full object-cover">
                          <svg class="w-8 h-8 text-white relative z-10 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <!-- 移除按钮 - 右上角 -->
                          <button
                              @click.stop="removeFile(preview.id)"
                              class="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity z-10"
                          >
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>


                      </div>

                      <!-- 文件名 -->
                      <p class="text-xs text-gray-500 truncate mt-1 px-1 text-center">
                        {{ getFileName(preview.name) }}
                      </p>
                    </div>

                    <!-- 添加新文件的框 -->
                    <div class="relative">
                      <label class="flex flex-col items-center justify-center h-28 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                        <div class="flex flex-col items-center justify-center">
                          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          <p class="text-xs text-gray-500 mt-1">选择文件</p>
                        </div>
                        <input
                            type="file"
                            class="hidden"
                            @change="handleFileChange"
                            accept="image/*,video/*"
                            multiple
                        >
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="mt-1 text-xs text-gray-500">已选择 {{ files.length }} 个文件</p>
        </div>

        <!-- 上传进度 -->
        <div v-if="uploading" class="mb-4">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>上传进度</span>
            <span>{{ uploadedCount }} / {{ files.length }} ({{ progressPercentage }}%)</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
                class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>

          <!-- 单个文件进度 -->
          <div class="mt-3 max-h-40 overflow-y-auto">
            <div v-for="file in files" :key="file.id" class="mt-2 text-sm">
              <div class="flex justify-between">
                <span class="truncate max-w-[70%]">{{ file.name }}</span>
                <span>{{ fileProgress[file.id] || 0 }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                    class="bg-green-500 h-1.5 rounded-full"
                    :style="{ width: (fileProgress[file.id] || 0) + '%' }">
                </div>
            </div>
            <div v-if="uploadErrors[file.id]" class="text-red-500 text-xs mt-1">
              {{ uploadErrors[file.id] }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            :disabled="uploading"
        >
          取消
        </button>
        <button
            @click="startUpload"
            :disabled="uploading || !files.length"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          <svg v-if="uploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ uploading ? '上传中...' : '开始上传' }}</span>
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    albumId: {
      type: [String, Number],
      required: true
    }
  },

  emits: ['close', 'uploaded'],

  setup(props, { emit }) {
    const store = useStore()
    const files = ref([])
    const previews = ref([])
    const uploading = ref(false)
    const uploadedCount = ref(0)
    const fileProgress = ref({})
    const uploadErrors = ref({})
    const fileInput = ref(null)
    let nextId = 1

    // 获取简短文件名
    const getFileName = (name) => {
      if (!name) return ''
      if (name.length > 15) {
        return name.substring(0, 6) + '...' + name.substring(name.length - 6)
      }
      return name
    }

    // 计算总进度
    const progressPercentage = computed(() => {
      if (files.value.length === 0) return 0

      const totalProgress = files.value.reduce(
          (sum, file) => sum + (fileProgress.value[file.id] || 0),
          0
      )
      return Math.round(totalProgress / files.value.length)
    })

    // 设置视频缩略图
    const generateVideoThumbnail = (file, callback) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      video.src = URL.createObjectURL(file)
      video.crossOrigin = 'anonymous'

      video.onloadedmetadata = () => {
        video.currentTime = Math.min(1, video.duration * 0.1)
      }

      video.onseeked = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        callback(canvas.toDataURL('image/jpeg'))
        URL.revokeObjectURL(video.src)
      }

      video.onerror = () => {
        callback(null)
        URL.revokeObjectURL(video.src)
      }
    }

    // 处理文件选择
    const handleFileChange = async (e) => {
      const selectedFiles = Array.from(e.target.files)
      if (!selectedFiles.length) return

      // 重置错误和进度
      fileProgress.value = {}
      uploadErrors.value = {}

      for (const file of selectedFiles) {
        const id = nextId++
        files.value.push({ id, file, name: file.name })

        const preview = {
          id,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: URL.createObjectURL(file),
          thumbnail: null
        }

        previews.value.push(preview)

        if (preview.type === 'video') {
          generateVideoThumbnail(file, (thumbnail) => {
            const index = previews.value.findIndex(p => p.id === id)
            if (index !== -1) {
              previews.value[index].thumbnail = thumbnail
              // 强制触发响应式更新
              previews.value.splice(index, 1, {...previews.value[index]})
            }
          })
        }
      }

      e.target.value = ''
    }

    // 移除文件
    const removeFile = (id) => {
      // 清理预览URL
      const previewIndex = previews.value.findIndex(p => p.id === id)
      if (previewIndex !== -1) {
        const preview = previews.value[previewIndex]
        URL.revokeObjectURL(preview.url)
        if (preview.thumbnail) URL.revokeObjectURL(preview.thumbnail)
        previews.value.splice(previewIndex, 1)
      }

      // 从文件数组中移除
      const fileIndex = files.value.findIndex(f => f.id === id)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      delete fileProgress.value[id]
      delete uploadErrors.value[id]
    }

    // 关闭模态框
    const closeModal = () => {
      if (!uploading.value) {
        resetForm()
        emit('close')
      }
    }

    // 重置表单
    const resetForm = () => {
      // 清理所有预览URL
      previews.value.forEach(preview => {
        URL.revokeObjectURL(preview.url)
        if (preview.thumbnail) URL.revokeObjectURL(preview.thumbnail)
      })

      files.value = []
      previews.value = []
      uploading.value = false
      uploadedCount.value = 0
      fileProgress.value = {}
      uploadErrors.value = {}

      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    // 开始上传
    const startUpload = async () => {
      if (files.value.length === 0) return

      uploading.value = true
      uploadedCount.value = 0
      uploadErrors.value = {}

      // 初始化所有文件进度为0
      files.value.forEach(file => {
        fileProgress.value[file.id] = 0
      })

      try {
        const uploadPromises = files.value.map(fileObj => {
          return new Promise(async (resolve) => {
            try {
              console.log(`Starting upload for: ${fileObj.file.name}`);
              await store.dispatch('album/uploadMedia', {
                albumId: props.albumId,
                file: fileObj.file,
                onUploadProgress: (progressEvent) => {
                  const progress = Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                  )
                  console.log(`Progress ${fileObj.id}: ${progress}%`); // 调试
                  // 直接赋值确保响应式更新
                  fileProgress.value = {
                    ...fileProgress.value,
                    [fileObj.id]: progress
                  };
                }
              })
              uploadedCount.value++
              resolve(true)
            } catch (error) {
              uploadErrors.value[fileObj.id] = error.message || '上传失败'
              resolve(false)
            }
          })
        })

        const results = await Promise.all(uploadPromises)
        const allSuccess = results.every(success => success)

        if (allSuccess) {
          emit('uploaded')
          resetForm()
        }
      } catch (error) {
        console.error('上传过程中发生错误', error)
      } finally {
        uploading.value = false
      }
    }

    return {
      files,
      previews,
      uploading,
      uploadedCount,
      fileProgress,
      uploadErrors,
      progressPercentage,
      fileInput,
      getFileName,
      handleFileChange,
      removeFile,
      closeModal,
      startUpload
    }
  }
}
</script>

<style scoped>
/* 添加拖放区域的高亮样式 */
label:hover {
  border-color: #3b82f6;
  background-color: #f0f9ff;
}

/* 进度条动画 */
.bg-blue-600, .bg-green-500 {
  transition: width 0.3s ease;
}

/* 滚动条样式 */
.max-h-40::-webkit-scrollbar,
.max-h-64::-webkit-scrollbar {
  width: 6px;
}

.max-h-40::-webkit-scrollbar-track,
.max-h-64::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-40::-webkit-scrollbar-thumb,
.max-h-64::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-40::-webkit-scrollbar-thumb:hover,
.max-h-64::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 预览项悬停效果 */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

</style>