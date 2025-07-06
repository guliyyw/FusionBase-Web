<template>
  <div class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
    <button @click="$emit('close')" class="absolute top-4 right-4 text-white">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <div class="max-w-4xl w-full">
      <div class="flex justify-center">
        <img :src="getImageUrl(media)" class="max-h-[80vh] object-contain">
      </div>

      <div class="mt-4 bg-black/50 text-white p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-medium text-lg">{{ media.filename }}</h3>
            <p class="text-gray-300 text-sm">{{ formatFileSize(media.fileSize) }}</p>
          </div>
          <div class="flex space-x-2">
            <button @click="$emit('download', media)"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              下载
            </button>
            <button v-if="canDelete" @click="$emit('delete', media)"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              删除
            </button>
          </div>
        </div>

        <div v-if="media.description" class="mt-3 border-t border-gray-700 pt-3">
          <p class="text-gray-300">{{ media.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    media: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()

    const canDelete = computed(() => {
      // 根据权限判断是否可以删除
      // 实际项目中应该从store中获取当前用户权限
      return true
    })

    const getImageUrl = (media) => {
      return media.url || 'https://via.placeholder.com/800'
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return {
      canDelete,
      getImageUrl,
      formatFileSize
    }
  }
}
</script>