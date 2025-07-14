import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ITableParams, IUserInfo, IAdminInfoData } from '@/interfaces/AppModel'
import {
  finishCheckQuery,
  getCompletedListQuery,
  getPublicationListQuery,
  getTaskQuery,
  setPublicationStatusQuery
} from '@/api/adminInfo'
import { useError } from '@/stores/Errors'

export const useAdminInfo = defineStore('adminInfoStore', () => {
  const isLoading = ref<boolean>(false)
  const queryParams = ref<ITableParams>({
    page: 1,
    perPage: 10,
    total: 0
  })
  const tasks = ref([])
  const selectedTasks = ref<Record<string, boolean>>({})
  const adminInfoData = ref<IAdminInfoData[]>([])
  const preloadUserInfo = ref<IUserInfo | null>(null)
  const errorStore = useError()

  const setQueryParams = (val: ITableParams) => {
    queryParams.value = {
      ...queryParams.value,
      ...val
    }
  }

  const setPublicationStatus = async ({
    id = '',
    status = '',
    status_comment = '',
    rules = {}
  }) => {
    try {
      const data = {
        id,
        status,
        ...(status_comment ? { status_comment } : {}),
        rules
      }
      await setPublicationStatusQuery(data)
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const finishCheck = async (id: number) => {
    try {
      return await finishCheckQuery(id)
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
    }
  }

  const getTask = async () => {
    try {
      const { data } = await getTaskQuery()
      const { status, data: tasksArr } = data
      if (status === 'Success') {
        tasks.value = tasksArr[0].rules
        const newTasks = tasks.value.map((item) => item.key)
        selectedTasks.value = Object.fromEntries([...new Set(newTasks)].map((key) => [key, false]))
      }
    } catch (error: any) {
      errorStore.setErrors(error.response?.data?.message ?? '')
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
      adminInfoData.value = resp?.data?.data ?? []
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

  const getCompletedList = async (params: ITableParams) => {
    try {
      const data: ITableParams = {
        page: params.page,
        perPage: params.perPage ?? 50
      }
      isLoading.value = true
      const resp = await getCompletedListQuery(data)
      adminInfoData.value = resp?.data?.data ?? []
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
    setPublicationStatus,
    adminInfoData,
    preloadUserInfo,
    queryParams,
    setQueryParams,
    finishCheck,
    getCompletedList,
    getTask,
    tasks,
    selectedTasks
  }
})
