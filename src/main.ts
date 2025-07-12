import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// ✅ Tree-shaken Vuetify
import { createVuetify } from 'vuetify'
import { ru } from 'vuetify/locale'

import vClickOutside from 'click-outside-vue3'
import VueTheMask from 'vue-the-mask/dist/vue-the-mask.js'

const vuetify = createVuetify({
  locale: {
    locale: 'ru',
    messages: { ru }
  }
})

createApp(App)
  .use(router)
  .use(VueTheMask)
  .use(vClickOutside)
  .use(createPinia())
  .use(vuetify)
  .mount('#app')
