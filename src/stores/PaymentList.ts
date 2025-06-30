import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getDataWallet, getPaymentStatistic } from '@/api/paymentList'
import { ITableItems, ITableParams } from '@/interfaces/AppModel'

export const usePaymentList = defineStore('paymentListStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 50,
    total: 0
  })
  const dataWallet = ref<ITableItems[]>([])
  const graphData = ref({})

  const calcDataWallet = computed<ITableItems[]>(() => dataWallet.value)

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const setPaymentStatistic = async () => {
    try {
      const resp = await getPaymentStatistic()
      if (resp.data) {
        graphData.value = resp.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  const setDataWallet = async (params: ITableParams) => {
    try {
      const data = {
        page: params.page,
        perPage: params.perPage ?? 50,
        declared_status: params.declaredStatus ?? undefined,
        actual_status: params.actualStatus ?? undefined,
        wallet_id: params.walletId ? params.walletId : undefined,
        suspicion_status: params.suspicionStatus ? params.suspicionStatus : undefined
      }
      isLoading.value = true
      const resp = await getDataWallet(data)
      dataWallet.value = resp?.data?.data ?? []
      const queryResp = resp?.data.meta ?? {}
      const { current_page, per_page, total } = queryResp
      queryParams.value = {
        ...queryParams.value,
        page: current_page,
        perPage: per_page,
        total
      }
      dataWallet.value = dataWallet.value?.map((el) => {
        return {
          ...el,
          viewsDialog: false,
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
    setDataWallet,
    calcDataWallet,
    queryParams,
    setQueryParams,
    setPaymentStatistic,
    graphData
  }
})
