
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/json-prism-viewer/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['@monaco-editor/react']
  },
  define: {
    // Add process.env for libraries that depend on it
    'process.env': {
      NODE_ENV: JSON.stringify(mode),
    },
    'process.browser': true,
    'process.version': '"v16.0.0"',
    'process.platform': '"browser"',
  },
}));
