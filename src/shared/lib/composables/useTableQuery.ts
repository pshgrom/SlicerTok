import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import type { ITableParams } from '@/shared/config/types/app-model'

export const useTableQuery = (options: {
  getQueryParams: () => ITableParams
  setQueryParams: (params: ITableParams) => void
  fetchData?: (params: ITableParams) => void
}) => {
  const router = useRouter()

  const queryParams = computed<ITableParams>({
    get: () => options.getQueryParams(),
    set: (val) => options.setQueryParams(val)
  })

  const totalPages = computed(() =>
    queryParams.value?.total && queryParams.value?.perPage
      ? Math.ceil(queryParams.value.total / queryParams.value.perPage)
      : 0
  )

  const changePage = (page: number) => {
    queryParams.value = {
      ...queryParams.value,
      page: +page
    }
    getRequest()
  }

  const getRequest = () => {
    const { page, perPage } = queryParams.value
    router.push({
      query: { page: page ?? 1, perPage }
    })
    options.fetchData(queryParams.value)
  }

  onMounted(() => {
    const { page = 1, perPage = 50 } = router.currentRoute.value.query
    queryParams.value = { page: +page, perPage: +perPage }
    getRequest()
  })

  return {
    queryParams,
    totalPages,
    changePage,
    getRequest
  }
}
