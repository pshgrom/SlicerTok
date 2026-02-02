import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  cancelTransferQuery,
  getAdminFinanceInfoQuery,
  getFinishedListQuery,
  getPublicationListPaymentQuery,
  getTransferListExelQuery,
  getTransferListQuery,
  importFileQuery,
  setTransferQuery,
  transferFinishedQuery
} from '@/api/adminInfo'
import { verifyTwoFactorQuery } from '@/api/userInfo.ts'
import type { ITableParams } from '@/interfaces/AppModel'
import { useError } from '@/stores/Errors'
import { useHeaderMain } from '@/stores/HeaderMain.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

export const useAdminPaymentsFinance = defineStore('adminPaymentsFinanceStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 10,
    total: 0
  })
  const items = ref<Array<Record<string, unknown>>>([])
  const errorStore = useError()
  const headerMainStore = useHeaderMain()
  const userInfo = useUserInfo()
  const isEnableGoogle2fa = ref(false)
  const adminFinanceInfo = ref<Record<string, unknown> | null>(null)

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const getAdminFinanceInfo = async () => {
    try {
      const { data } = await getAdminFinanceInfoQuery()
      adminFinanceInfo.value = data?.data ?? {}
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
        await getAdminFinanceInfo()
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

  const setMakeTransfer = async (data: Array<string | number>) => {
    try {
      const newData = {
        publication_ids: [...data]
      }
      return await setTransferQuery({ ...newData })
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const cancelTransfer = async (data: Array<string | number>) => {
    try {
      const newData = {
        transfer_ids: [...data]
      }
      return await cancelTransferQuery({ ...newData })
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const importFile = async (formData: FormData) => {
    try {
      return await importFileQuery(formData)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const getTransferListExel = async (data: Array<string | number>) => {
    try {
      const newData = {
        transfer_ids: [...data]
      }
      return await getTransferListExelQuery({ ...newData })
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    }
  }

  const transferFinished = async (data: Record<string, unknown> & { id: number | string }) => {
    try {
      const newData = {
        transfer_id: data.id,
        ...data
      }
      return await transferFinishedQuery({ ...newData })
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ data?: string; message?: string }>
      errorStore.setErrors(
        axiosError.response?.data?.message ?? axiosError.response?.data?.data ?? ''
      )
    }
  }

  const getPublicationsListPayment = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getPublicationListPaymentQuery(data)
      items.value = resp?.data?.data ?? []
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

  const getTransferList = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getTransferListQuery(data)
      items.value = resp?.data?.data ?? []
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

  const getFinishedList = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getFinishedListQuery(data)
      items.value = resp?.data?.data ?? []
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
    getPublicationsListPayment,
    items,
    queryParams,
    setQueryParams,
    getAdminFinanceInfo,
    adminFinanceInfo,
    getTransferList,
    setMakeTransfer,
    cancelTransfer,
    getFinishedList,
    transferFinished,
    getTransferListExel,
    importFile,
    isEnableGoogle2fa,
    checkCode
  }
})
