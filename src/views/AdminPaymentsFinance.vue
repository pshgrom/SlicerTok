<template>
  <TableAdminPaymentsFinance
    class="custom-table"
    :headers="headers"
    :is-loading="isLoading"
    :items="calcDataItems"
    :items-per-page="queryParams.perPage"
  />
  <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
    <TablePagination
      v-model:query-params="queryParams"
      :loading="isLoading"
      :total-pages="totalPages"
      @change-page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import TableAdminPaymentsFinance from '@/components/tables/TableAdminPaymentsFinance.vue'
import TablePagination from '@/components/tables/TablePagination.vue'
import { adminPaymentsFinance } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { useAdminPaymentsFinance } from '@/stores/AdminPaymentsFinance'

const headers = ref<ITableHeaders[]>(adminPaymentsFinance)

const adminPaymentsFinanceStore = useAdminPaymentsFinance()

const isLoading = computed(() => adminPaymentsFinanceStore.isLoading)
const router = useRouter()

const calcDataItems = computed<IUserInfoData[]>(() => adminPaymentsFinanceStore.items)

const queryParams = computed<ITableParams>({
  get() {
    return adminPaymentsFinanceStore.queryParams
  },
  set(val) {
    adminPaymentsFinanceStore.setQueryParams(val)
  }
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
    query: {
      page: page ?? 1,
      perPage: perPage
    }
  })
  adminPaymentsFinanceStore.getPublicationsListPayment(queryParams.value)
}

onMounted(() => {
  const { page = 1, perPage = 50 } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage
  }
  getRequest()
})
</script>
