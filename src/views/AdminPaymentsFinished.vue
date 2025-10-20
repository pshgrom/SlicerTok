<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Заявки</div>
      <div>
        <TabsSwitcher :tabs="tabsContent" initial-tab="tab3" @tab-click="goToPage" />
      </div>
    </div>
  </div>
  <TableAdminFinishedFinance
    v-model:selected-ids="selectedIds"
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

import TabsSwitcher from '@/components/base/TabsSwitcher.vue'
import TableAdminFinishedFinance from '@/components/tables/TableAdminFinishedFinance.vue'
import TablePagination from '@/components/tables/TablePagination.vue'
import { adminFinishedPayments } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { useAdminPaymentsFinance } from '@/stores/AdminPaymentsFinance'

const headers = ref<ITableHeaders[]>(adminFinishedPayments)
const selectedIds = ref<number[]>([])

const tabsContent = [
  { id: 'tab1', title: 'Все заявки', count: 0, redirect: '/admin-payments-finance' },
  { id: 'tab2', title: 'В процессе выплат', count: 0, redirect: '/admin-process-payments' },
  { id: 'tab3', title: 'Оплаченные', count: 0, redirect: '/admin-finished-list' }
]

const goToPage = (path: string) => {
  router.push(`${path.redirect}?page=1`)
}

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

// const handleSelected = async () => {
//   if (!selectedIds.value.length) return
//   await adminPaymentsFinanceStore.setMakeTransfer(selectedIds.value)
//   getRequest()
// }

const getRequest = () => {
  const { page, perPage } = queryParams.value
  router.push({
    query: {
      page: page ?? 1,
      perPage: perPage
    }
  })
  adminPaymentsFinanceStore.getFinishedList(queryParams.value)
}

onMounted(() => {
  const { page = 1, perPage = 50 } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage
  }
  getRequest()
  // adminPaymentsFinanceStore.getAdminFinanceInfo()
})
</script>
