import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'NDAnimations',
      fileName: () => 'bundle.min.js',
      formats: ['iife'],
    },
    outDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
