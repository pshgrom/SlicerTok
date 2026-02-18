import { createVuetify } from 'vuetify'
import { ru } from 'vuetify/locale'

export default createVuetify({
  locale: {
    locale: 'ru',
    messages: { ru }
  },
  theme: {
    defaultTheme: localStorage.getItem('theme') || 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: 'rgba(17, 17, 17, 1)',
          background: '#FFFFFF',
          surface: '#FFFFFF',
          header: '#FFFFFF',
          main: '#EFF0F6',
          chipColor: '#626187',
          chipBg: '#EFF0F6',
          uploadVideoBg: 'rgba(242, 246, 254, 1)'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: 'rgba(255, 255, 255, 1)',
          background: 'rgba(26, 26, 41, 1)',
          surface: '#1E1E1E',
          header: '#1A1A29',
          main: '#141422',
          chipColor: '#7E81A0',
          chipBg: '#212132',
          uploadVideoBg: '#212132'
        }
      }
    }
  }
})
