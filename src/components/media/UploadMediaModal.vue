<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">上传照片</h3>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">选择文件</label>
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <!-- 视频预览 -->
                <div v-if="previewUrl && isVideoFile" class="relative h-20 w-full">
                  <video :src="previewUrl" class="h-full w-full object-cover rounded"></video>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white bg-black bg-opacity-50 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    </svg>
                  </div>
                </div>
                <svg v-if="!previewUrl" class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <img v-else-if="!isVideoFile" :src="previewUrl" class="h-20 object-cover rounded">
                <p v-if="!previewUrl" class="text-sm text-gray-500 mt-2">
                  <span class="font-semibold">点击上传</span> 或拖放文件
                </p>
                <p class="text-xs text-gray-500 mt-1">{{ file?.name }}</p>
              </div>
              <!-- 同时支持图片和视频 -->
              <input type="file" class="hidden" @change="handleFileChange" accept="image/*,video/*">
            </label>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">文件名</label>
          <input type="text" v-model="filename" class="w-full px-3 py-2 border border-gray-300 rounded-md">
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">描述</label>
          <textarea v-model="description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            取消
          </button>
          <button @click="upload" :disabled="uploading || !file"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            <span v-if="uploading">上传中...</span>
            <span v-else>上传</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    albumId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props, { emit }) {
    const store = useStore()
    const file = ref(null)
    const previewUrl = ref('')
    const filename = ref('')
    const description = ref('')
    const uploading = ref(false)

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0]
      if (!selectedFile) return

      file.value = selectedFile
      filename.value = filename.value || selectedFile.name

      // 生成预览
      const reader = new FileReader()
      reader.onload = (e) => {
        previewUrl.value = e.target.result
      }
      reader.readAsDataURL(selectedFile)
    }

    const upload = async () => {
      if (!file.value) return

      uploading.value = true
      try {
        const dto = {
          filename: filename.value,
          description: description.value
        }

        await store.dispatch('album/uploadMedia', {
          albumId: props.albumId,
          file: file.value,
          dto
        })

        emit('close')
        emit('uploaded')
      } catch (error) {
        console.error('上传失败', error)
        alert('上传失败，请重试')
      } finally {
        uploading.value = false
      }
    }

    const isVideoFile = computed(() => {
      return file.value?.type.startsWith('video/')
    })

    return {
      file,
      previewUrl,
      filename,
      description,
      uploading,
      isVideoFile,
      handleFileChange,
      upload
    }
  }
}
</script>