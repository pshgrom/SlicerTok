import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  cancelTransferQuery,
  getAdminFinanceInfoQuery,
  getFinishedListQuery,
  getPublicationListPaymentQuery,
  getTransferListQuery,
  setTransferQuery,
  transferFinishedQuery
} from '@/api/adminInfo'
import type { ITableParams } from '@/interfaces/AppModel'
import { useError } from '@/stores/Errors'

export const useAdminPaymentsFinance = defineStore('adminPaymentsFinanceStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 10,
    total: 0
  })
  const items = ref([])
  const errorStore = useError()
  const adminFinanceInfo = ref(null)

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
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const setMakeTransfer = async (data) => {
    try {
      const newData = {
        publication_ids: [...data]
      }
      return await setTransferQuery({ ...newData })
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const cancelTransfer = async (data) => {
    try {
      const newData = {
        transfer_ids: [...data]
      }
      return await cancelTransferQuery({ ...newData })
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const transferFinished = async (data) => {
    try {
      const newData = {
        transfer_id: data.id,
        ...data
      }
      return await transferFinishedQuery({ ...newData })
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.data ?? '')
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
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
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
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
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
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
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
    transferFinished
  }
})
