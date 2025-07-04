<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLogin ? '登录您的账户' : '创建新账户' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或
          <a @click.prevent="toggleMode" class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
            {{ isLogin ? '注册新账户' : '使用已有账户登录' }}
          </a>
        </p>
      </div>
      <div class="mt-8 bg-white py-8 px-4 shadow rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">电子邮箱</label>
            <div class="mt-1">
              <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  v-model="form.email"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
            <div class="mt-1">
              <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  v-model="form.password"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <div v-if="!isLogin">
            <label for="username" class="block text-sm font-medium text-gray-700">用户名</label>
            <div class="mt-1">
              <input
                  id="username"
                  name="username"
                  type="text"
                  autocomplete="username"
                  required
                  v-model="form.username"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-sm">
            {{ error }}
          </div>

          <div>
            <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中...
              </span>
              <span v-else>{{ isLogin ? '登录' : '注册' }}</span>
            </button>
          </div>
        </form>
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
      password: '',
      username: ''
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
          await store.dispatch('login', {
            email: form.value.email,
            password: form.value.password
          })
        } else {
          await store.dispatch('register', {
            email: form.value.email,
            password: form.value.password,
            username: form.value.username
          })
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