<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">创建新相册</h2>

      <AlbumForm
          :initialData="initialData"
          :loading="loading"
          @submit="createAlbum"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AlbumForm from '../../components/album/AlbumForm.vue'

export default {
  components: {
    AlbumForm
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)

    const initialData = {
      name: '',
      description: '',
      isPublic: false
    }

    const createAlbum = async (albumData) => {
      loading.value = true
      try {
        const response = await store.dispatch('createAlbum', albumData)
        router.push(`/album/${response.data.data.albumId}`)
      } catch (error) {
        console.error('创建相册失败', error)
      } finally {
        loading.value = false
      }
    }

    return {
      initialData,
      loading,
      createAlbum
    }
  }
}
</script>