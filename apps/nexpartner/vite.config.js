import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // M1-L06: Habilitado para reconhecimento do Red Team
    outDir: 'dist'
  }
});
