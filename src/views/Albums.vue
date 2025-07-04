<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">我的相册</h2>
      <router-link to="/album/create" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        新建相册
      </router-link>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else>
      <div v-if="albums.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">您还没有创建任何相册</h3>
        <p class="mt-1 text-gray-500">创建一个新的相册来整理您的照片</p>
        <div class="mt-6">
          <router-link to="/album/create" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            创建相册
          </router-link>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AlbumCard
            v-for="album in albums"
            :key="album.albumId"
            :album="album"
            @view="viewAlbum"
            @edit="editAlbum"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AlbumCard from '../components/AlbumCard.vue'

export default {
  components: {
    AlbumCard
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(true)

    const albums = computed(() => store.state.albums)

    onMounted(async () => {
      if (store.state.albums.length === 0) {
        await store.dispatch('fetchAlbums')
      }
      loading.value = false
    })

    const viewAlbum = (id) => {
      router.push(`/album/${id}`)
    }

    const editAlbum = (id) => {
      router.push(`/album/edit/${id}`)
    }

    return {
      albums,
      loading,
      viewAlbum,
      editAlbum
    }
  }
}
</script>