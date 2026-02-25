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
          inversionPrimary: 'rgba(255, 255, 255, 1)',
          loaderSmall: 'rgba(255, 255, 255, 0.7)',
          background: '#FFFFFF',
          actionBg: 'rgba(229, 236, 253, 1)',
          surface: '#FFFFFF',
          header: '#FFFFFF',
          main: '#EFF0F6',
          chipColor: '#626187',
          chipBg: '#EFF0F6',
          uploadVideoBg: 'rgba(242, 246, 254, 1)',
          borderColor: 'rgba(223, 225, 237, 1)',
          // statusCreateBg: 'rgba(223, 225, 237, 1)'
          statusProcessBg: '#f5ebfe',
          statusProcessColor: 'rgba(145, 45, 228, 1)',
          statusRejectBg: '#ffcccc',
          statusRejectColor: 'rgba(255, 0, 0, 1)',
          statusApprovedBg: '#e7f5f0',
          statusApprovedColor: 'rgba(16, 154, 106, 1)'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: 'rgba(255, 255, 255, 1)',
          inversionPrimary: 'rgba(17, 17, 17, 1)',
          loaderSmall: 'rgba(17, 17, 17, 0.7)',
          background: 'rgba(26, 26, 41, 1)',
          actionBg: '#28283c',
          surface: '#1E1E1E',
          header: '#1A1A29',
          main: '#141422',
          chipColor: '#7E81A0',
          chipBg: '#212132',
          uploadVideoBg: '#212132',
          borderColor: 'rgba(38, 37, 62, 1)',
          statusProcessBg: '#311f4a',
          statusProcessColor: 'rgba(169, 77, 250, 1)',
          statusRejectBg: '#5a141e',
          statusRejectColor: 'rgba(255, 0, 0, 1)',
          statusApprovedBg: '#182e32',
          statusApprovedColor: 'rgba(16, 154, 106, 1)'
        }
      }
    }
  }
})
