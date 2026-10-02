import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['Android >= 7', 'Chrome >= 49', 'iOS >= 12'],
      modernPolyfills: true,
      renderLegacyChunks: true,
    }),
    AutoImport({ resolvers: [VantResolver()] }),
    Components({ dirs: ['src/components'], resolvers: [VantResolver()] }),
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['lifetime-schedule-lime-julia.trycloudflare.com'],
    proxy: {
      '/app/': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
    },
  },
})
