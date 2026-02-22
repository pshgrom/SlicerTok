import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import vClickOutside from 'click-outside-vue3'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import vuetify from '@/app/plugins/vuetify.ts'
import { reveal } from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'

import App from './App.vue'
import router from './router'

createApp(App)
  .directive('reveal', reveal)
  .component('SvgIcon', SvgIcon)
  .use(router)
  .use(vClickOutside)
  .use(createPinia())
  .use(vuetify)
  .mount('#app')
