<template>
  <v-container fluid>
    <TableAdminMain
      class="table-settings__table"
      :headers="headers"
      :isLoading="isLoading"
      :items="calcDataItems"
      :itemsPerPage="queryParams.perPage"
    ></TableAdminMain>
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
import { adminMain } from '@/constants/tableHeaders'
import { useRouter } from 'vue-router'
import { useAdminMain } from '@/stores/AdminMain'
import TableAdminMain from '@/components/tables/TableAdminMain.vue'

const headers = ref<ITableHeaders[]>(adminMain)

const adminMainStore = useAdminMain()

const isLoading = computed(() => adminMainStore.isLoading)
const router = useRouter()

const calcDataItems = computed<IUserInfoData[]>(() => adminMainStore.items)

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
  adminMainStore.getPublicationsListMain(queryParams.value)
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

<style scoped lang="scss"></style>
