import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import vClickOutside from 'click-outside-vue3'
import { createPinia } from 'pinia'
import VueTheMask from 'vue-the-mask/dist/vue-the-mask.js'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { ru } from 'vuetify/locale'

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'ru',
    messages: { ru }
  }
})

const app = createApp(App)

app.use(router).use(VueTheMask).use(vClickOutside).use(createPinia()).use(vuetify).mount('#app')
