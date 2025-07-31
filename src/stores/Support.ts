import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ITableParams, IUserInfo, IAdminInfoData } from '@/interfaces/AppModel'
import {
  actionRequestQuery,
  getPublicationListQuery,
  getSlicerQuery,
  verifyUserQuery
} from '@/api/support'
import { useError } from '@/stores/Errors'
// import type { ISupportSaveStatus } from '@/interfaces/ISupport'

export const useSupport = defineStore('supportStore', () => {
  const isLoading = ref<boolean>(false)
  const currentUser = ref({})
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

  const getSlicer = async (id: number) => {
    try {
      isLoading.value = true
      const { data } = await getSlicerQuery(id)
      currentUser.value = data?.data ?? {}
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const verifyUser = async (newData) => {
    try {
      isLoading.value = true
      const { data } = await verifyUserQuery(newData)
      const msg = data?.message ?? ''
      errorStore.setErrors(msg, 'success')
      return true
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getPublicationsList = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getPublicationListQuery(data)
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
    getPublicationsList,
    actionRequest,
    items,
    preloadUserInfo,
    queryParams,
    setQueryParams,
    getSlicer,
    currentUser,
    verifyUser
  }
})
