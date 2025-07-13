<template>
  <div class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
    <button @click="$emit('close')" class="absolute top-4 right-4 text-white">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <div class="max-w-4xl w-full">
      <div class="flex justify-center">
        <img v-if="media.fileType === 'image'" :src="media.url" class="max-h-[80vh] object-contain">
        <!-- 视频播放器 - 使用后端提供的视频URL -->
        <video
            v-else
            ref="videoPlayer"
            :src="media.url"
            :poster="media.thumbnailUrl"
            class="max-h-[80vh] max-w-full"
            controls
            autoplay
            @play="playing = true"
            @pause="playing = false"
            @loadedmetadata="handleVideoLoaded"
            @ended="playing = false"
        ></video>
      </div>

      <div class="mt-4 bg-black/50 text-white p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-medium text-lg">{{ media.fileName }}</h3>
            <div class="flex items-center mt-1">
              <span class="text-gray-300 text-sm mr-3">
                {{ formatFileSize(media.fileSize) }}
              </span>
              <span v-if="media.duration" class="text-gray-300 text-sm">
                {{ formatDuration(media.duration) }}
              </span>
            </div>
          </div>
          <div class="flex space-x-2">
            <button @click="$emit('download', media)"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              下载
            </button>
            <button v-if="canDelete" @click="showDeleteConfirm = true"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              删除
            </button>
          </div>
        </div>

        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 class="text-lg font-medium text-gray-900 mb-4">确认删除媒体</h3>
            <p class="text-gray-500 mb-6">确定要删除 "{{ media.fileName }}" 吗？此操作将永久删除该文件，无法撤销。</p>
            <div class="flex justify-end space-x-3">
              <button @click="showDeleteConfirm = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                取消
              </button>
              <button @click="confirmDeleteMedia" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, onUnmounted, computed, watch} from 'vue'

export default {
  props: {
    media: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const videoPlayer = ref(null)
    const playing = ref(false)
    const muted = ref(false)
    const volume = ref(0.7)
    const currentTime = ref(0)
    const duration = ref(0)
    const isFullscreen = ref(false)
    const showDeleteConfirm = ref(false)

    // 格式化时间 (秒 -> mm:ss)
    const formatTime = (seconds) => {
      if (isNaN(seconds)) return '00:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // 格式化时长 (毫秒 -> mm:ss)
    const formatDuration = (millis) => {
      if (!millis) return ''
      const seconds = Math.floor(millis / 1000)
      return formatTime(seconds)
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // 视频元数据加载完成
    const handleVideoLoaded = () => {
      if (videoPlayer.value) {
        duration.value = videoPlayer.value.duration
        // 设置初始音量
        videoPlayer.value.volume = volume.value
        // 开始播放
        videoPlayer.value.play()
      }
    }

    // 更新当前播放时间
    const updateTime = () => {
      if (videoPlayer.value) {
        currentTime.value = videoPlayer.value.currentTime
      }
    }

    // 切换播放状态
    const togglePlay = () => {
      if (!videoPlayer.value) return
      if (videoPlayer.value.paused) {
        videoPlayer.value.play()
      } else {
        videoPlayer.value.pause()
      }
    }

    // 切换静音
    const toggleMute = () => {
      if (!videoPlayer.value) return
      videoPlayer.value.muted = !videoPlayer.value.muted
      muted.value = videoPlayer.value.muted
    }

    // 设置音量
    const setVolume = () => {
      if (!videoPlayer.value) return
      videoPlayer.value.volume = volume.value
      muted.value = volume.value === 0
    }

    // 视频跳转
    const seekVideo = () => {
      if (!videoPlayer.value) return
      videoPlayer.value.currentTime = currentTime.value
    }

    // 切换全屏
    const toggleFullscreen = () => {
      if (!videoPlayer.value) return

      if (!document.fullscreenElement) {
        if (videoPlayer.value.requestFullscreen) {
          videoPlayer.value.requestFullscreen()
        } else if (videoPlayer.value.webkitRequestFullscreen) {
          videoPlayer.value.webkitRequestFullscreen()
        } else if (videoPlayer.value.msRequestFullscreen) {
          videoPlayer.value.msRequestFullscreen()
        }
        isFullscreen.value = true
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        isFullscreen.value = false
      }
    }

    const canDelete = computed(() => {
      // 根据权限判断是否可以删除
      // 实际项目中应该从store中获取当前用户权限
      return true
    })

    const confirmDeleteMedia = () => {
      emit('delete', props.media)
      showDeleteConfirm.value = false
    }

    watch(playing, (newVal) => {
      if (videoPlayer.value) {
        if (newVal) {
          videoPlayer.value.play()
        } else {
          videoPlayer.value.pause()
        }
      }
    })

    // 添加全屏状态变化监听
    const handleFullscreenChange = () => {
      isFullscreen.value = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
      )
    }

    onMounted(() => {
      if (props.media.fileType === 'video' && videoPlayer.value) {
        // 设置时间更新监听
        videoPlayer.value.addEventListener('timeupdate', updateTime)
        // 添加全屏事件监听
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
        document.addEventListener('msfullscreenchange', handleFullscreenChange)
      }
    })

    onUnmounted(() => {
      if (videoPlayer.value) {
        videoPlayer.value.pause()
        videoPlayer.value.removeEventListener('timeupdate', updateTime)
        videoPlayer.value = null
        // 移除全屏事件监听
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
        document.removeEventListener('msfullscreenchange', handleFullscreenChange)
      }
    })

    // 添加键盘快捷键支持
    const handleKeydown = (e) => {
      if (!videoPlayer.value) return

      switch (e.key) {
        case ' ':
          togglePlay()
          e.preventDefault()
          break
        case 'ArrowLeft':
          videoPlayer.value.currentTime = Math.max(0, videoPlayer.value.currentTime - 5)
          break
        case 'ArrowRight':
          videoPlayer.value.currentTime = Math.min(
              duration.value,
              videoPlayer.value.currentTime + 5
          )
          break
        case 'm':
          toggleMute()
          break
        case 'f':
          toggleFullscreen()
          break
        case 'Escape':
          if (isFullscreen.value) {
            toggleFullscreen()
          }
          break
      }
    }

    onMounted(() => {
      window.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown)
    })

    return {
      videoPlayer,
      playing,
      muted,
      volume,
      currentTime,
      duration,
      isFullscreen,
      canDelete,
      formatTime,
      formatDuration,
      formatFileSize,
      togglePlay,
      toggleMute,
      setVolume,
      seekVideo,
      toggleFullscreen,
      showDeleteConfirm,
      confirmDeleteMedia,
      handleVideoLoaded
    }
  }
}
</script>

<style scoped>
video {
  background-color: #000;
  border-radius: 4px;
  max-width: 100%;
  max-height: 80vh;
}
</style>