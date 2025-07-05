<template>
  <div v-if="album">
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex justify-between items-start">
        <div>
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

        <div class="flex space-x-3">
          <button
              v-if="album.permission === 'MANAGER' || album.permission === 'CONTRIBUTOR'"
              @click="editAlbum"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            编辑
          </button>
          <button
              v-if="album.permission === 'MANAGER'"
              @click="confirmDelete"
              class="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            删除
          </button>
          <!-- 添加权限控制：只有所有者和管理才能共享 -->
          <button
              v-if="album.permission === 'MANAGER' || album.permission === 'CONTRIBUTOR'"
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

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">照片</h2>

      <div v-if="album.mediaCount === 0" class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="mt-4">此相册还没有照片</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="i in 6" :key="i" class="aspect-square bg-gray-200 rounded-md overflow-hidden">
          <div class="w-full h-full flex items-center justify-center text-gray-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 共享模态框 -->
    <ShareForm
        v-if="showShareModal"
        :album="album"
        @close="showShareModal = false"
        @share="shareAlbum"
    />

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
  </div>

  <div v-else class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
    <p class="mt-4 text-gray-500">加载相册信息中...</p>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ShareForm from '../components/ShareForm.vue'
import AlbumForm from '../components/AlbumForm.vue'
import albumApi from '@/api/album'

export default {
  components: {
    ShareForm,
    AlbumForm
  },
  props: {
    albumId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const album = ref(null)
    const loading = ref(true)
    const showShareModal = ref(false)
    const showDeleteModal = ref(false)
    const showEditModal = ref(false)
    const saving = ref(false)

    onMounted(async () => {
      try {
        const response = await albumApi.getAlbumDetail(props.albumId)
        album.value = response.data.data
        console.log("相册详情：",album.value)
      } catch (error) {
        console.error('获取相册详情失败', error)
      } finally {
        loading.value = false
      }
    })

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }

    const editAlbum = () => {
      showEditModal.value = true
    }

    const confirmDelete = () => {
      showDeleteModal.value = true
    }

    const deleteAlbum = async () => {
      try {
        await store.dispatch('deleteAlbum', album.value.albumId)
        await router.push('/albums')
      } catch (error) {
        console.error('删除相册失败', error)
      } finally {
        showDeleteModal.value = false
      }
    }

    const shareAlbum = async (shareData) => {
      try {
        await store.dispatch('shareAlbum', { albumId: album.value.albumId, shareData })
        showShareModal.value = false
        // 显示成功消息
      } catch (error) {
        console.error('共享相册失败', error)
      }
    }

    const updateAlbum = async (formData) => {
      saving.value = true
      try {
        // 调用API更新相册
        console.error('更新相册请求id1:', album.value.id)
        const response = await albumApi.updateAlbum(album.value.albumId, formData)

        // 更新本地数据
        album.value = { ...album.value, ...formData }
        showEditModal.value = false
      } catch (error) {
        console.error('更新相册失败', error)
      } finally {
        saving.value = false
      }
    }

    return {
      album,
      loading,
      showShareModal,
      showDeleteModal,
      formatDate,
      editAlbum,
      updateAlbum,
      confirmDelete,
      deleteAlbum,
      shareAlbum
    }
  }
}
</script>