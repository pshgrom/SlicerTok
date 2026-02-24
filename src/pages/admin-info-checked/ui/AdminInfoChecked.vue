<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Заявки</div>
      <div>
        <TabsSwitcher :tabs="tabsContent" initial-tab="tab2" @tab-click="goToPage" />
      </div>
    </div>
  </div>
  <TableAdminInfoChecked
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAdminInfo } from '@/entities/admin'
import { adminInfoCheckedHeaders } from '@/shared/config'
import type { ITableHeaders, IUserInfoData } from '@/shared/config/types/app-model'
import { useTableQuery } from '@/shared/lib'
import { TablePagination } from '@/shared/ui'
import { TableAdminInfoChecked } from '@/widgets/tables'
import TabsSwitcher from '@/shared/ui/TabsSwitcher.vue'

const headers = ref<ITableHeaders[]>(adminInfoCheckedHeaders)

const adminInfo = useAdminInfo()

const isLoading = computed(() => adminInfo.isLoading)
const router = useRouter()
const tabsContent = [
  { id: 'tab1', title: 'На модерации', count: 0, redirect: '/admin-info' },
  { id: 'tab2', title: 'Проверенные', count: 0, redirect: '/admin-info-checked' }
]

const { queryParams, totalPages, changePage } = useTableQuery({
  getQueryParams: () => adminInfo.queryParams,
  setQueryParams: (params) => adminInfo.setQueryParams(params),
  fetchData: (params) => adminInfo.getCompletedList(params)
})

const calcDataItems = computed<IUserInfoData[]>(() => adminInfo.adminInfoDataChecked)

const goToPage = (path: string) => {
  router.push(`${path.redirect}?page=1`)
}
</script>
