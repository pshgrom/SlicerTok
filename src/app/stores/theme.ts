import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'theme'

function getStoredTheme(): 'light' | 'dark' {
  if (typeof localStorage === 'undefined') return 'light'
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'light' || saved === 'dark' ? saved : 'dark'
}

export const useThemeStore = defineStore('theme', () => {
  const current = ref<'light' | 'dark'>(getStoredTheme())

  function setTheme(theme: 'light' | 'dark') {
    current.value = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }

  function initTheme() {
    current.value = getStoredTheme()
  }

  function toggle() {
    const next = current.value === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  return { current, setTheme, initTheme, toggle }
})
