import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const current = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )

  const toggle = () => {
    current.value = current.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (value: 'light' | 'dark') => {
    current.value = value
  }

  watch(
    current,
    (val) => {
      localStorage.setItem('theme', val)
    },
    { immediate: true }
  )

  return {
    current,
    toggle,
    setTheme
  }
})
