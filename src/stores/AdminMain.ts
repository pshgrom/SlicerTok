import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getAdminMainInfoQuery } from '@/api/adminInfo'
import { useError } from '@/stores/Errors.ts'

export const useAdminMain = defineStore('adminMainStore', () => {
  const errorStore = useError()
  const streamers = ref([])

  const getAdminMainInfo = async () => {
    try {
      const { data } = await getAdminMainInfoQuery()
      streamers.value = data?.data ?? []
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  return {
    getAdminMainInfo,
    streamers
  }
})
