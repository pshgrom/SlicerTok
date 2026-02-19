import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import type { Config as SvgoConfig } from 'svgo'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

const isProd = process.env.NODE_ENV === 'production'
const isAnalyze = process.env.ANALYZE === 'true'

const compressionPlugins = [
  viteCompression({
    algorithm: 'gzip',
    ext: '.gz',
    threshold: 10240,
    filter: /\.(js|mjs|json|css|html)$/i
  }),

  viteCompression({
    algorithm: 'brotliCompress',
    ext: '.br',
    threshold: 10240,
    filter: /\.(js|mjs|json|css|html)$/i,
    compressionOptions: { level: 11 }
  })
]

const analyzerPlugins = isAnalyze
  ? [
      visualizer({
        filename: 'bundle-report.html',
        template: 'treemap',
        brotliSize: true,
        gzipSize: true,
        open: true
      }),
      visualizer({
        filename: 'bundle-report.json',
        json: true,
        brotliSize: true,
        gzipSize: true
      })
    ]
  : []

export default defineConfig({
  cacheDir: 'node_modules/.vite_cache',
  experimental: {
    persistentCache: true
  },
  plugins: [
    // lazyImport({
    //   dirs: ['src/views', 'src/components/modals']
    // }),
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      },
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['masked-input'].includes(tag)
        }
      }
    }),
    vuetify({ autoImport: true, styles: 'sass' }),
    // Components({
    //   resolvers: [VuetifyResolver()]
    // }),

    svgLoader({
      svgoConfig: {
        multipass: true,
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeTitle', active: true },
          { name: 'removeDesc', active: true }
        ]
      } satisfies SvgoConfig
    }),

    ...(isProd ? compressionPlugins : [])
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/sass/variables.scss" as *;`
      }
    }
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['slicertok-frontend', 'localhost']
  },

  build: {
    target: 'esnext',
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'esbuild',
    assetsInlineLimit: 2048,
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
    modulePreload: { polyfill: false },
    reportCompressedSize: false,

    rollupOptions: {
      external: ['vuetify/lib'],
      plugins: [...analyzerPlugins],
      output: {
        inlineDynamicImports: false,

        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vuetify')) return 'vendor_vuetify'
            if (id.includes('vue')) return 'vendor_vue'
            if (id.includes('axios')) return 'vendor_axios'
            if (id.includes('vue-router')) return 'vendor_router'
            if (id.includes('pinia')) return 'vendor_pinia'
            if (id.includes('chart.js')) return 'vendor_chart'
            if (id.includes('vue-chartjs')) return 'vendor_chart'
            return 'vendor_misc'
          }

          if (id.includes('src/views/')) {
            return 'view_' + id.split('src/views/')[1].split('/')[0]
          }

          if (id.includes('src/components/modals/')) {
            const name = id.split('src/components/modals/')[1].split('/')[0]
            return 'modal_' + name
          }
          if (id.includes('src/components/landing/')) return 'components_landing'
          if (id.includes('src/components/tables/')) return 'components_tables'
          if (id.includes('src/components/base/')) return 'components_base'
          if (id.includes('src/components/')) return 'components_misc'
        },

        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'dompurify',
      'click-outside-vue3',
      'vue-qrcode'
    ],
    exclude: ['vuetify']
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    dedupe: ['vue']
  },

  esbuild: {
    target: 'esnext',
    drop: isProd ? ['console', 'debugger'] : [],
    legalComments: 'none'
  },

  define: {
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_OPTIONS_API__: false,
    'process.env.DEBUG': false
  }
})
