import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'
const base = isGitHubPages && repositoryName ? `/${repositoryName}/` : '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@features': path.resolve(__dirname, './src/features'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
