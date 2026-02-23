import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useError, useHeaderMain } from '@/app/stores'
import * as adminApi from '@/entities/admin/api/api.ts'
import { useAuth } from '@/entities/auth'
import { useUserInfo } from '@/entities/user'
import { verifyTwoFactorQuery } from '@/entities/user/api/api.ts'
import { ROLES } from '@/shared/config'
import type { ITableParams } from '@/shared/config/types/app-model.ts'

import * as streamerApi from '../api/api.ts'

export const useStreamers = defineStore('streamersStore', () => {
  const authStore = useAuth()
  const streamerList = ref<Array<{ label: string; value: string; key?: string }>>([])
  const streamer = ref<number | string | null>(
    authStore.role === ROLES.SLICER ? localStorage.getItem('streamerChat') || null : null
  )
  const streamerRules = ref<number | string | null>(
    authStore.role === ROLES.SLICER ? localStorage.getItem('streamerRules') || null : null
  )
  const streamersLoaded = ref(false)

  const getStreamerList = async () => {
    try {
      const { data } = await streamerApi.streamerListQuery()
      const res = data as Record<string, unknown>
      if (res?.code === 200) {
        const list = (res?.data as Array<Record<string, unknown>>) ?? []
        streamerList.value = list.map((el) => {
          const { id, name, key } = el ?? {}
          return {
            label: (name as string) ?? '',
            value: String(id ?? ''),
            key: key as string
          }
        })
        streamersLoaded.value = true
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw err?.response?.data?.message ?? ''
    }
  }

  const setStreamer = (value: number | string | null) => {
    const normalized = value != null ? String(value) : null
    streamer.value = normalized
    if (authStore.role === ROLES.SLICER) {
      localStorage.setItem('streamerChat', normalized ?? '')
    }
  }

  const setStreamerRules = (value: number | string) => {
    streamerRules.value = value
    if (authStore.role === ROLES.SLICER) {
      localStorage.setItem('streamerRules', String(value))
    }
  }

  return {
    getStreamerList,
    streamersLoaded,
    streamerList,
    setStreamer,
    streamer,
    setStreamerRules,
    streamerRules
  }
})

export const useStreamer = defineStore('streamerStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({ page: 1, perPage: 10, total: 0 })
  const items = ref<unknown[]>([])
  const isEnableGoogle2fa = ref(false)
  const coeffs = ref<unknown[]>([])
  const allStats = ref<Record<string, unknown>>({})
  const dailyStats = ref<unknown[]>([])
  const headerMainStore = useHeaderMain()
  const userInfoStore = useUserInfo()
  const errorStore = useError()

  const setQueryParams = (val: Partial<ITableParams>) => {
    queryParams.value = { ...queryParams.value, ...val }
  }

  const setPublicationStreamerStatus = async (payload: Record<string, unknown>) => {
    try {
      const { data } = await adminApi.setPublicationStreamerStatusQuery(payload)
      const msg = (data as Record<string, unknown>)?.message ?? ''
      errorStore.setErrors(String(msg), 'success')
    } catch (error: unknown) {
      throw error
    }
  }

  const getPublicationsListMain = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await adminApi.getPublicationsListMainQuery({
        page: params.page ?? 1,
        perPage: params.perPage ?? 50
      })
      const res = resp.data as Record<string, unknown>
      items.value = (res?.data as unknown[]) ?? []
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

  const finishCheckStreamer = async (id: number) => {
    try {
      return await streamerApi.finishCheckStreamerQuery(id)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const getLogList = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const resp = await adminApi.getLogListQuery({
        page: params.page ?? 1,
        perPage: params.perPage ?? 50
      })
      const res = resp.data as Record<string, unknown>
      items.value = (res?.data as unknown[]) ?? []
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

  const getCoeffsList = async () => {
    try {
      const { data } = await adminApi.getCoeffsListQuery()
      const res = data as Record<string, unknown>
      coeffs.value = (res?.data as unknown[]) ?? []
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const addNewCoeff = async (value: string) => {
    try {
      return await adminApi.addNewCoeffQuery(value)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const removeCoeff = async (id: number) => {
    try {
      return await adminApi.removeCoeffQuery(id)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    }
  }

  const getStreamerDailyStats = async (params: ITableParams) => {
    try {
      isLoading.value = true
      const dataQuery: ITableParams = {
        ...queryParams.value,
        page: params.page ?? 1,
        perPage: params.perPage ?? 50
      }
      const { data } = await streamerApi.getStreamerDailyStatsQuery(dataQuery)
      const res = data as Record<string, unknown>
      const payload = res?.data as Record<string, unknown>
      dailyStats.value = (payload?.data as unknown[]) ?? []
      const current_page = (payload?.current_page as number) ?? 1
      const per_page = (payload?.per_page as number) ?? 50
      const total = (payload?.total as number) ?? 0
      queryParams.value = {
        ...queryParams.value,
        page: current_page,
        perPage: per_page,
        total
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const getStreamerAllStats = async () => {
    try {
      isLoading.value = true
      const { data } = await streamerApi.getStreamerAllStatsQuery()
      const res = data as Record<string, unknown>
      const payload = res?.data as Record<string, unknown> | undefined
      const statistic = payload?.statistic ?? payload
      allStats.value = (
        statistic && typeof statistic === 'object' && !Array.isArray(statistic) ? statistic : {}
      ) as Record<string, unknown>
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      errorStore.setErrors(err?.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const checkCode = async (code: string) => {
    try {
      const { data } = await verifyTwoFactorQuery(+code)
      const isValidCode = (data as Record<string, unknown>)?.valid
      if (isValidCode) {
        errorStore.setErrors('Верный код', 'success')
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

  return {
    isLoading,
    queryParams,
    setQueryParams,
    items,
    getPublicationsListMain,
    setPublicationStreamerStatus,
    finishCheckStreamer,
    getLogList,
    getCoeffsList,
    coeffs,
    addNewCoeff,
    removeCoeff,
    getStreamerDailyStats,
    getStreamerAllStats,
    dailyStats,
    allStats,
    isEnableGoogle2fa,
    checkCode
  }
})
