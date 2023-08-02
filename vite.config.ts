import { URL, fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), eslint()],
  server: {
    port: 3000,
    host: true,
  },
  css: {
    devSourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@components', replacement: fileURLToPath(new URL('./src/components/', import.meta.url)) },
      { find: '@constants', replacement: fileURLToPath(new URL('./src/constants/', import.meta.url)) },
      { find: '@core', replacement: fileURLToPath(new URL('./src/core/', import.meta.url)) },
      { find: '@styles', replacement: fileURLToPath(new URL('./src/styles/', import.meta.url)) },
      { find: '@layout', replacement: fileURLToPath(new URL('./src/layout/', import.meta.url)) },
      { find: '@screens', replacement: fileURLToPath(new URL('./src/screens/', import.meta.url)) },
      { find: '@api', replacement: fileURLToPath(new URL('./src/api/', import.meta.url)) },
      { find: '@assets', replacement: fileURLToPath(new URL('./src/assets/', import.meta.url)) },
      { find: '@helpers', replacement: fileURLToPath(new URL('./src/helpers/', import.meta.url)) },
      { find: '@hooks', replacement: fileURLToPath(new URL('./src/hooks/', import.meta.url)) },
      { find: '@pages', replacement: fileURLToPath(new URL('./src/pages/', import.meta.url)) },
      { find: '@store', replacement: fileURLToPath(new URL('./src/store/', import.meta.url)) },
      { find: '@types', replacement: fileURLToPath(new URL('./src/types/', import.meta.url)) },
    ],
  },
});
