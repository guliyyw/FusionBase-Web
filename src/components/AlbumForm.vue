<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">相册名称</label>
      <input
          type="text"
          id="name"
          v-model="formData.name"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="输入相册名称"
      >
    </div>

    <div class="mb-4">
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">相册描述</label>
      <textarea
          id="description"
          v-model="formData.description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="输入相册描述（可选）"
      ></textarea>
    </div>

    <div class="mb-6">
      <div class="flex items-center">
        <input
            type="checkbox"
            id="isPublic"
            v-model="formData.isPublic"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        >
        <label for="isPublic" class="ml-2 block text-sm text-gray-700">设为公开相册</label>
      </div>
      <p class="mt-1 text-xs text-gray-500">公开相册可以被所有用户查看</p>
    </div>

    <div class="flex justify-end space-x-3">
      <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        取消
      </button>
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
          处理中...
        </span>
        <span v-else>{{ submitText }}</span>
      </button>
    </div>
  </form>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  props: {
    initialData: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: '保存'
    }
  },
  setup(props, { emit }) {
    const formData = ref({ ...props.initialData })

    // 当初始数据变化时更新表单
    watch(() => props.initialData, (newData) => {
      formData.value = { ...newData }
    }, { deep: true })

    const handleSubmit = () => {
      emit('submit', formData.value)
    }

    return {
      formData,
      handleSubmit
    }
  }
}
</script>