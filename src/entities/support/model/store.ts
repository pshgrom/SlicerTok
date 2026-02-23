import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useError, useHeaderMain } from '@/app/stores'
import { useUserInfo } from '@/entities/user'
import { verifyTwoFactorQuery } from '@/entities/user/api/api.ts'
import type { IAdminInfoData, ITableParams, IUserInfo } from '@/shared/config/types/app-model.ts'
import type { IWallet } from '@/shared/config/types/slicer.ts'

import * as supportApi from '../api/api.ts'

export const useSupport = defineStore('supportStore', () => {
  const isLoading = ref<boolean>(false)
  const currentUser = ref<Record<string, unknown>>({})
  const isEnableGoogle2fa = ref(false)
  const headerMainStore = useHeaderMain()
  const userInfoStore = useUserInfo()
  const wallets = ref<IWallet[]>([])
  const queryParams = ref<ITableParams>({ page: 1, perPage: 10, total: 0 })
  const queryParamsSlicer = ref<ITableParams>({ page: 1, perPage: 20, total: 0 })
  const supportInfo = ref<Record<string, unknown> | null>(null)
  const items = ref<IAdminInfoData[]>([])
  const slicerItems = ref<unknown[]>([])
  const preloadUserInfo = ref<IUserInfo | null>(null)
  const errorStore = useError()

  const setQueryParams = (val: Partial<ITableParams>) => {
    queryParams.value = { ...queryParams.value, ...val }
  }

  const setQueryParamsSlicer = (val: Partial<ITableParams>) => {
    queryParamsSlicer.value = { ...queryParamsSlicer.value, ...val }
  }

  const getSupportInfo = async () => {
    try {
      const { data } = await supportApi.getSupportInfoQuery()
      const res = data as Record<string, unknown>
      supportInfo.value = (res?.data as Record<string, unknown>) ?? {}
      isEnableGoogle2fa.value = !!(res?.data as Record<string, unknown>)?.is_enable_google2fa
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const checkCode = async (code: string) => {
    try {
      const { data } = await verifyTwoFactorQuery(+code)
      const isValidCode = (data as Record<string, unknown>)?.valid
      if (isValidCode) {
        errorStore.setErrors('Верный код', 'success')
        await getSupportInfo()
        headerMainStore.updateOpenModal(false)
        userInfoStore.qrCode = ''
      } else {
        errorStore.setErrors('Неверный код', 'error')
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const getPublicationList = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await supportApi.getPublicationListQuery(params)
      const res = resp.data as Record<string, unknown>
      items.value = (res?.data as IAdminInfoData[]) ?? []
      const meta = res?.meta as Record<string, unknown>
      const { current_page = 1, per_page = 50, total } = meta ?? {}
      queryParams.value = {
        ...queryParams.value,
        page: (current_page as number) ?? 1,
        perPage: (per_page as number) ?? 50,
        total: total as number
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      errorStore.setErrors(axiosError.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getSlicer = async (id: number) => {
    try {
      isLoading.value = true
      const { data } = await supportApi.getSlicerQuery(id)
      const result = (data as Record<string, unknown>)?.data ?? {}
      currentUser.value = result as Record<string, unknown>
      return result
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getSlicerPublications = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await supportApi.getInfoQuery(params)
      const res = resp.data as Record<string, unknown>
      items.value = (res?.data as IAdminInfoData[]) ?? []
      const meta = res?.meta as Record<string, unknown>
      const { current_page = 1, per_page = 50, total } = meta ?? {}
      queryParamsSlicer.value = {
        ...queryParamsSlicer.value,
        page: (current_page as number) ?? 1,
        perPage: (per_page as number) ?? 50,
        total: total as number
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getSlicerWallets = async (id: number) => {
    try {
      const { data } = await supportApi.getWalletsQuery(id)
      const res = data as Record<string, unknown>
      wallets.value = (res?.data as IWallet[]) ?? []
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const getWallets = async (id: number) => {
    try {
      isLoading.value = true
      const { data } = await supportApi.getWalletsQuery(id)
      const res = data as Record<string, unknown>
      wallets.value = (res?.data as IWallet[]) ?? []
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
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
      const { data } = await supportApi.getInfoQuery(newData)
      const res = data as Record<string, unknown>
      slicerItems.value = (res?.data as unknown[]) ?? []
      const meta = res?.meta as Record<string, unknown>
      const { current_page = 1, per_page = 20, total } = meta ?? {}
      queryParamsSlicer.value = {
        ...queryParamsSlicer.value,
        page: (current_page as number) ?? 1,
        perPage: (per_page as number) ?? 20,
        total: total as number
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const actionRequest = async (id: number) => {
    try {
      await supportApi.actionRequestQuery(id)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const changeFinalValues = async (payload: Record<string, unknown>) => {
    try {
      return await supportApi.changeFinalValuesQuery(payload)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const verifyUser = async (payload: Record<string, unknown>) => {
    try {
      return await supportApi.verifyUserQuery(payload)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  return {
    isLoading,
    getSupportInfo,
    supportInfo,
    checkCode,
    getPublicationList,
    getPublicationsList: getPublicationList,
    actionRequest,
    items,
    queryParams,
    setQueryParams,
    getSlicer,
    getSlicerPublications,
    getSlicerWallets,
    getWallets,
    getInfo,
    wallets,
    queryParamsSlicer,
    setQueryParamsSlicer,
    slicerItems,
    preloadUserInfo,
    changeFinalValues,
    verifyUser,
    isEnableGoogle2fa,
    currentUser
  }
})

export const useSupportUsers = defineStore('supportUsersStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({ page: 1, perPage: 10, total: 0 })
  const items = ref<IAdminInfoData[]>([])
  const preloadUserInfo = ref<IUserInfo | null>(null)
  const errorStore = useError()

  const setQueryParams = (val: Partial<ITableParams>) => {
    queryParams.value = { ...queryParams.value, ...val }
  }

  const actionRequest = async (data: number | Record<string, unknown>) => {
    try {
      await supportApi.actionRequestQuery(
        typeof data === 'number' ? data : (data as { id: number }).id
      )
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const getChatByUser = async (userId: string | number) => {
    try {
      const { getChatByUserQuery } = await import('@/entities/chat/api/api.ts')
      const { data } = await getChatByUserQuery(userId)
      return (data as Record<string, unknown>)?.data ?? {}
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const getSlicerList = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await supportApi.getSlicerListQuery({
        page: params.page ?? 1,
        perPage: params.perPage ?? 50
      })
      const res = resp.data as Record<string, unknown>
      items.value = (res?.data as IAdminInfoData[]) ?? []
      const meta = res?.meta as Record<string, unknown>
      const { current_page = 1, per_page = 50, total } = meta ?? {}
      queryParams.value = {
        ...queryParams.value,
        page: (current_page as number) ?? 1,
        perPage: (per_page as number) ?? 50,
        total: total as number
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
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
    setQueryParams,
    getChatByUser
  }
})
