<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <!-- 表单标题 -->
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800">{{ formTitle }}</h2>
      </div>

      <!-- 表单内容 -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <!-- 相册名称 -->
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">相册名称</label>
            <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="输入相册名称"
            >
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- 相册描述 -->
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">相册描述</label>
            <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="输入相册描述（可选）"
            ></textarea>
          </div>

          <!-- 公开相册选项 -->
          <div class="mb-6">
            <div class="flex items-center">
              <input
                  type="checkbox"
                  id="isPublic"
                  v-model="formData.isPublic"
                  class="h-4 w-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded"
              >
              <label for="isPublic" class="ml-2 block text-sm text-gray-700">设为公开相册</label>
            </div>
            <p class="mt-1 text-xs text-gray-500">公开相册可以被所有用户查看</p>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-3">
            <button
                type="button"
                @click="handleCancel"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中...
              </span>
              <span v-else>{{ submitText }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'

export default {
  name: 'AlbumForm',
  props: {
    // 初始表单数据（包含原有相册信息）
    initialData: {
      type: Object,
      required: true,
      default: () => ({
        albumId: null,
        name: '',
        description: '',
        isPublic: true
      })
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 提交按钮文本
    submitText: {
      type: String,
      default: '保存'
    },
    // 表单模式：'create' 或 'edit'
    mode: {
      type: String,
      default: 'create'
    }
  },

  emits: ['submit', 'cancel'], // 声明组件触发的事件

  setup(props, { emit }) {
    // 表单数据
    const formData = ref({ ...props.initialData })

    // 错误信息
    const errors = ref({ name: '' })

    // 表单标题
    const formTitle = computed(() => {
      return props.mode === 'create' ? '创建新相册' : '编辑相册'
    })

    // 监听initialData的变化
    watch(
        () => props.initialData,
        (newData) => {
          formData.value = { ...newData }
        },
        { deep: true }
    )

    // 表单提交处理
    const handleSubmit = () => {
      // 验证表单数据
      errors.value.name = ''

      if (!formData.value.name || formData.value.name.trim() === '') {
        errors.value.name = '相册名称不能为空'
        return
      }

      if (formData.value.name.length > 30) {
        errors.value.name = '相册名称不能超过30个字符'
        return
      }

      // 触发submit事件，将表单数据传递给父组件
      emit('submit', formData.value)
    }

    // 取消按钮处理
    const handleCancel = () => {
      emit('cancel')
    }

    return {
      formData,
      errors,
      formTitle,
      handleSubmit,
      handleCancel
    }
  }
}
</script>

<style scoped>
/* 添加一些微妙的动画效果 */
.bg-opacity-50 {
  transition: opacity 0.3s ease;
}

.rounded-lg {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.rounded-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>