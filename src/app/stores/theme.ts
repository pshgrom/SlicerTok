import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const current = ref<'light' | 'dark'>('dark')

  function setTheme(theme: 'light' | 'dark') {
    current.value = theme
    localStorage.setItem('theme', theme)
  }

  function initTheme() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) {
      current.value = saved
    }
  }

  function toggle() {
    const next = current.value === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  return { current, setTheme, initTheme, toggle }
})
