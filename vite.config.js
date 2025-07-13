import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 8080, // 指定端口号
    open: true, // 自动打开浏览器
    host: true, // 允许局域网访问（可选，见下文说明）
    allowedHosts: [
      'fusionbase.free.idcfengye.com',
      'localhost',
      '[2409:8a70:9cb:8151:ecaf:d5d2:a8d7:7bbc]',
    ]
  },
  define: {
    "import.meta.env.API_URL" : JSON.stringify("http://localhost:8081")
  }
})
