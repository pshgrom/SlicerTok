import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  actionRequestQuery,
  getInfoQuery,
  getPublicationListQuery,
  getSlicerQuery,
  getWalletsQuery,
  verifyUserQuery
} from '@/api/support'
import type { IAdminInfoData, ITableParams, IUserInfo } from '@/interfaces/AppModel'
import type { IWallet } from '@/interfaces/Slicer.ts'
import { useError } from '@/stores/Errors'
// import type { ISupportSaveStatus } from '@/interfaces/ISupport'

export const useSupport = defineStore('supportStore', () => {
  const isLoading = ref<boolean>(false)
  const currentUser = ref({})
  const wallets = ref<IWallet[]>([])
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 10,
    total: 0
  })
  const queryParamsSlicer = ref<ITableParams>({
    page: 1,
    perPage: 10,
    total: 0
  })
  const items = ref<IAdminInfoData[]>([])
  const slicerItems = ref([])
  const preloadUserInfo = ref<IUserInfo | null>(null)
  const errorStore = useError()

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const setQueryParamsSlicer = (val: ITableParams) => {
    queryParamsSlicer.value = {
      ...queryParamsSlicer.value,
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

  const getWallets = async (id: number) => {
    try {
      isLoading.value = true
      const { data } = await getWalletsQuery(id)
      wallets.value = data?.data ?? {}
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getInfo = async (id: number) => {
    try {
      const newData = {
        ...queryParamsSlicer.value,
        id,
        total: undefined
      }
      isLoading.value = true
      const { data } = await getInfoQuery(newData)
      slicerItems.value = data?.data ?? {}
      const queryResp = data?.meta ?? {}
      const { current_page = 1, per_page = 50, total } = queryResp
      queryParamsSlicer.value = {
        ...queryParamsSlicer.value,
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
    verifyUser,
    getWallets,
    wallets,
    getInfo,
    slicerItems,
    queryParamsSlicer,
    setQueryParamsSlicer
  }
})
