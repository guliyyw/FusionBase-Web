<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">共享相册</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">共享方式</label>
          <div class="flex space-x-4">
            <div class="flex items-center">
              <input
                  type="radio"
                  id="share-user"
                  v-model="shareMethod"
                  value="user"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              >
              <label for="share-user" class="ml-2 block text-sm text-gray-700">共享给用户</label>
            </div>
            <div class="flex items-center">
              <input
                  type="radio"
                  id="share-email"
                  v-model="shareMethod"
                  value="email"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              >
              <label for="share-email" class="ml-2 block text-sm text-gray-700">通过邮箱邀请</label>
            </div>
          </div>
        </div>

        <div v-if="shareMethod === 'user'" class="mb-4">
          <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">用户ID</label>
          <input
              type="text"
              id="userId"
              v-model="shareData.sharedUserId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="输入用户ID"
          >
        </div>

        <div v-if="shareMethod === 'email'" class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
          <input
              type="email"
              id="email"
              v-model="shareData.inviteeEmail"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="输入邮箱地址"
          >
        </div>

        <div class="mb-4">
          <label for="permission" class="block text-sm font-medium text-gray-700 mb-1">权限级别</label>
          <select
              id="permission"
              v-model="shareData.permissionLevel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="VIEWER">查看者</option>
            <option value="CONTRIBUTOR">贡献者</option>
            <option value="MANAGER">管理员</option>
          </select>
        </div>

        <div class="mb-6">
          <label for="expiresAt" class="block text-sm font-medium text-gray-700 mb-1">过期时间（可选）</label>
          <input
              type="date"
              id="expiresAt"
              v-model="shareData.expiresAt"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>

        <div class="flex justify-end space-x-3">
          <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              共享中...
            </span>
            <span v-else>共享</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    album: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const shareMethod = ref('user')
    const loading = ref(false)

    const shareData = ref({
      sharedUserId: '',
      inviteeEmail: '',
      permissionLevel: 'VIEWER',
      expiresAt: ''
    })

    const handleSubmit = () => {
      loading.value = true
      // 准备发送的数据
      const dataToSend = {
        permissionLevel: shareData.value.permissionLevel,
        expiresAt: shareData.value.expiresAt || null
      }

      if (shareMethod.value === 'user') {
        dataToSend.sharedUserId = parseInt(shareData.value.sharedUserId)
      } else {
        dataToSend.inviteeEmail = shareData.value.inviteeEmail
      }

      // 发送共享请求
      emit('share', dataToSend)
    }

    return {
      shareMethod,
      shareData,
      loading,
      handleSubmit
    }
  }
}
</script>