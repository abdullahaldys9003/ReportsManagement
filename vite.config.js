
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@common': '/src/common',
            '@assets': path.resolve(__dirname, 'src/assets')
    },
  },
});




