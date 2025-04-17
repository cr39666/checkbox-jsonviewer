import { fileURLToPath, URL } from 'node:url'

import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      outDir: 'dist',
      insertTypesEntry: true,
    }),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/package/index.ts'),
      name: 'checkbox-jsonviewer',
      fileName: (format) => `checkbox-jsonviewer.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'pinia', 'element-plus'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          'element-plus': 'ElementPlus'
        },
      }
    },
  }
})
