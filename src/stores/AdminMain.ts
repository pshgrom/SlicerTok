import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  getAdminMainInfoQuery,
  getAdminsForCurrentStreamerQuery,
  getAdminStatsQuery,
  getMainAdminInfoQuery
} from '@/api/adminInfo'
import { verifyTwoFactorQuery } from '@/api/userInfo.ts'
import type { ITableParams } from '@/interfaces/AppModel.ts'
import { useError } from '@/stores/Errors.ts'
import { useHeaderMain } from '@/stores/HeaderMain.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

export const useAdminMain = defineStore('adminMainStore', () => {
  const errorStore = useError()
  const streamers = ref([])
  const headerMainStore = useHeaderMain()
  const userInfo = useUserInfo()
  const isEnableGoogle2fa = ref(false)
  const adminsForCurrentStreamer = ref([])
  const adminsStats = ref([])
  const loadingAdminsForCurrentStreamer = ref(false)
  const loadingStats = ref(false)

  const queryParamsStats = ref<ITableParams>({
    page: 1,
    perPage: 10,
    total: 0
  })

  const setQueryParams = (val: ITableParams) => {
    queryParamsStats.value = {
      ...queryParamsStats.value,
      ...val
    }
  }

  const getAdminMainInfo = async () => {
    try {
      const { data } = await getAdminMainInfoQuery()
      streamers.value = data?.data ?? []
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const getAdminsForCurrentStreamer = async (id: string) => {
    try {
      const query = {
        streamer_id: id
      }
      loadingAdminsForCurrentStreamer.value = true
      const { data } = await getAdminsForCurrentStreamerQuery(query)
      adminsForCurrentStreamer.value = data?.data?.admin_list ?? []
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    } finally {
      loadingAdminsForCurrentStreamer.value = false
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

  const getAdminStats = async (params, adminId) => {
    try {
      const qeury = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      loadingStats.value = true
      const { data } = await getAdminStatsQuery(qeury, adminId)
      adminsStats.value = data?.data?.data ?? []
      const queryResp = data.data ?? {}
      const { current_page, per_page, total } = queryResp
      queryParamsStats.value = {
        ...queryParamsStats.value,
        page: current_page,
        perPage: per_page
      }
    } catch (error) {
      console.log(error)
    } finally {
      loadingStats.value = false
    }
  }

  return {
    getAdminMainInfo,
    streamers,
    checkCode,
    isEnableGoogle2fa,
    getMainAdminInfo,
    queryParamsStats,
    setQueryParams,
    getAdminsForCurrentStreamer,
    adminsForCurrentStreamer,
    loadingAdminsForCurrentStreamer,
    getAdminStats,
    loadingStats,
    adminsStats
  }
})
