<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg transform hover:-translate-y-1">
    <!-- 相册封面区域 -->
    <div class="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
      <!-- 封面图片 -->
      <img
          v-if="album.coverUrl"
          :src="album.coverUrl"
          class="w-full h-full object-cover"
          alt="相册封面"
      >

      <!-- 默认封面 -->
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="text-white text-center">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="mt-1 text-sm font-medium">相册封面</p>
        </div>
      </div>

      <!-- 媒体数量 -->
      <div class="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs font-medium">
        {{ album.mediaCount }} 张
      </div>
    </div>

    <!-- 相册信息区域 -->
    <div class="p-4">
      <!-- 相册名称 -->
      <h3 class="font-bold text-gray-800 truncate">{{ album.name }}</h3>

      <!-- 相册描述 -->
      <p class="text-gray-500 text-sm mt-1 truncate">{{ album.description || '暂无描述' }}</p>

      <!-- 相册元信息 -->
      <div class="flex justify-between items-center mt-3">
        <span class="text-xs text-gray-400">{{ formatDate(album.createdTime) }}</span>
        <!-- 公开状态标签 -->
        <span
            v-if="album.isPublic"
            class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium"
        >
          公开
        </span>
        <span
            v-else
            class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 font-medium"
        >
          私有
        </span>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-4 flex space-x-2">
        <button
            @click="$emit('view', album.albumId)"
            class="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          查看
        </button>

        <button
            v-if="album.permission === 'MANAGER' || album.permission === 'CONTRIBUTOR'"
            @click="$emit('edit', album)"
        class="flex-1 bg-gray-100 text-gray-700 text-sm py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          编辑
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlbumCard',
  props: {
    // 相册信息对象
    album: {
      type: Object,
      required: true,
      default: () => ({
        albumId: '',
        name: '默认相册',
        description: '',
        isPublic: true,
        coverUrl: null,
        mediaCount: 0,
        createdTime: new Date(),
        permission: 'VIEWER'
      })
    }
  },
  methods: {
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
/* 添加悬停动画效果 */
.transition-all {
  transition: all 0.3s ease;
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
}
</style>