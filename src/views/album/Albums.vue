<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">我的相册</h2>
      <button
          @click="showCreateModal = true"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        新建相册
      </button>
    </div>

    <!-- 编辑相册模态框 -->
    <AlbumForm
        v-if="editingAlbum"
        :key="'edit-' + editingAlbum.albumId"
        :initialData="editingAlbum"
        mode="edit"
        :loading="updating"
        @submit="updateAlbum"
        @cancel="closeEditModal"
    />

    <!-- 创建相册模态框 -->
    <AlbumForm
        v-if="showCreateModal"
        key="create"
        :initialData="defaultAlbumData"
        mode="create"
        :loading="creating"
        submitText="创建"
        @submit="createNewAlbum"
        @cancel="showCreateModal = false"
    />

    <Spinner v-if="loading" />

    <div v-else>
      <!-- 空状态提示 -->
      <div
          v-if="albums.length === 0"
          class="bg-white rounded-lg shadow-sm p-12 text-center"
      >
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">暂无相册</h3>
        <p class="mt-1 text-gray-500">创建您的第一个相册来整理照片</p>
        <div class="mt-6">
          <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            创建相册
          </button>
        </div>
      </div>

      <!-- 相册网格 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AlbumCard
            v-for="album in albums"
            :key="album.albumId"
            :album="album"
            @view="viewAlbum(album.albumId)"
            @edit="editAlbum(album)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AlbumCard from '@/components/album/AlbumCard.vue'
import AlbumForm from '@/components/album/AlbumForm.vue'
import Spinner from '@/components/common/Spinner.vue'

export default {
  components: {
    AlbumCard,
    AlbumForm,
    Spinner
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    // 响应式状态
    const loading = ref(false)
    const showCreateModal = ref(false)
    const creating = ref(false)
    const editingAlbum = ref(null)
    const updating = ref(false)

    // 计算属性
    const albums = computed(() => store.getters['album/userAlbums'])
    const defaultAlbumData = computed(() => ({
      id: null,
      name: '',
      description: '',
      isPublic: true
    }))

    // 生命周期钩子
    onMounted(async () => {
      await fetchAlbums()
    })

    // 方法
    const fetchAlbums = async () => {
      try {
        loading.value = true
        await store.dispatch('album/fetchAlbums')
      } catch (error) {
        console.error('获取相册失败:', error)
        // 这里可以添加用户通知
      } finally {
        loading.value = false
      }
    }

    const viewAlbum = (id) => {
      router.push(`/album/${id}`)
    }

    const editAlbum = (album) => {
      editingAlbum.value = {
        albumId: album.albumId,
        name: album.name,
        description: album.description,
        isPublic: album.isPublic
      }
    }

    const closeEditModal = () => {
      editingAlbum.value = null
    }

    const createNewAlbum = async (formData) => {
      try {
        creating.value = true
        await store.dispatch('album/createAlbum', formData)
        showCreateModal.value = false
        await fetchAlbums()
      } catch (error) {
        console.error('创建相册失败:', error)
        // 这里可以添加用户通知
      } finally {
        creating.value = false
      }
    }

    const updateAlbum = async (formData) => {
      try {
        updating.value = true
        await store.dispatch('album/updateAlbum', {
          albumId: editingAlbum.value.albumId,
          data: formData
        })
        closeEditModal()
        await fetchAlbums()
      } catch (error) {
        console.error('更新相册失败:', error)
        // 这里可以添加用户通知
      } finally {
        updating.value = false
      }
    }

    return {
      albums,
      loading,
      showCreateModal,
      creating,
      viewAlbum,
      editAlbum,
      createNewAlbum,
      editingAlbum,
      updating,
      updateAlbum,
      closeEditModal,
      defaultAlbumData
    }
  }
}
</script>