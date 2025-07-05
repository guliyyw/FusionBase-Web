<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">共享给我的相册</h2>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else>
      <div v-if="sharedAlbums.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">没有共享相册</h3>
        <p class="mt-1 text-gray-500">其他用户尚未与您共享任何相册</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AlbumCard
            v-for="album in sharedAlbums"
            :key="album.albumId"
            :album="album"
            @view="viewAlbum(album.albumId)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AlbumCard from '../../components/album/AlbumCard.vue'

export default {
  components: {
    AlbumCard
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(true)

    const sharedAlbums = computed(() => store.state.sharedAlbums)

    onMounted(async () => {
      if (store.state.sharedAlbums.length === 0) {
        await store.dispatch('fetchSharedAlbums')
      }
      loading.value = false
    })

    const viewAlbum = (id) => {
      router.push(`/album/${id}`)
    }

    return {
      sharedAlbums,
      loading,
      viewAlbum
    }
  }
}
</script>