import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import SvgIcon from '@/components/base/SvgIcon.vue'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import vuetify from '@/plugins/vuetify'

import vClickOutside from 'click-outside-vue3'
import VueTheMask from 'vue-the-mask/dist/vue-the-mask.js'

createApp(App)
  .component('SvgIcon', SvgIcon)
  .use(router)
  .use(VueTheMask)
  .use(vClickOutside)
  .use(createPinia())
  .use(vuetify)
  .mount('#app')
