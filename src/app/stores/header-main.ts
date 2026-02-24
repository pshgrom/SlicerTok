import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHeaderMain = defineStore('header-main', () => {
  const isModalOpen = ref(false)

  function updateOpenModal(value: boolean) {
    isModalOpen.value = value
  }

  return { isModalOpen, updateOpenModal }
})
