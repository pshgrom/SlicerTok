import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoader = defineStore('loader', () => {
  const isLoading = ref(false)

  function start() {
    isLoading.value = true
  }

  function stop() {
    isLoading.value = false
  }

  return {
    isLoading,
    start,
    stop
  }
})
