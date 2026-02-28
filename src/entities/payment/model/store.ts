import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useError, useHeaderMain } from '@/app/stores'
import { useUserInfo } from '@/entities/user'
import { verifyTwoFactorQuery } from '@/entities/user/api/api.ts'
import type { ITableParams } from '@/shared/config/types/app-model.ts'
import { handleApiError } from '@/shared/lib'

import * as paymentApi from '../api/api.ts'

export const useAdminPaymentsFinance = defineStore('adminPaymentsFinanceStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({ page: 1, perPage: 10, total: 0 })
  const items = ref<Array<Record<string, unknown>>>([])
  const errorStore = useError()
  const headerMainStore = useHeaderMain()
  const userInfoStore = useUserInfo()
  const isEnableGoogle2fa = ref(false)
  const adminFinanceInfo = ref<Record<string, unknown> | null>(null)

  const setQueryParams = (val: Partial<ITableParams>) => {
    queryParams.value = { ...queryParams.value, ...val }
  }

  const getAdminFinanceInfo = async () => {
    try {
      const { data } = await paymentApi.getAdminFinanceInfoQuery()
      const res = data as Record<string, unknown>
      adminFinanceInfo.value = (res?.data as Record<string, unknown>) ?? {}
      isEnableGoogle2fa.value = !!(res?.data as Record<string, unknown>)?.is_enable_google2fa
    } catch (error: unknown) {
      errorStore.setErrors(handleApiError(error))
    }
  }

  const checkCode = async (code: string) => {
    try {
      const { data } = await verifyTwoFactorQuery(+code)
      const isValidCode = (data as Record<string, unknown>)?.valid
      if (isValidCode) {
        errorStore.setErrors('Верный код', 'success')
        await getAdminFinanceInfo()
        headerMainStore.updateOpenModal(false)
        userInfoStore.qrCode = ''
      } else {
        errorStore.setErrors('Неверный код', 'error')
      }
    } catch (error: unknown) {
      errorStore.setErrors(handleApiError(error))
    }
  }

  const getPublicationListPayment = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await paymentApi.getPublicationListPaymentQuery(params)
      const res = resp.data as Record<string, unknown>
      items.value = (res?.data as Array<Record<string, unknown>>) ?? []
      const meta = res?.meta as Record<string, unknown>
      const { current_page = 1, per_page = 50, total } = meta ?? {}
      queryParams.value = {
        ...queryParams.value,
        page: (current_page as number) ?? 1,
        perPage: (per_page as number) ?? 50,
        total: total as number
      }
    } catch (error: unknown) {
      errorStore.setErrors(handleApiError(error))
    } finally {
      isLoading.value = false
    }
  }

  const getTransferList = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await paymentApi.getTransferListQuery(params)
      const res = resp.data as Record<string, unknown>
      items.value = (res?.data as Array<Record<string, unknown>>) ?? []
      const meta = res?.meta as Record<string, unknown>
      const { current_page = 1, per_page = 50, total } = meta ?? {}
      queryParams.value = {
        ...queryParams.value,
        page: (current_page as number) ?? 1,
        perPage: (per_page as number) ?? 50,
        total: total as number
      }
    } catch (error: unknown) {
      errorStore.setErrors(handleApiError(error))
    } finally {
      isLoading.value = false
    }
  }

  const getFinishedList = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await paymentApi.getFinishedListQuery(params)
      const res = resp.data as Record<string, unknown>
      items.value = (res?.data as Array<Record<string, unknown>>) ?? []
      const meta = res?.meta as Record<string, unknown>
      const { current_page = 1, per_page = 50, total } = meta ?? {}
      queryParams.value = {
        ...queryParams.value,
        page: (current_page as number) ?? 1,
        perPage: (per_page as number) ?? 50,
        total: total as number
      }
    } catch (error: unknown) {
      errorStore.setErrors(handleApiError(error))
    } finally {
      isLoading.value = false
    }
  }

  const setMakeTransfer = async (data: Array<string | number>) => {
    try {
      return await paymentApi.setTransferQuery({
        publication_ids: [...data]
      })
    } catch (error: unknown) {
      errorStore.setErrors(handleApiError(error))
    }
  }

  const cancelTransfer = async (data: Array<string | number>) => {
    try {
      return await paymentApi.cancelTransferQuery({
        transfer_ids: [...data]
      })
    } catch (error: unknown) {
      errorStore.setErrors(handleApiError(error))
    }
  }

  const transferFinished = async (data: Record<string, unknown>) => {
    try {
      return await paymentApi.transferFinishedQuery(data)
    } catch (error: unknown) {
      errorStore.setErrors(handleApiError(error))
    }
  }

  const importFile = async (formData: FormData) => {
    try {
      return await paymentApi.importFileQuery(formData)
    } catch (error: unknown) {
      errorStore.setErrors(handleApiError(error))
    }
  }

  return {
    isLoading,
    queryParams,
    setQueryParams,
    items,
    getAdminFinanceInfo,
    adminFinanceInfo,
    checkCode,
    getPublicationListPayment,
    getTransferList,
    getFinishedList,
    setMakeTransfer,
    cancelTransfer,
    transferFinished,
    importFile,
    isEnableGoogle2fa
  }
})
