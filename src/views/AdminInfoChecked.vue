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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import TabsSwitcher from '@/components/base/TabsSwitcher.vue'
import TableAdminInfoChecked from '@/components/tables/TableAdminInfoChecked.vue'
import TablePagination from '@/components/tables/TablePagination.vue'
import { adminInfoCheckedHeaders } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { useAdminInfo } from '@/stores/AdminInfo'

const headers = ref<ITableHeaders[]>(adminInfoCheckedHeaders)

const adminInfo = useAdminInfo()

const isLoading = computed(() => adminInfo.isLoading)
const router = useRouter()
const tabsContent = [
  { id: 'tab1', title: 'На модерации', count: 0, redirect: '/admin-info' },
  { id: 'tab2', title: 'Проверенные', count: 0, redirect: '/admin-info-checked' }
]

const calcDataItems = computed<IUserInfoData[]>(() => adminInfo.adminInfoData)

const queryParams = computed<ITableParams>({
  get() {
    return adminInfo.queryParams
  },
  set(val) {
    adminInfo.setQueryParams(val)
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

const goToPage = (path: string) => {
  router.push(path.redirect)
}

const getRequest = () => {
  const { page, perPage } = queryParams.value
  router.push({
    query: {
      page: page ?? 1,
      perPage: perPage
    }
  })
  adminInfo.getCompletedList(queryParams.value)
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
