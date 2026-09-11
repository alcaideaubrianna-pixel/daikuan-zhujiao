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
    allowedHosts: ['lifetime-schedule-lime-julia.trycloudflare.com'],
  },
})
