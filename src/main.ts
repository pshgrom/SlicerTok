import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import vClickOutside from 'click-outside-vue3'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueTheMask from 'vue-the-mask/dist/vue-the-mask.js'

import SvgIcon from '@/components/base/SvgIcon.vue'
import vuetify from '@/plugins/vuetify'

import App from './App.vue'
import router from './router'

createApp(App)
  .component('SvgIcon', SvgIcon)
  .use(router)
  .use(VueTheMask)
  .use(vClickOutside)
  .use(createPinia())
  .use(vuetify)
  .mount('#app')
