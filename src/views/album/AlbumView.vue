<template>
  <div v-if="album" class="space-y-6">
    <!-- 相册信息卡片 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-800">{{ album.name }}</h1>
          <p class="text-gray-600 mt-2">{{ album.description }}</p>
          <div class="flex items-center mt-4 text-sm text-gray-500">
            <span>创建于 {{ formatDate(album.createdTime) }}</span>
            <span class="mx-2">•</span>
            <span>{{ album.mediaCount }} 张照片</span>
            <span v-if="album.isPublic" class="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded">
              公开
            </span>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
              v-if="canEdit"
              @click="editAlbum"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            编辑
          </button>
          <button
              v-if="canManage"
              @click="confirmDelete"
              class="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            删除
          </button>
          <button
              v-if="canEdit"
              @click="showShareModal = true"
              class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md transition flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            共享
          </button>
        </div>
      </div>
    </div>

    <!-- 照片列表区域 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">照片</h2>
        <button v-if="canUpload" @click="showUploadModal = true" class="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          上传照片或视频
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="mediaLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-500">加载照片中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="mediaList.length === 0" class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="mt-4">此相册还没有照片</p>
        <button v-if="canUpload" @click="showUploadModal = true" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
          上传第一张照片
        </button>
      </div>

      <!-- 照片网格 -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="media in mediaList" :key="media.mediaId" class="aspect-square bg-gray-200 rounded-md overflow-hidden relative group">

          <!-- 媒体操作菜单 (hover时显示) -->
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button @click.stop="showDeleteMediaConfirm(media)" class="p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- 视频类型显示播放图标 -->
          <div
              v-if="media.fileType === 'video'"
              class="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
              @click="showMedia(media)"
          >
          <div class="bg-black bg-opacity-40 rounded-full p-2">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

          <!-- 使用后端提供的缩略图 -->
          <img :src="getMediaUrl(media)"
               class="w-full h-full object-cover cursor-pointer"
               @click="showMedia(media)">

          <!-- 添加视频时长标签 -->
          <div v-if="media.fileType === 'video'" class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
            {{ formatDuration(media.duration) }}
          </div>

          <!-- 媒体信息 (hover时显示) -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <p class="text-sm truncate">{{ media.filename }}</p>
            <p class="text-xs">{{ formatFileSize(media.fileSize) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑模态框 -->
    <AlbumForm
        v-if="showEditModal"
        :initialData="album"
        :mode="'edit'"
        :submitText="'保存'"
        @submit="updateAlbum"
        @cancel="showEditModal = false"
    />

    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">确认删除相册</h3>
        <p class="text-gray-500 mb-6">确定要删除相册 "{{ album.name }}" 吗？此操作将永久删除相册和所有照片，无法撤销。</p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            取消
          </button>
          <button @click="deleteAlbum" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 上传媒体模态框 -->
    <UploadMediaModal
        v-if="showUploadModal"
        :albumId="album.albumId"
        @close="showUploadModal = false"
        @uploaded="handleMediaUploaded"
    />

    <!-- 媒体查看模态框 -->
    <MediaViewer
        v-if="selectedMedia"
        :media="selectedMedia"
        @close="selectedMedia = null"
        @download="downloadMedia"
        @delete="deleteMedia"
    />

    <div v-if="mediaToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">确认删除媒体</h3>
        <p class="text-gray-500 mb-6">确定要删除 "{{ mediaToDelete.fileName }}" 吗？此操作将永久删除该文件，无法撤销。</p>
        <div class="flex justify-end space-x-3">
          <button @click="mediaToDelete = null" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            取消
          </button>
          <button @click="confirmDeleteMedia" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            删除
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 加载状态 -->
  <div v-else class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
    <p class="mt-4 text-gray-500">加载相册信息中...</p>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ShareForm from '@/components/album/ShareForm.vue'
import AlbumForm from '@/components/album/AlbumForm.vue'
import albumApi from '@/api/album'
import UploadMediaModal from "@/components/media/UploadMediaModal.vue";
import MediaViewer from "@/components/media/MediaViewer.vue";
import mediaApi from '@/api/media'

export default {
  components: {
    ShareForm,
    AlbumForm,
    UploadMediaModal,
    MediaViewer
  },
  props: {
    albumId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()

    // 状态管理
    const album = ref(null)
    const loading = ref(true)
    const showShareModal = ref(false)
    const showDeleteModal = ref(false)
    const showEditModal = ref(false)
    const albumData = ref({})
    const updating = ref(false)
    const showUploadModal = ref(false)
    const selectedMedia = ref(null)
    const mediaLoading = ref(false)
    const mediaToDelete = ref(null)

    // 生命周期钩子
    onMounted(async () => {
      await fetchAlbumDetail()
      await fetchMedia()
    })

    // 获取相册详情
    const fetchAlbumDetail = async () => {
      try {
        const response = await albumApi.getAlbumDetail(props.albumId)
        album.value = response.data.data
      } catch (error) {
        console.error('获取相册详情失败', error)
      } finally {
        loading.value = false
      }
    }

    // 获取媒体列表
    const fetchMedia = async () => {
      if (!album.value) return

      mediaLoading.value = true
      try {
        await store.dispatch('album/fetchAlbumMedia', props.albumId)
      } catch (error) {
        console.error('获取媒体列表失败', error)
      } finally {
        mediaLoading.value = false
      }
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }

    const formatDuration = (millis) => {
      if (!millis) return '00:00'
      const seconds = Math.floor(millis / 1000)
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // 编辑相册
    const editAlbum = () => {
      albumData.value = {
        name: album.value.name,
        description: album.value.description,
        isPublic: album.value.isPublic
      }
      showEditModal.value = true
    }

    // 确认删除相册
    const confirmDelete = () => {
      showDeleteModal.value = true
    }

    // 删除相册
    const deleteAlbum = async () => {
      try {
        await store.dispatch('album/deleteAlbum', album.value.albumId)
        await router.push('/albums')
      } catch (error) {
        console.error('删除相册失败', error)
      } finally {
        showDeleteModal.value = false
      }
    }

    // 共享相册
    const shareAlbum = async (shareData) => {
      try {
        await store.dispatch('album/shareAlbum', {
          albumId: album.value.albumId,
          shareData
        })
        showShareModal.value = false
      } catch (error) {
        console.error('共享相册失败', error)
      }
    }

    // 更新相册
    const updateAlbum = async (formData) => {
      updating.value = true
      try {
        await store.dispatch('album/updateAlbum', {
          albumId: props.albumId,
          data: formData
        })

        // 更新本地数据
        album.value = {
          ...album.value,
          ...formData
        }

        showEditModal.value = false
      } catch (error) {
        console.error('更新相册信息失败', error)
      } finally {
        updating.value = false
      }
    }

    // 处理媒体上传
    const handleMediaUploaded = () => {
      showUploadModal.value = false
      fetchAlbumDetail()
    }

    // 显示媒体查看器
    const showMedia = (media) => {
      selectedMedia.value = media
    }

    // 获取媒体URL
    const getMediaUrl = (media) => {
      // 实际项目中应从后端获取URL
      return media.thumbnailUrl || media.url || 'https://via.placeholder.com/300'
    }

    // 下载媒体
    const downloadMedia = async (media) => {
      try {
        await mediaApi.downloadMedia(media.mediaId, media.fileName);
      } catch (error) {
        console.error('下载失败', error);
        alert('下载失败: ' + (error.message || '未知错误'));
      }
    }

    // 删除媒体
    const deleteMedia = async (media) => {
      if (!confirm(`确定要删除 "${media.filename}" 吗？此操作不可撤销。`)) {
        return
      }

      try {
        await store.dispatch('album/deleteMedia', {
          mediaId: media.mediaId,
          albumId: album.value.albumId
        })
        fetchMedia()
      } catch (error) {
        console.error('删除失败', error)
        alert('删除失败，请重试')
      }
    }

    // 权限计算
    const canManage = computed(() => album.value?.permission === 'MANAGER')
    const canEdit = computed(() => ['MANAGER', 'CONTRIBUTOR'].includes(album.value?.permission))
    const canUpload = computed(() => canEdit.value)

    // 媒体列表
    const mediaList = computed(() => {
      return store.state.album.currentAlbumMedia || []
    })

    const showDeleteMediaConfirm = (media) => {
      mediaToDelete.value = media
    }

    const confirmDeleteMedia = async () => {
      if (!mediaToDelete.value) return

      try {
        await store.dispatch('album/deleteMedia', {
          mediaId: mediaToDelete.value.mediaId,
          albumId: album.value.albumId
        })
        fetchMedia()
      } catch (error) {
        console.error('删除失败', error)
        alert('删除失败，请重试')
      } finally {
        mediaToDelete.value = null
      }
    }

    return {
      album,
      loading,
      showShareModal,
      showDeleteModal,
      showEditModal,
      albumData,
      updating,
      showUploadModal,
      selectedMedia,
      mediaLoading,
      formatDate,
      formatFileSize,
      formatDuration,
      editAlbum,
      confirmDelete,
      deleteAlbum,
      shareAlbum,
      updateAlbum,
      handleMediaUploaded,
      showMedia,
      getMediaUrl,
      downloadMedia,
      deleteMedia,
      canManage,
      canEdit,
      canUpload,
      mediaList,
      mediaToDelete,
      showDeleteMediaConfirm,
      confirmDeleteMedia
    }
  }
}
</script>