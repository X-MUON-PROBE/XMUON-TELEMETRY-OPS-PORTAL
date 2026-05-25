import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist"
})
