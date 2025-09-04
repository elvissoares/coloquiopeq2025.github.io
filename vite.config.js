import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If the repo is github.com/<user>/<repo>, set base to '/<repo>/'
export default defineConfig({
  plugins: [react()],
  base: '/coloquiopeq2025.github.io/'
})