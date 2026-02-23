import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useError, useHeaderMain } from '@/app/stores'
import { useUserInfo } from '@/entities/user'
import { verifyTwoFactorQuery } from '@/entities/user/api/api.ts'
import type { IAdminInfoData, ITableParams, IUserInfo } from '@/shared/config/types/app-model.ts'

import * as adminApi from '../api/api.ts'

export const useAdminInfo = defineStore('adminInfoStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({ page: 1, perPage: 10, total: 0 })
  const coeffs = ref<Array<{ label: string | number; value: string | number }>>([])
  const adminInfoData = ref<IAdminInfoData[]>([])
  const headerMainStore = useHeaderMain()
  const userInfoStore = useUserInfo()
  const adminInfoDataChecked = ref<IAdminInfoData[]>([])
  const preloadUserInfo = ref<IUserInfo | null>(null)
  const adminProfileData = ref<Record<string, unknown> | null>(null)
  const errorStore = useError()
  const isEnableGoogle2fa = ref(false)

  const setQueryParams = (val: Partial<ITableParams>) => {
    queryParams.value = { ...queryParams.value, ...val }
  }

  const setPublicationStatus = async (payload: Record<string, unknown>) => {
    try {
      const { data } = await adminApi.setPublicationStatusQuery(payload)
      const msg = (data as Record<string, unknown>)?.message ?? ''
      errorStore.setErrors(String(msg), 'success')
    } catch (error: unknown) {
      throw error
    }
  }

  const finishCheck = async (id: number) => {
    try {
      return await adminApi.finishCheckQuery(id)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const getCoefficient = async () => {
    try {
      const { data } = await adminApi.getCoefficientQuery()
      const raw = ((data as Record<string, unknown>)?.data ?? []) as Array<{
        id: string | number
        rate: string | number
      }>
      coeffs.value = raw.map(({ id, rate }) => ({ label: rate, value: id }))
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const requestVerification = async (id: number) => {
    try {
      return await adminApi.requestVerificationQuery(id)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const getAdminInfo = async () => {
    try {
      const { data } = await adminApi.getAdminInfoQuery()
      const res = data as Record<string, unknown>
      adminProfileData.value = (res?.data as Record<string, unknown>) ?? {}
      isEnableGoogle2fa.value = !!(res?.data as Record<string, unknown>)?.is_enable_google2fa
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const checkCode = async (code: string) => {
    try {
      const { data } = await verifyTwoFactorQuery(+code)
      const isValidCode = (data as Record<string, unknown>)?.valid
      if (isValidCode) {
        errorStore.setErrors('Верный код', 'success')
        await getAdminInfo()
        headerMainStore.updateOpenModal(false)
        userInfoStore.qrCode = ''
      } else {
        errorStore.setErrors('Неверный код', 'error')
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const saveMark = async (markData: Record<string, unknown>) => {
    try {
      return await adminApi.saveMarkQuery(markData)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const getPublicationsList = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await adminApi.getPublicationListQuery({
        ...params,
        page: params.page ?? 1,
        total: undefined
      })
      const res = resp.data as Record<string, unknown>
      adminInfoData.value = (res?.data as IAdminInfoData[]) ?? []
      const meta = res?.meta as Record<string, unknown>
      const { current_page = 1, per_page = 50, total } = meta ?? {}
      queryParams.value = {
        ...queryParams.value,
        page: (current_page as number) ?? 1,
        perPage: (per_page as number) ?? 50,
        total: total as number
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getCompletedList = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await adminApi.getCompletedListQuery({
        page: params.page,
        perPage: params.perPage ?? 50
      })
      const res = resp.data as Record<string, unknown>
      adminInfoDataChecked.value = (res?.data as IAdminInfoData[]) ?? []
      const meta = res?.meta as Record<string, unknown>
      const { current_page = 1, per_page = 50, total } = meta ?? {}
      queryParams.value = {
        ...queryParams.value,
        page: (current_page as number) ?? 1,
        perPage: (per_page as number) ?? 50,
        total: total as number
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    getPublicationsList,
    setPublicationStatus,
    adminInfoData,
    preloadUserInfo,
    queryParams,
    setQueryParams,
    finishCheck,
    getCompletedList,
    saveMark,
    requestVerification,
    getCoefficient,
    coeffs,
    getAdminInfo,
    adminProfileData,
    adminInfoDataChecked,
    isEnableGoogle2fa,
    checkCode
  }
})

export const useAdminMain = defineStore('adminMainStore', () => {
  const errorStore = useError()
  const streamers = ref<unknown[]>([])
  const headerMainStore = useHeaderMain()
  const userInfoStore = useUserInfo()
  const isEnableGoogle2fa = ref(false)
  const adminsForCurrentStreamer = ref<unknown[]>([])
  const adminsStats = ref<unknown[]>([])
  const loadingAdminsForCurrentStreamer = ref(false)
  const loadingStats = ref(false)
  const queryParamsStats = ref<ITableParams>({ page: 1, perPage: 10, total: 0 })

  const setQueryParams = (val: Partial<ITableParams>) => {
    queryParamsStats.value = { ...queryParamsStats.value, ...val }
  }

  const getAdminMainInfo = async () => {
    try {
      const { data } = await adminApi.getAdminMainInfoQuery()
      const res = data as Record<string, unknown>
      streamers.value = (res?.data as unknown[]) ?? []
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const getAdminsForCurrentStreamer = async (id: string) => {
    try {
      loadingAdminsForCurrentStreamer.value = true
      const { data } = await adminApi.getAdminsForCurrentStreamerQuery({
        streamer_id: id
      })
      const res = data as Record<string, unknown>
      adminsForCurrentStreamer.value = (res?.data as Record<string, unknown>)?.admin_list ?? []
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    } finally {
      loadingAdminsForCurrentStreamer.value = false
    }
  }

  const getMainAdminInfo = async () => {
    try {
      const { data } = await adminApi.getMainAdminInfoQuery()
      const res = data as Record<string, unknown>
      isEnableGoogle2fa.value = !!(res?.data as Record<string, unknown>)?.is_enable_google2fa
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const checkCode = async (code: string) => {
    try {
      const { data } = await verifyTwoFactorQuery(+code)
      const isValidCode = (data as Record<string, unknown>)?.valid
      if (isValidCode) {
        errorStore.setErrors('Верный код', 'success')
        await getMainAdminInfo()
        headerMainStore.updateOpenModal(false)
        userInfoStore.qrCode = ''
      } else {
        errorStore.setErrors('Неверный код', 'error')
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const getAdminStats = async (params: ITableParams, adminId: string) => {
    try {
      loadingStats.value = true
      const query = {
        page: params.page ?? 1,
        perPage: params.perPage ?? 50
      }
      const { data } = await adminApi.getAdminStatsQuery(query, adminId)
      const res = data as Record<string, unknown>
      const payload = res?.data as Record<string, unknown> | undefined
      adminsStats.value = (payload?.data as unknown[]) ?? []
      const current_page = (payload?.current_page as number) ?? 1
      const per_page = (payload?.per_page as number) ?? 50
      const total = (payload?.total as number) ?? 0
      queryParamsStats.value = {
        ...queryParamsStats.value,
        page: current_page,
        perPage: per_page,
        total
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    } finally {
      loadingStats.value = false
    }
  }

  return {
    streamers,
    getAdminMainInfo,
    getAdminsForCurrentStreamer,
    adminsForCurrentStreamer,
    loadingAdminsForCurrentStreamer,
    getMainAdminInfo,
    checkCode,
    getAdminStats,
    adminsStats,
    loadingStats,
    queryParamsStats,
    setQueryParams,
    isEnableGoogle2fa
  }
})
