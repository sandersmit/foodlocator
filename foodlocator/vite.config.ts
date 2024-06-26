
import vue from "@vitejs/plugin-vue";
import vuetify from 'vite-plugin-vuetify'
import checker from 'vite-plugin-checker';

import { defineConfig } from "vite";
import path from 'path'



// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    // checker({
    //   vueTsc: true,
    // })
  ],
  resolve: {
    
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 4000,
  },

});
