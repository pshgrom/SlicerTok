import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { INewPublication, ITableParams, IUserInfo, IUserInfoData } from '@/interfaces/AppModel'
import {
  createPublicationQuery,
  getInfoQuery,
  getPrecreatePublicationQuery,
  getPublicationListQuery,
  updateContactQuery,
  updateNameQuery,
  addWalletQuery,
  getWalletsQuery,
  setWalletMainQuery,
  removeWalletQuery
} from '@/api/userInfo'
import { useError } from '@/stores/Errors'

export const useUserInfo = defineStore('userInfoStore', () => {
  const isLoading = ref<boolean>(false)
  const showChat = ref<boolean>(false)
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 20,
    total: 0
  })
  const errorStore = useError()
  const userInfoData = ref<IUserInfoData[]>([])
  const preloadUserInfo = ref<IUserInfo | null>(null)

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const getPrecreatePublication = async () => {
    try {
      const { data } = await getPrecreatePublicationQuery()
      if (data?.code === 200) {
        preloadUserInfo.value = data?.data ?? {}
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  const createPublication = async (value: INewPublication) => {
    try {
      const { data } = await createPublicationQuery(value)
      if (data.code === 200) {
        return await getPublicationsList(queryParams.value)
      }
    } catch (error: any) {
      throw error?.response?.data?.data ?? 'Error'
    }
  }

  const updateContact = async (value: any) => {
    try {
      await updateContactQuery(value)
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  const addWallet = async (data: any) => {
    try {
      return await addWalletQuery(data)
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  const getWallets = async () => {
    try {
      return await getWalletsQuery()
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  const setWalletMain = async (id: number) => {
    try {
      await setWalletMainQuery(id)
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  const removeWallet = async (id: number) => {
    try {
      await removeWalletQuery(id)
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  const updateName = async (name: string) => {
    try {
      await updateNameQuery(name)
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  const getInfo = async () => {
    try {
      const { data } = await getInfoQuery()
      return data
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  const getPublicationsList = async (params: ITableParams) => {
    try {
      const data = {
        page: params.page,
        perPage: params.perPage ?? 20
      }
      isLoading.value = true
      const resp = await getPublicationListQuery(data)
      userInfoData.value = resp?.data?.data ?? []
      const queryResp = resp?.data?.meta ?? {}
      const { current_page = 1, per_page = 50, total } = queryResp
      queryParams.value = {
        ...queryParams.value,
        page: current_page,
        perPage: per_page,
        total
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    getPublicationsList,
    userInfoData,
    preloadUserInfo,
    queryParams,
    setQueryParams,
    getPrecreatePublication,
    createPublication,
    updateContact,
    updateName,
    getInfo,
    addWallet,
    getWallets,
    setWalletMain,
    removeWallet,
    showChat
  }
})
