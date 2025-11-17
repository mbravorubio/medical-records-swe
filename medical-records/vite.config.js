import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/~mbravo11/medical-records-swe/medical-records-deploy/",
  plugins: [react()],
});
