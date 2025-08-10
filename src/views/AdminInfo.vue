<template>
  <TableAdminInfo
    :headers="headers"
    :isLoading="isLoading"
    :items="calcDataItems"
    :itemsPerPage="queryParams.perPage"
    @finish-check="finishCheck"
    @request-verification="requestVerification"
    @change-state="changeState"
    @save-mark="saveMark"
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
import { useError } from '@/stores/Errors.ts'

const headers = ref<ITableHeaders[]>(adminInfoHeaders)
const errorStore = useError()

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

const cleanNumber = (str: string) => str.replace(/\D/g, '')

const changeState = async (item, selectedTasks) => {
  const { id, status, status_comment, number_views_moderation } = item
  const data = {
    id,
    status,
    status_comment,
    number_views_moderation: cleanNumber(number_views_moderation),
    rules: selectedTasks
  }
  try {
    await adminInfo.setPublicationStatus(data)
    getRequest()
  } catch (error: any) {
    errorStore.setErrors(error.response?.data?.message ?? '')
  }
}

const saveMark = async (markData: any) => {
  const { data } = await adminInfo.saveMark(markData)
  const msg = data?.message ?? ''
  errorStore.setErrors(msg, 'success')
  if (data?.code === 200) {
    getRequest()
  }
}

const finishCheck = async (id: number) => {
  const { data } = await adminInfo.finishCheck(id)
  const msg = data?.message ?? ''
  errorStore.setErrors(msg, 'success')
  if (data?.code === 200) {
    getRequest()
  }
}

const requestVerification = async (id: number) => {
  const { data } = await adminInfo.requestVerification(id)
  const msg = data?.message ?? ''
  errorStore.setErrors(msg, 'success')
  if (data?.code === 200) {
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
