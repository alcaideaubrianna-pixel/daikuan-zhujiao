import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImport({ resolvers: [VantResolver()] }), Components({ dirs: ['src/components'], resolvers: [VantResolver()] })],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['lifetime-schedule-lime-julia.trycloudflare.com'],
    proxy: {
      '/app': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
    },
  },
})
