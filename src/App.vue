<template>

  <router-view v-if="$route.path === '/login'"></router-view>

  <div v-else class="min-h-screen bg-gray-50 flex">
    <!-- 左侧导航栏 -->
    <div class="w-64 bg-white shadow-md flex flex-col fixed h-full">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-indigo-600">在线数据管理系统</h1>
      </div>
      <nav class="flex-1 py-4">
        <ul>
          <li>
            <router-link
                to="/albums"
                class="block px-4 py-3 hover:bg-indigo-50 text-gray-700 flex items-center"
                :class="{ 'bg-indigo-50 text-indigo-600': $route.path.includes('/albums') }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              我的相册
            </router-link>
          </li>
          <li>
            <router-link
                to="/shared"
                class="block px-4 py-3 hover:bg-indigo-50 text-gray-700 flex items-center"
                :class="{ 'bg-indigo-50 text-indigo-600': $route.path === '/shared' }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              共享相册
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col ml-64">
      <!-- 顶部用户栏 -->
      <header class="bg-white shadow-sm">
        <div class="flex justify-between items-center px-6 py-4">
          <h2 class="text-lg font-medium text-gray-800">{{ currentRouteName }}</h2>
          <div class="flex items-center space-x-4">
            <div v-if="user" class="flex items-center">
              <img :src="user.avatarUrl || 'https://via.placeholder.com/40'" class="w-8 h-8 rounded-full mr-2">
              <span class="text-gray-700">{{ user.username }}</span>
            </div>
            <router-link to="/profile" class="text-gray-500 hover:text-gray-700 flex items-center">
              个人资料
            </router-link>
            <button @click="logout" class="text-gray-500 hover:text-gray-700 flex items-center">
              退出
            </button>
          </div>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const user = computed(() => store.state.user.user)

    const currentRouteName = computed(() => {
      if (route.path.startsWith('/albums')) {
        return '我的相册'
      } else if (route.path === '/shared') {
        return '共享相册'
      } else if (route.path.startsWith('/album/')) {
        return '相册详情'
      } else if (route.path === '/album/create') {
        return '创建相册'
      } else if (route.path === '/profile') {
        return '个人资料'
      } else {
        return route.name || route.path
      }
    })

    const logout = () => {
      store.dispatch('user/logout')
      router.push('/login')
    }

    return {
      user,
      currentRouteName,
      logout
    }
  }
}
</script>