import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ITableParams, IUserInfo, IAdminInfoData } from '@/interfaces/AppModel'
import { actionRequestQuery, getSlicerListQuery } from '@/api/support'
import { useError } from '@/stores/Errors'

export const useSupportUsers = defineStore('supportUsersStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 10,
    total: 0
  })
  const items = ref<IAdminInfoData[]>([])
  const preloadUserInfo = ref<IUserInfo | null>(null)
  const errorStore = useError()

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const actionRequest = async (data: any) => {
    try {
      await actionRequestQuery(data)
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const getSlicerList = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getSlicerListQuery(data)
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
    getSlicerList,
    actionRequest,
    items,
    preloadUserInfo,
    queryParams,
    setQueryParams
  }
})
