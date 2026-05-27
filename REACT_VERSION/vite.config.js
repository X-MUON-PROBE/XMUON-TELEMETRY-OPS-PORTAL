import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Intercept and silence the invalid annotation warning
      onLog(level, log, handler) {
        if (log.code === 'INVALID_ANNOTATION' && log.message.includes('signalr')) {
          return; // Ignore this specific warning entirely
        }
        handler(level, log); // Fallback for all other logs
      }
    }
  },
  base: "/XMUON-TELEMETRY-OPS-WEB-PORTAL/REACT_VERSION/dist"
})
