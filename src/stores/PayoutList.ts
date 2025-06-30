import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getDataPayout } from '@/api/payoutList'
import { IPayoutListItems, ITableParams } from '@/interfaces/AppModel'

export const usePayoutList = defineStore('payoutListStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 50,
    total: 0
  })
  const payoutListData = ref<IPayoutListItems[]>([])

  const calcDataItems = computed<IPayoutListItems[]>(() => payoutListData.value)

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const setPayoutList = async (params: ITableParams) => {
    try {
      const data = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getDataPayout(data)
      payoutListData.value = resp?.data?.data ?? []
      const queryResp = resp?.data.meta ?? {}
      const { current_page, per_page, total } = queryResp
      queryParams.value = {
        ...queryParams.value,
        page: current_page,
        perPage: per_page,
        total
      }
      payoutListData.value = payoutListData.value?.map((el) => {
        return {
          ...el,
          viewsDialog: false
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
    setPayoutList,
    calcDataItems,
    queryParams,
    setQueryParams
  }
})
