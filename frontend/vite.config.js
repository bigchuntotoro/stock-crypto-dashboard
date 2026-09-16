import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window", // global을 window 객체로 매핑
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8085",
        changeOrigin: true,
      },
      "/ws": {
        target: "http://localhost:8085",
        ws: true,
      },
    },
  },
});
