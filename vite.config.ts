import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        mkdirSync(resolve(__dirname, 'dist/icons'), { recursive: true })
        copyFileSync(
          resolve(__dirname, 'manifest.json'),
          resolve(__dirname, 'dist/manifest.json')
        )
        const icons = ['icon16.png', 'icon48.png', 'icon128.png']
        icons.forEach(icon => {
          try {
            copyFileSync(
              resolve(__dirname, `icons/${icon}`),
              resolve(__dirname, `dist/icons/${icon}`)
            )
          } catch {
            // icon doesn't exist yet, skip
          }
        })
      }
    }
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/serviceWorker.ts'),
        content: resolve(__dirname, 'src/content/extractor.ts'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
})