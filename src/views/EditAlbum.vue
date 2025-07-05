<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">编辑相册</h2>

      <AlbumForm
          :initialData="albumData"
          :loading="loading"
          @submit="updateAlbum"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AlbumForm from '../components/AlbumForm.vue'

export default {
  components: {
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
    const router = useRouter()
    const loading = ref(false)
    const albumData = ref({
      name: '',
      description: '',
      isPublic: false
    })

    // 加载相册数据
    onMounted(async () => {
      try {
        const album = store.getters.albumById(props.albumId)
        if (album) {
          albumData.value = {
            name: album.name,
            description: album.description,
            isPublic: album.isPublic
          }
        } else {
          // 如果store中没有，则从API获取
          const response = await albumApi.getAlbumDetail(props.albumId)
          albumData.value = {
            name: response.data.data.name,
            description: response.data.data.description,
            isPublic: response.data.data.isPublic
          }
        }
      } catch (error) {
        console.error('获取相册信息失败', error)
      }
    })

    // 更新相册
    const updateAlbum = async (albumData) => {
      loading.value = true
      try {
        await store.dispatch('updateAlbum', {
          albumId: props.albumId,
          data: albumData
        })
        console.log(props.albumId)
        await router.push(`/album/${props.albumId}`)
      } catch (error) {
        console.error('更新相册失败', error)
      } finally {
        loading.value = false
      }
    }

    return {
      albumData,
      loading,
      updateAlbum
    }
  }
}
</script>