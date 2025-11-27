<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Заявки</div>
    </div>
  </div>
  <TableStreamer
    :headers="headers"
    :is-loading="isLoading"
    :items="calcDataItems"
    :items-per-page="queryParams.perPage"
    @action-request="actionRequest"
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
import { computed, ref } from 'vue'

import TablePagination from '@/components/tables/TablePagination.vue'
import TableStreamer from '@/components/tables/TableStreamer.vue'
import { useTableQuery } from '@/composables/useTableQuery.ts'
import { adminMain } from '@/constants/tableHeaders'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import { useAdminMain } from '@/stores/AdminMain'
import { useError } from '@/stores/Errors.ts'

const headers = ref<ITableHeaders[]>(adminMain)

const adminMainStore = useAdminMain()
const errorStore = useError()

const { queryParams, totalPages, changePage, getRequest } = useTableQuery({
  getQueryParams: () => adminMainStore.queryParams,
  setQueryParams: (params) => adminMainStore.setQueryParams(params),
  fetchData: (params) => adminMainStore.getPublicationsListMain(params)
})

const isLoading = computed(() => adminMainStore.isLoading)

const calcDataItems = computed<IUserInfoData[]>(() => adminMainStore.items)

const actionRequest = async (id: number, status: string) => {
  const newData = {
    id,
    status
  }
  try {
    const { data } = await adminMainStore.actionRequest(newData)
    const msg = data?.message ?? ''
    errorStore.setErrors(msg, 'success')
    getRequest()
  } catch (e) {
    console.log(e)
  }
}
</script>
