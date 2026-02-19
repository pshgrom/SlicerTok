import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

import {
  actionRequestAdminQuery,
  addNewCoeffQuery,
  getCoeffsListQuery,
  getLogListQuery,
  getPublicationsListMainQuery,
  removeCoeffQuery,
  setPublicationStreamerStatusQuery
} from '@/api/adminInfo'
import {
  finishCheckStreamerQuery,
  getStreamerAllStatsQuery,
  getStreamerDailyStatsQuery,
  getStreamerInfoQuery
} from '@/api/streamers.ts'
import { verifyTwoFactorQuery } from '@/api/userInfo.ts'
import type { ITableParams } from '@/interfaces/AppModel'
import { useError } from '@/stores/Errors'
import { useHeaderMain } from '@/stores/HeaderMain.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

export const useStreamer = defineStore('streamerStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 10,
    total: 0
  })
  const items = ref([])
  const isEnableGoogle2fa = ref(false)
  const coeffs = ref([])
  const allStats = ref([])
  const dailyStats = ref([])
  const headerMainStore = useHeaderMain()
  const userInfo = useUserInfo()
  const errorStore = useError()

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const setPublicationStreamerStatus = async ({
    id = '',
    status = '',
    status_comment = '',
    number_views_moderation = '',
    rules = {},
    coefficient = {}
  }) => {
    try {
      const newData = {
        id,
        status,
        ...(status_comment ? { status_comment } : {}),
        number_views_moderation: +number_views_moderation,
        ...(status !== 'approved' && { rules }),
        coefficient_id: coefficient?.id ? coefficient.id : undefined
      }
      const { data } = await setPublicationStreamerStatusQuery(newData)
      const msg = data?.message ?? ''
      errorStore.setErrors(msg, 'success')
    } catch (error: unknown) {
      throw error
    }
  }

  const getPublicationsListMain = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getPublicationsListMainQuery(data)
      items.value = resp?.data?.data ?? []
      const queryResp = resp?.data?.meta ?? {}
      const { current_page = 1, per_page = 50, total } = queryResp
      queryParams.value = {
        ...queryParams.value,
        page: current_page,
        perPage: per_page,
        total
      }
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getLogList = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getLogListQuery(data)
      items.value = resp?.data?.data ?? []
      const queryResp = resp?.data?.meta ?? {}
      const { current_page = 1, per_page = 50, total } = queryResp
      queryParams.value = {
        ...queryParams.value,
        page: current_page,
        perPage: per_page,
        total
      }
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getCoeffsList = async () => {
    try {
      isLoading.value = true
      const resp = await getCoeffsListQuery()
      coeffs.value = resp?.data?.data ?? []
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getStreamerInfo = async () => {
    try {
      const { data } = await getStreamerInfoQuery()
      isEnableGoogle2fa.value = !!data.data?.is_enable_google2fa
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const checkCode = async (code: string) => {
    try {
      const { data } = await verifyTwoFactorQuery(+code)
      const isValidCode = data.valid
      if (isValidCode) {
        errorStore.setErrors('Верный код', 'success')
        await getStreamerInfo()
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

  const getStreamerAllStats = async () => {
    try {
      isLoading.value = true
      const { data } = await getStreamerAllStatsQuery()
      allStats.value = data?.data?.statistic ?? []
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getStreamerDailyStats = async (params: ITableParams) => {
    try {
      const dataQuery: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const { data } = await getStreamerDailyStatsQuery(dataQuery)
      dailyStats.value = data?.data?.data ?? []
      const queryResp = data.data ?? {}
      const { current_page = 1, per_page = 50, total } = queryResp
      queryParams.value = {
        ...queryParams.value,
        page: current_page,
        perPage: per_page,
        total
      }
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const removeCoeff = async (id: number) => {
    try {
      return await removeCoeffQuery(id)
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const actionRequest = async (data: any) => {
    try {
      return await actionRequestAdminQuery(data)
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const finishCheckStreamer = async (id: number) => {
    try {
      return await finishCheckStreamerQuery(id)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const addNewCoeff = async (newCoeff: string) => {
    try {
      return await addNewCoeffQuery(newCoeff)
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  onMounted(async () => {
    await getStreamerInfo()
  })

  return {
    isLoading,
    getPublicationsListMain,
    items,
    queryParams,
    setQueryParams,
    getLogList,
    actionRequest,
    getCoeffsList,
    coeffs,
    removeCoeff,
    addNewCoeff,
    setPublicationStreamerStatus,
    finishCheckStreamer,
    getStreamerDailyStats,
    getStreamerAllStats,
    dailyStats,
    allStats,
    checkCode,
    isEnableGoogle2fa
  }
})
