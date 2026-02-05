<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Стример</div>
    </div>
  </div>
  <TableStreamerInfo
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

import TablePagination from '@/components/tables/TablePagination.vue'
import TableStreamerInfo from '@/components/tables/TableStreamerInfo.vue'
import { streamerMainInfoHeaders } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { useAdminMain } from '@/stores/AdminMain.ts'

const headers = ref<ITableHeaders[]>(streamerMainInfoHeaders)

const adminMainStore = useAdminMain()

const isLoading = computed(() => adminMainStore.isLoading)
const router = useRouter()

const calcDataItems = computed<IUserInfoData[]>(() => adminMainStore.items ?? [])

const queryParams = computed<ITableParams>({
  get() {
    return adminMainStore.queryParams
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
  // adminMainStore.getSlicerList(queryParams.value)
}

const actionRequest = async (id: number, status: string) => {
  // const data = {
  //   id,
  //   status
  // }
  // await supportUsersStore.actionRequest(data)
  getRequest()
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
