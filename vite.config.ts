import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "hn-post-optimizer",
  plugins: [react()],
  server: {
    cors: true,
    host: "0.0.0.0",
  },
});
