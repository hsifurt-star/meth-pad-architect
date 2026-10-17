import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Permit the managed Preview gateway without disabling Vite's host validation globally.
  server: { allowedHosts: ['.us5.manus.computer'] },
  preview: { allowedHosts: ['.us5.manus.computer'] },
})
