import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useError, useHeaderMain } from '@/app/stores'
import { useAuth } from '@/entities/auth'
import type {
  INewPublication,
  ITableParams,
  IUserInfoData
} from '@/shared/config/types/app-model.ts'
import type { IUser } from '@/shared/config/types/slicer.ts'

import * as userApi from '../api/api.ts'

export const useUserInfo = defineStore('userInfoStore', () => {
  const isLoading = ref<boolean>(false)
  const showChat = ref<boolean>(false)
  const headerMainStore = useHeaderMain()
  const authStore = useAuth()
  const showRules = ref<boolean>(false)
  const user = ref<IUser>({
    name: '',
    phone: authStore.phone || '',
    email: '',
    telegram: '',
    avatar: ''
  })
  const qrCode = ref('')
  const secretKey = ref('')
  const queryParams = ref<ITableParams>({ page: 1, perPage: 20, total: 0 })
  const errorStore = useError()
  const userInfo = ref<Record<string, unknown> | null>(null)
  const userInfoData = ref<IUserInfoData[]>([])
  const isEnableGoogle2fa = ref(false)

  const updateUserInfoItem = (newItem: Record<string, unknown>) => {
    const index = userInfoData.value.findIndex(
      (item) => item.id === (newItem.id as string | number)
    )
    if (index !== -1) {
      userInfoData.value[index] = { ...userInfoData.value[index], ...newItem }
    }
  }

  const setQueryParams = (val: Partial<ITableParams>) => {
    queryParams.value = { ...queryParams.value, ...val }
  }

  const createPublication = async (value: INewPublication) => {
    try {
      const { data } = await userApi.createPublicationQuery(value)
      const msg = (data as Record<string, unknown>)?.message ?? ''
      errorStore.setErrors(String(msg), 'success')
      return data
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: { link?: string }; message?: string } }
      }
      const msg = err?.response?.data?.message
      const link = typeof msg === 'object' && msg?.link
      throw link ?? msg ?? 'Error'
    }
  }

  const resubmissionPublication = async (value: INewPublication) => {
    try {
      const { data } = await userApi.resubmissionPublicationQuery(value)
      const msg = (data as Record<string, unknown>)?.message ?? ''
      errorStore.setErrors(String(msg), 'success')
      return data
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw err?.response?.data?.message
    }
  }

  const updateContact = async (value: Record<string, unknown>) => {
    try {
      const { data } = await userApi.updateContactQuery(value)
      const msg = (data as Record<string, unknown>)?.message ?? ''
      errorStore.setErrors(String(msg), 'success')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const updateAvatar = async (base64: string) => {
    try {
      const { data } = await userApi.updateAvatarQuery(base64)
      const msg = (data as Record<string, unknown>)?.message ?? ''
      errorStore.setErrors(String(msg), 'success')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw err?.response?.data?.message ?? 'Error'
    }
  }

  const deleteAvatar = async () => {
    try {
      const { data } = await userApi.deleteAvatarQuery()
      const msg = (data as Record<string, unknown>)?.message ?? ''
      errorStore.setErrors(String(msg), 'success')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw err?.response?.data?.message ?? 'Error'
    }
  }

  const checkCode = async (code: string) => {
    try {
      const { data } = await userApi.verifyTwoFactorQuery(+code)
      const isValidCode = (data as Record<string, unknown>)?.valid
      if (isValidCode) {
        errorStore.setErrors('Верный код', 'success')
        await getInfo()
        headerMainStore.updateOpenModal(false)
        qrCode.value = ''
      } else {
        errorStore.setErrors('Неверный код', 'error')
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const enableTwoFactor = async () => {
    try {
      const { data } = await userApi.enableTwoFactorQuery()
      const res = data as Record<string, unknown>
      qrCode.value = (res?.qr_code_url as string) ?? ''
      secretKey.value = (res?.secret as string) ?? ''
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const disabledTwoFactor = async () => {
    try {
      const { data } = await userApi.disabledTwoFactorQuery()
      const msg = (data as Record<string, unknown>)?.message ?? ''
      errorStore.setErrors(String(msg), 'success')
      if (authStore.role === 'slicer') await getInfo()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const addWallet = async (data: Record<string, unknown>) => {
    try {
      return await userApi.addWalletQuery(data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw err?.response?.data?.message ?? ''
    }
  }

  const getWallets = async () => {
    try {
      return await userApi.getWalletsQuery()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const setWalletMain = async (id: number) => {
    try {
      const { data } = await userApi.setWalletMainQuery(id)
      const msg = (data as Record<string, unknown>)?.message ?? ''
      errorStore.setErrors(String(msg), 'success')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const removeWallet = async (id: number) => {
    try {
      const { data } = await userApi.removeWalletQuery(id)
      const msg = (data as Record<string, unknown>)?.message ?? ''
      errorStore.setErrors(String(msg), 'success')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const checkLinkPublication = async (url: string) => {
    try {
      const { data } = await userApi.checkLinkPublicationQuery(url)
      return data
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const getInfo = async () => {
    try {
      const { data } = await userApi.getInfoQuery()
      const res = data as Record<string, unknown>
      userInfo.value = (res?.data as Record<string, unknown>) ?? {}
      isEnableGoogle2fa.value = !!(res?.data as Record<string, unknown>)?.is_enable_google2fa
      return data
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    }
  }

  const getPublicationsList = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await userApi.getPublicationListQuery({
        page: params.page ?? 1,
        perPage: params.perPage ?? 20
      })
      const res = resp.data as Record<string, unknown>
      userInfoData.value = (res?.data as IUserInfoData[]) ?? []
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
      errorStore.setErrors(err?.response?.data?.message ?? 'Error')
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    getPublicationsList,
    userInfoData,
    userInfo,
    queryParams,
    setQueryParams,
    createPublication,
    updateContact,
    updateAvatar,
    getInfo,
    addWallet,
    getWallets,
    setWalletMain,
    removeWallet,
    checkLinkPublication,
    showChat,
    showRules,
    checkCode,
    enableTwoFactor,
    disabledTwoFactor,
    qrCode,
    secretKey,
    isEnableGoogle2fa,
    updateUserInfoItem,
    resubmissionPublication,
    user,
    deleteAvatar
  }
})
