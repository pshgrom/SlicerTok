import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import dynamicImport from 'vite-plugin-dynamic-import'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import svgLoader from 'vite-svg-loader'

const isProd = process.env.NODE_ENV === 'production'

const prodPlugins = [
  viteCompression({
    algorithm: 'gzip',
    ext: '.gz',
    threshold: 10240
  }),

  viteCompression({
    algorithm: 'brotliCompress',
    ext: '.br',
    threshold: 10240
  }),

  visualizer({
    filename: 'bundle-report.html',
    template: 'treemap',
    brotliSize: true,
    gzipSize: true,
    open: true
  })
]

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['masked-input'].includes(tag)
        }
      }
    }),

    vuetify({ autoImport: true }),

    svgLoader({
      svgoConfig: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeDimensions', active: true }
        ]
      }
    }),

    dynamicImport(),

    ...(isProd ? prodPlugins : [])
  ],

  build: {
    target: 'esnext',
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'esbuild',
    assetsInlineLimit: 4096,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor_vue'
            if (id.includes('vuetify')) return 'vendor_vuetify'
            if (id.includes('lodash')) return 'vendor_lodash'
            if (id.includes('vue-router')) return 'vendor_router'
            if (id.includes('pinia')) return 'vendor_pinia'
            return 'vendor_misc'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },

  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vue-the-mask', 'lodash-es'],
    exclude: []
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  esbuild: {
    drop: isProd ? ['console', 'debugger'] : []
  }
})
