<template>
  <TableSupportUsers
    class="custom-table"
    :headers="headers"
    :isLoading="isLoading"
    :items="calcDataItems"
    :itemsPerPage="queryParams.perPage"
    @action-request="actionRequest"
  ></TableSupportUsers>
  <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
    <TablePagination
      v-model:queryParams="queryParams"
      :loading="isLoading"
      :totalPages="totalPages"
      @change-page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import TablePagination from '@/components/tables/TablePagination.vue'
import { computed, ref, onMounted } from 'vue'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { supportUsersHeaders } from '@/constants/tableHeaders'
import { useRouter } from 'vue-router'
import TableSupportUsers from '@/components/tables/TableSupportUsers.vue'
import { useSupportUsers } from '@/stores/SupportUsers.ts'

const headers = ref<ITableHeaders[]>(supportUsersHeaders)

const supportUsersStore = useSupportUsers()

const isLoading = computed(() => supportUsersStore.isLoading)
const router = useRouter()

const calcDataItems = computed<IUserInfoData[]>(() => supportUsersStore.items)

const queryParams = computed<ITableParams>({
  get() {
    return supportUsersStore.queryParams
  },
  set(val) {
    supportUsersStore.setQueryParams(val)
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
  supportUsersStore.getSlicerList(queryParams.value)
}

const actionRequest = async (id: number, status: string) => {
  const data = {
    id,
    status
  }
  await supportUsersStore.actionRequest(data)
  getRequest()
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
