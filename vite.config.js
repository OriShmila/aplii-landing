import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "directory-index",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Handle /terms/privacy -> /terms/privacy/index.html
          if (req.url === "/terms/privacy") {
            req.url = "/terms/privacy.html";
          } else if (req.url === "/terms/cookies") {
            req.url = "/terms/cookies.html";
          } else if (req.url === "/terms/service") {
            req.url = "/terms/service.html";
          }
          next();
        });
      },
    },
  ],
  root: ".",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["lucide-react"],
        },
      },
    },
  },
  server: {
    port: 3010,
    open: true,
    host: true,
  },
  preview: {
    port: 4173,
    open: true,
    host: true,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
});
