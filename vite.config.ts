import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    createHtmlPlugin({
      inject: {
        data: {
          timestamp: new Date().toISOString(),
        },
      },
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        {
          axios: [['default', 'axios']],
        },
      ],
      dts: 'src/types/auto-imports.d.ts', // typescript 宣告檔案位置
      vueTemplate: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
