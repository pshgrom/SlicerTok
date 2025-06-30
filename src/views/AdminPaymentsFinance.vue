<template>
  <v-container fluid>
    <TableAdminPaymentsFinance
      class="table-settings__table"
      :headers="headers"
      :isLoading="isLoading"
      :items="calcDataItems"
      :itemsPerPage="queryParams.perPage"
    ></TableAdminPaymentsFinance>
    <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
      <TablePagination
        v-model:queryParams="queryParams"
        :loading="isLoading"
        :totalPages="totalPages"
        @changePage="changePage"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import TablePagination from '@/components/tables/TablePagination.vue'
import { computed, ref, onMounted } from 'vue'
import { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { adminPaymentsFinance } from '@/constants/tableHeaders'
import { useRouter } from 'vue-router'
import { useAdminPaymentsFinance } from '@/stores/AdminPaymentsFinance'
import TableAdminPaymentsFinance from '@/components/tables/TableAdminPaymentsFinance.vue'

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

<style scoped lang="scss">
.table-settings-filter {
  margin: 0;
}
</style>
