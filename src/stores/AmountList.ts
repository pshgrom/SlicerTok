import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { getDataAmountList, getReceivedStatistic } from '@/api/amountList'
import type { IAmountListItems, IAmountListParams } from '@/interfaces/AppModel'

export const useAmountList = defineStore('amountListStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<IAmountListParams>({
    page: 1,
    perPage: 50,
    total: 0
  })
  const dataAmountList = ref<IAmountListItems[]>([])
  const graphData = ref({})

  const calcDataAmountList = computed<IAmountListItems[]>(() => dataAmountList.value)

  const setQueryParams = (val: IAmountListParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const setReceivedStatistic = async () => {
    try {
      const resp = await getReceivedStatistic()
      if (resp.data) {
        graphData.value = resp.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  const setDataAmountList = async (params: IAmountListParams, sort: any) => {
    try {
      const data = {
        page: params.page,
        perPage: params.perPage ?? 50,
        status: params.status ?? undefined,
        wallet_id: params.walletId ? params.walletId : undefined,
        ...sort
      }
      isLoading.value = true
      const resp = await getDataAmountList(data)
      dataAmountList.value = resp?.data?.data ?? []
      const queryResp = resp?.data.meta ?? {}
      const { current_page, per_page, total } = queryResp
      queryParams.value = {
        ...queryParams.value,
        page: current_page,
        perPage: per_page,
        total
      }
      dataAmountList.value = dataAmountList.value?.map((el) => {
        return {
          ...el,
          showWallet: false
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    setDataAmountList,
    calcDataAmountList,
    queryParams,
    setQueryParams,
    setReceivedStatistic,
    graphData
  }
})
