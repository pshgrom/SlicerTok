import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getAdminFinanceInfoQuery, getPublicationListPaymentQuery } from '@/api/adminInfo'
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

  return {
    isLoading,
    getPublicationsListPayment,
    items,
    queryParams,
    setQueryParams,
    getAdminFinanceInfo,
    adminFinanceInfo
  }
})
