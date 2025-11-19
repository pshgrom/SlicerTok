import { defineStore } from 'pinia'
import { ref } from 'vue'

import { streamerListQuery } from '@/api/streamers.ts'
import { ROLES } from '@/constants/roles.ts'
import { useAuth } from '@/stores/Auth.ts'

export const useStreamers = defineStore('streamersStore', () => {
  const authStore = useAuth()
  const streamerList = ref([])
  const streamer = ref<number | string | null>(
    authStore.role === ROLES.SLICER ? localStorage.getItem('streamerChat') || null : null
  )
  const streamersLoaded = ref(false)

  const getStreamerList = async () => {
    try {
      const { data } = await streamerListQuery()
      if (data?.code === 200) {
        streamerList.value = data?.data ?? []
        streamerList.value = streamerList.value?.map((el) => {
          const { id: value, name: label, key } = el ?? {}
          return {
            label,
            value,
            key
          }
        })
        streamersLoaded.value = true
      }
    } catch (error: any) {
      throw error?.response?.data?.message ?? ''
    }
  }

  const setStreamer = async (value: number) => {
    streamer.value = value
    if (authStore.role === ROLES.SLICER) {
      localStorage.setItem('streamerChat', value.toString())
    }
  }

  return {
    getStreamerList,
    streamersLoaded,
    streamerList,
    setStreamer,
    streamer
  }
})
