import { defineStore } from 'pinia'
import { ref } from 'vue'

import { streamerListQuery } from '@/api/streamers.ts'

export const useStreamers = defineStore('streamersStore', () => {
  const streamerList = ref([])
  const streamersLoaded = ref(false)

  const getStreamerList = async () => {
    try {
      const { data } = await streamerListQuery()
      if (data?.code === 200) {
        streamerList.value = data?.data ?? []
        streamerList.value = streamerList.value?.map((el) => {
          const { id: value, name: label } = el ?? {}
          return {
            label,
            value
          }
        })
        streamersLoaded.value = true
      }
    } catch (error: any) {
      throw error?.response?.data?.message ?? ''
    }
  }

  return {
    getStreamerList,
    streamersLoaded,
    streamerList
  }
})
