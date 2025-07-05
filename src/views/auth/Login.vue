<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-8">
            <div class="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-800">
              {{ isLogin ? '欢迎回来' : '创建新账户' }}
            </h1>
            <p class="text-gray-500 mt-2">
              {{ isLogin ? '登录您的相册管理账户' : '开始整理您的照片和回忆' }}
            </p>
          </div>

          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
              <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  v-model="form.email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="your@email.com"
              >
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  v-model="form.password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="••••••••"
              >
            </div>

            <div v-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
              {{ error }}
            </div>

            <div>
              <button
                  type="submit"
                  :disabled="loading"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-75"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </span>
                <span v-else>{{ isLogin ? '登录账户' : '创建账户' }}</span>
              </button>
            </div>
          </form>

          <!-- 注册按钮放在右下角 -->
          <div class="mt-6 text-right">
            <a @click.prevent="toggleMode" class="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
              {{ isLogin ? '没有账户？立即注册' : '已有账户？立即登录' }}
            </a>
          </div>
        </div>

        <div class="bg-gray-50 px-8 py-4 text-center text-sm text-gray-500">
          &copy; 2025 在线数据管理系统
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()

    const isLogin = ref(true)
    const loading = ref(false)
    const error = ref('')

    const form = ref({
      email: '',
      password: ''
    })

    const toggleMode = () => {
      isLogin.value = !isLogin.value
      error.value = ''
    }

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''

      try {
        if (isLogin.value) {
          await store.dispatch('user/login', form.value)
        } else {
          await store.dispatch('user/register', form.value)
        }
        router.push('/albums')
      } catch (err) {
        error.value = isLogin.value
            ? '登录失败，请检查邮箱和密码'
            : '注册失败，邮箱可能已被使用'
      } finally {
        loading.value = false
      }
    }

    return {
      isLogin,
      loading,
      error,
      form,
      toggleMode,
      handleSubmit
    }
  }
}
</script>