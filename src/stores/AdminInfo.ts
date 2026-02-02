import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  finishCheckQuery,
  getAdminInfoQuery,
  getCoefficientQuery,
  getCompletedListQuery,
  getPublicationListQuery,
  requestVerificationQuery,
  saveMarkQuery,
  setPublicationStatusQuery
} from '@/api/adminInfo'
import { verifyTwoFactorQuery } from '@/api/userInfo.ts'
import type { IAdminInfoData, ITableParams, IUserInfo } from '@/interfaces/AppModel'
import { useError } from '@/stores/Errors'
import { useHeaderMain } from '@/stores/HeaderMain.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

export const useAdminInfo = defineStore('adminInfoStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 10,
    total: 0
  })
  type CoefficientOption = { label: string | number; value: string | number }
  const coeffs = ref<CoefficientOption[]>([])
  const adminInfoData = ref<IAdminInfoData[]>([])
  const headerMainStore = useHeaderMain()
  const userInfo = useUserInfo()
  const adminInfoDataChecked = ref<IAdminInfoData[]>([])
  const preloadUserInfo = ref<IUserInfo | null>(null)
  const adminProfileData = ref<Record<string, unknown> | null>(null)
  const errorStore = useError()
  const isEnableGoogle2fa = ref(false)

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const setPublicationStatus = async ({
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
      const { data } = await setPublicationStatusQuery(newData)
      const msg = data?.message ?? ''
      errorStore.setErrors(msg, 'success')
    } catch (error: unknown) {
      throw error
    }
  }

  const finishCheck = async (id: number) => {
    try {
      return await finishCheckQuery(id)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const getCoefficient = async () => {
    try {
      const { data } = await getCoefficientQuery()
      const raw = (data?.data ?? []) as Array<{ id: string | number; rate: string | number }>
      coeffs.value = raw.map(({ id, rate }) => ({ label: rate, value: id }))
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const requestVerification = async (id: number) => {
    try {
      return await requestVerificationQuery(id)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const getAdminInfo = async () => {
    try {
      const { data } = await getAdminInfoQuery()
      adminProfileData.value = (data?.data as Record<string, unknown>) ?? {}
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
        await getAdminInfo()
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

  type SaveMark = { id: number; mark?: string | number } & Record<string, unknown>
  const saveMark = async (markData: SaveMark) => {
    try {
      return await saveMarkQuery(markData)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const getPublicationsList = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        ...params,
        page: params.page ?? 1,
        total: undefined
      }
      isLoading.value = true
      const resp = await getPublicationListQuery(data)
      adminInfoData.value = resp?.data?.data ?? []
      const queryResp = resp?.data?.meta ?? {}
      const { current_page = 1, per_page = 50, total } = queryResp
      queryParams.value = {
        ...queryParams.value,
        page: current_page,
        perPage: per_page,
        total
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
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getCompletedListQuery(data)
      adminInfoDataChecked.value = resp?.data?.data ?? []
      const queryResp = resp?.data?.meta ?? {}
      const { current_page = 1, per_page = 50, total } = queryResp
      queryParams.value = {
        ...queryParams.value,
        page: current_page,
        perPage: per_page,
        total
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
