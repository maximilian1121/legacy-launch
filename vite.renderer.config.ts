import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
    base: "./", // <--- This is the "magic" line for Electron
    plugins: [],
});
