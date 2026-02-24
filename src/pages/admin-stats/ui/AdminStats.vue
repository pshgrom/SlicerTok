<template>
  <AdminBreadcrumbs />
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Статистика за день</div>
    </div>
  </div>
  <TableAdminStats
    :headers="headers"
    :is-loading="isLoading"
    :items="adminsStats"
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
import { useRoute, useRouter } from 'vue-router'

import { useAdminMain } from '@/entities/admin'
import { adminStats } from '@/shared/config'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/shared/config/types/app-model'
import { TablePagination } from '@/shared/ui'
import { AdminBreadcrumbs } from '@/widgets/admin-breadcrumbs'
import { TableAdminStats } from '@/widgets/tables'

const headers = ref<ITableHeaders[]>(adminStats)

const adminMainStore = useAdminMain()
const router = useRouter()
const route = useRoute()

const isLoading = computed(() => adminMainStore.loadingStats)
const queryParams = computed<ITableParams>({
  get() {
    return adminMainStore.queryParamsStats
  },
  set(val) {
    adminMainStore.setQueryParams(val)
  }
})
const totalPages = computed(() =>
  queryParams.value?.total && queryParams.value?.perPage
    ? Math.ceil(queryParams.value.total / queryParams.value.perPage)
    : 0
)
const adminsStats = computed<IUserInfoData[]>(() => adminMainStore.adminsStats)

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
  const adminId = route.params.adminId
  adminMainStore.getAdminStats(queryParams.value, adminId)
}

onMounted(async () => {
  const { page = 1, perPage = 50 } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage
  }
  getRequest()
})
</script>
