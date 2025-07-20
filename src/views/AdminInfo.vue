<template>
  <TableAdminInfo
    class="table-settings__table"
    :headers="headers"
    :isLoading="isLoading"
    :items="calcDataItems"
    :itemsPerPage="queryParams.perPage"
    @finish-check="finishCheck"
    @change-state="changeState"
  ></TableAdminInfo>
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
import { adminInfoHeaders } from '@/constants/tableHeaders'
import { useRouter } from 'vue-router'
import { useAdminInfo } from '@/stores/AdminInfo'
import TableAdminInfo from '@/components/tables/TableAdminInfo.vue'

const headers = ref<ITableHeaders[]>(adminInfoHeaders)

const adminInfo = useAdminInfo()

const isLoading = computed(() => adminInfo.isLoading)
const router = useRouter()

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

const cleanNumber = (str: string) => {
  return str.replace(/\D/g, '')
}

const changeState = (item, selectedTasks) => {
  const { id, status, status_comment, number_views } = item

  const data = {
    id,
    status,
    status_comment,
    number_views: cleanNumber(number_views),
    rules: selectedTasks
  }
  adminInfo.setPublicationStatus(data)
  getRequest()
}

const finishCheck = async (id: number) => {
  const resp = await adminInfo.finishCheck(id)
  if (resp?.data?.code === 200) {
    getRequest()
  }
}

const getRequest = () => {
  const { page, perPage } = queryParams.value
  router.push({
    query: {
      page: page ?? 1,
      perPage: perPage
    }
  })
  adminInfo.getPublicationsList(queryParams.value)
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
