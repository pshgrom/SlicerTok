import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { INewPublication, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import {
  createPublicationQuery,
  getInfoQuery,
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
  const unreadCount = ref(Number(localStorage.getItem('unreadCountUser') || 0))
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 20,
    total: 0
  })
  const errorStore = useError()
  const userInfoData = ref<IUserInfoData[]>([])

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const createPublication = async (value: INewPublication) => {
    try {
      const { data } = await createPublicationQuery(value)
      const msg = data?.message ?? ''
      errorStore.setErrors(msg, 'success')
      if (data.code === 200) {
        return await getPublicationsList(queryParams.value)
      }
    } catch (error: any) {
      const err = error?.response?.data?.data
      const link = err?.message?.link
      if (link) throw link
      else throw err ?? 'Error'
    }
  }

  const updateContact = async (value: any) => {
    try {
      const { data } = await updateContactQuery(value)
      const msg = data?.message ?? ''
      errorStore.setErrors(msg, 'success')
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
      const { data } = await setWalletMainQuery(id)
      const msg = data?.message ?? ''
      errorStore.setErrors(msg, 'success')
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  const removeWallet = async (id: number) => {
    try {
      const { data } = await removeWalletQuery(id)
      const msg = data?.message ?? ''
      errorStore.setErrors(msg, 'success')
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Error'
      errorStore.setErrors(msg)
    }
  }

  const updateName = async (name: string) => {
    try {
      const { data } = await updateNameQuery(name)
      const msg = data?.message ?? ''
      errorStore.setErrors(msg, 'success')
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

  watch(unreadCount, (val) => {
    localStorage.setItem('unreadCountUser', String(val))
  })

  return {
    isLoading,
    getPublicationsList,
    userInfoData,
    queryParams,
    setQueryParams,
    createPublication,
    updateContact,
    updateName,
    getInfo,
    addWallet,
    getWallets,
    setWalletMain,
    removeWallet,
    showChat,
    unreadCount
  }
})
