import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  actionRequestAdminQuery,
  addNewCoeffQuery,
  getCoeffsListQuery,
  getLogListQuery,
  getPublicationsListMainQuery,
  removeCoeffQuery
} from '@/api/adminInfo'
import type { ITableParams } from '@/interfaces/AppModel'
import { useError } from '@/stores/Errors'

export const useAdminMain = defineStore('adminMainStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 10,
    total: 0
  })
  const items = ref([])
  const coeffs = ref([])
  const errorStore = useError()

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const getPublicationsListMain = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getPublicationsListMainQuery(data)
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

  const getLogList = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getLogListQuery(data)
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

  const getCoeffsList = async () => {
    try {
      isLoading.value = true
      const resp = await getCoeffsListQuery()
      coeffs.value = resp?.data?.data ?? []
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    } finally {
      isLoading.value = false
    }
  }

  const removeCoeff = async (id: number) => {
    try {
      return await removeCoeffQuery(id)
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const actionRequest = async (data: any) => {
    try {
      return await actionRequestAdminQuery(data)
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const addNewCoeff = async (newCoeff: string) => {
    try {
      return await addNewCoeffQuery(newCoeff)
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  return {
    isLoading,
    getPublicationsListMain,
    items,
    queryParams,
    setQueryParams,
    getLogList,
    actionRequest,
    getCoeffsList,
    coeffs,
    removeCoeff,
    addNewCoeff
  }
})
