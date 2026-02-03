import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getAdminMainInfoQuery, getMainAdminInfoQuery } from '@/api/adminInfo'
import { verifyTwoFactorQuery } from '@/api/userInfo.ts'
import { useError } from '@/stores/Errors.ts'
import { useHeaderMain } from '@/stores/HeaderMain.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

export const useAdminMain = defineStore('adminMainStore', () => {
  const errorStore = useError()
  const streamers = ref([])
  const headerMainStore = useHeaderMain()
  const userInfo = useUserInfo()
  const isEnableGoogle2fa = ref(false)

  const getAdminMainInfo = async () => {
    try {
      const { data } = await getAdminMainInfoQuery()
      streamers.value = data?.data ?? []
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const getMainAdminInfo = async () => {
    try {
      const { data } = await getMainAdminInfoQuery()
      isEnableGoogle2fa.value = !!data.data?.is_enable_google2fa
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const checkCode = async (code: string) => {
    try {
      const { data } = await verifyTwoFactorQuery(+code)
      const isValidCode = data.valid
      if (isValidCode) {
        errorStore.setErrors('Верный код', 'success')
        await getMainAdminInfo()
        headerMainStore.isModalOpen = false
        userInfo.qrCode = ''
      } else {
        errorStore.setErrors('Неверный код', 'error')
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  return {
    getAdminMainInfo,
    streamers,
    checkCode,
    isEnableGoogle2fa,
    getMainAdminInfo
  }
})
