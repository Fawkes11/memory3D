import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/memory3D/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})