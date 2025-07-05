<template>
  <div class="max-w-3xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">个人资料</h2>

      <div v-if="user" class="space-y-6">
        <div class="flex items-center">
          <div class="mr-4">
            <img :src="user.avatarUrl || 'https://via.placeholder.com/80'" class="w-20 h-20 rounded-full">
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-800">{{ user.username }}</h3>
            <p class="text-gray-600">{{ user.email }}</p>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">基本信息</h3>

          <form @submit.prevent="updateProfile">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                    type="text"
                    id="username"
                    v-model="formData.username"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
                <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                >
              </div>
            </div>

            <div class="mb-6">
              <label for="avatarUrl" class="block text-sm font-medium text-gray-700 mb-1">头像URL</label>
              <input
                  type="text"
                  id="avatarUrl"
                  v-model="formData.avatarUrl"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="输入头像图片链接"
              >
            </div>

            <div class="flex justify-end">
              <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  更新中...
                </span>
                <span v-else>保存更改</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const user = ref(store.state.user)
    const loading = ref(false)

    const formData = ref({
      username: '',
      email: '',
      avatarUrl: ''
    })

    // 当组件挂载时，将用户数据复制到表单
    onMounted(() => {
      if (user.value) {
        formData.value = {
          username: user.value.username,
          email: user.value.email,
          avatarUrl: user.value.avatarUrl || ''
        }
      }
    })

    // 更新个人资料
    const updateProfile = async () => {
      loading.value = true
      try {
        await store.dispatch('updateUserInfo', formData.value)
        // 可以在这里添加成功提示
      } catch (error) {
        console.error('更新用户信息失败', error)
      } finally {
        loading.value = false
      }
    }

    return {
      user,
      formData,
      loading,
      updateProfile
    }
  }
}
</script>