<template>
  <TableSupport
    class="custom-table"
    :headers="headers"
    :isLoading="isLoading"
    :items="calcDataItems"
    :itemsPerPage="queryParams.perPage"
    @action-request="actionRequest"
  ></TableSupport>
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
import { supportHeaders } from '@/constants/tableHeaders'
import { useRouter } from 'vue-router'
import { useSupport } from '@/stores/Support'
import TableSupport from '@/components/tables/TableSupport.vue'
// import type { ISupportSaveStatus } from '@/interfaces/ISupport'

const headers = ref<ITableHeaders[]>(supportHeaders)

const supportStore = useSupport()

const isLoading = computed(() => supportStore.isLoading)
const router = useRouter()

const calcDataItems = computed<IUserInfoData[]>(() => supportStore.items)

const queryParams = computed<ITableParams>({
  get() {
    return supportStore.queryParams
  },
  set(val) {
    supportStore.setQueryParams(val)
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
  supportStore.getPublicationsList(queryParams.value)
}

const actionRequest = async (id: number, status: string) => {
  const data = {
    id,
    status
  }
  await supportStore.actionRequest(data)
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
