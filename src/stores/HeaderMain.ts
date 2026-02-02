import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHeaderMain = defineStore('headerMainStore', () => {
  const isModalOpen = ref(false)

  const updateOpenModal = (value: boolean) => {
    isModalOpen.value = value
  }

  return {
    isModalOpen,
    updateOpenModal
  }
})
