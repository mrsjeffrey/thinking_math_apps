import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/thinking_math_apps/',
  plugins: [react()]
})
