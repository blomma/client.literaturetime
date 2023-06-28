import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), mkcert()],
    server: {
        port: 44472,
        https: true,
        strictPort: true,
        proxy: {
            "/api": {
                target: "http://localhost:8003",
                changeOrigin: true,
                secure: false,
                // rewrite: (path) => path.replace(/^\/api/, "/api"),
            },
        },
    },
});
