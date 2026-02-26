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
        filename: 'dist/bundle-report.html',
        template: 'treemap',
        brotliSize: true,
        gzipSize: true,
        open: true
      }),
      visualizer({
        filename: 'dist/bundle-report.json',
        template: 'raw-data',
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
        additionalData: `@use "@/app/assets/sass/variables.scss" as *;`
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
    assetsInlineLimit: 4096,
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
            if (id.includes('vue-chartjs') || id.includes('chart.js')) return 'vendor_chart'
            if (id.includes('vue-qrcode') || id.includes('qrcode')) return 'vendor_qrcode'
            if (id.includes('vue')) return 'vendor_vue'
            if (id.includes('axios')) return 'vendor_axios'
            if (id.includes('vue-router')) return 'vendor_router'
            if (id.includes('pinia')) return 'vendor_pinia'
            const pkgMatch = id.match(/node_modules\/(?:@[^/]+\/)?([^/]+)/)
            return pkgMatch ? `vendor_${pkgMatch[1].replace(/\./g, '_')}` : 'vendor_misc'
          }

          if (id.includes('src/pages/')) {
            const match = id.match(/src\/pages\/([^/]+)\//)
            return match ? 'page_' + match[1] : 'pages'
          }
          if (id.includes('src/shared/ui/modals/')) {
            const match = id.match(/src\/shared\/ui\/modals\/([^/]+)/)
            return match ? 'modal_' + match[1] : 'modals'
          }
          if (id.includes('src/shared/ui/')) return 'shared_ui'
          if (id.includes('src/widgets/')) {
            const match = id.match(/src\/widgets\/([^/]+)/)
            return match ? 'widget_' + match[1] : 'widgets'
          }
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
      'vue-qrcode',
      'chart.js',
      'vue-chartjs'
    ],
    exclude: ['vuetify'],
    // Быстрее старт dev: не ждём полного обхода статики
    holdUntilCrawlEnd: false,
    esbuildOptions: {
      target: 'esnext'
    }
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
