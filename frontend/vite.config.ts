import eslintPlugin from '@nabla/vite-plugin-eslint'
import react from '@vitejs/plugin-react'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

const pwaPlugin = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: [
    'favicon.png',
    'robots.txt',
    'apple-touch-icon.png',
    'icons/*.svg',
    'fonts/*.woff2'
  ],
  manifest: {
    theme_color: '#BD34FE',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
})

const inCodespace = process.env.GITHUB_CODESPACE_TOKEN !== undefined
const plugins: PluginOption[] = [eslintPlugin()]
if (!inCodespace) {
  plugins.push(mkcert())
}

export default defineConfig(({ mode }) => ({
  test: {
    css: false,
    include: ['src/**/__tests__/*'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
    clearMocks: true,
    coverage: {
      include: ['src/**/*'],
      exclude: ['src/main.tsx'],
      thresholds: {
        '100': true
      },
      provider: 'istanbul',
      enabled: true,
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage'
    }
  },
  server: {
    proxy: {
      '/v1': 'http://localhost:7878',
      '/openui': 'http://localhost:7878'
    }
  },
  plugins: [
    tsconfigPaths(),
    react(),
    ...(mode === 'test' ? [] : plugins)
  ],
  build: {
    target: 'es2019', // Use the ESM build
  }
}))
