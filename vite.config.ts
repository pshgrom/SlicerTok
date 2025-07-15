import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import svgLoader from 'vite-svg-loader'

const isProd = process.env.NODE_ENV === 'production'

const prodPlugins = [
  viteCompression({
    algorithm: 'gzip',
    ext: '.gz',
    threshold: 10240,
    filter: /\.(js|mjs|json|css|html|svg)$/i
  }),

  viteCompression({
    algorithm: 'brotliCompress',
    ext: '.br',
    threshold: 10240,
    filter: /\.(js|mjs|json|css|html|svg)$/i,
    compressionOptions: { level: 11 }
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
  cacheDir: 'node_modules/.vite_cache',
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
        multipass: true,
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeDimensions', active: true },
          { name: 'removeTitle', active: true },
          { name: 'removeDesc', active: true },
          { name: 'removeUselessDefs', active: true },
          { name: 'cleanupIDs', active: true },
          { name: 'mergePaths', active: true },
          { name: 'convertShapeToPath', active: true }
        ]
      }
    }),

    ...(isProd ? prodPlugins : [])
  ],

  build: {
    target: 'esnext',
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'esbuild',
    assetsInlineLimit: 4096,
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,

    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor_vue'
            if (id.includes('axios')) return 'vendor_network'
            if (id.includes('lodash')) return 'vendor_lodash'
            if (id.includes('vue-router')) return 'vendor_router'
            if (id.includes('pinia')) return 'vendor_pinia'
            if (id.includes('node_modules')) return 'vendor_misc'
            if (id.includes('vuetify')) {
              if (id.includes('lib/components')) return 'vendor_vuetify_components'
              if (id.includes('lib/labs')) return 'vendor_vuetify_labs'
              return 'vendor_vuetify_core'
            }
          }
          if (id.includes('src/views/') && !id.includes('LoginView.vue')) return 'views'
          if (id.includes('src/components/')) return 'components'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        hoistTransitiveImports: false,
        preserveModules: false,
        generatedCode: {
          preset: 'es2015',
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true
        }
      }
    }
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'vue-the-mask',
      'lodash-es',
      'vuetify/lib/components/*'
    ],
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
