<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
    <div class="h-40 bg-gray-200 relative">
      <img v-if="album.coverUrl" :src="album.coverUrl" class="w-full h-full object-cover">
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
      <div class="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs">
        {{ album.mediaCount }} 张
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-medium text-gray-800 truncate">{{ album.name }}</h3>
      <p class="text-gray-500 text-sm mt-1 truncate">{{ album.description || '暂无描述' }}</p>
      <div class="flex justify-between items-center mt-3">
        <span class="text-xs text-gray-400">{{ formatDate(album.createdTime) }}</span>
        <span v-if="album.isPublic" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
          公开
        </span>
      </div>
      <div class="mt-3 flex space-x-2">
        <button
            @click="$emit('view', album.albumId)"
            class="flex-1 bg-indigo-600 text-white text-sm py-1 rounded hover:bg-indigo-700 transition"
        >
          查看
        </button>
        <button
            v-if="album.permission === 'OWNER' || album.permission === 'MANAGER'"
            @click="$emit('edit', album.albumId)"
            class="flex-1 bg-gray-200 text-gray-700 text-sm py-1 rounded hover:bg-gray-300 transition"
        >
          编辑
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    album: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }
  }
}
</script>