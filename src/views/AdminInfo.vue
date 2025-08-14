<template>
  <div class="table-actions table-actions_main">
    <DateFilter
      v-model="queryParams.user_created_at"
      label="Поиск по дате регистрации нарезчика"
      @update:model-value="onDateChangeSlicer"
    />
    <DateFilter
      v-model="queryParams.created_at"
      label="Поиск по дате загрузки видео"
      @update:model-value="onDateChangeVideo"
    />
  </div>
  <TableAdminInfo
    :headers="headers"
    :isLoading="isLoading"
    :items="calcDataItems"
    :itemsPerPage="queryParams.perPage"
    @finish-check="finishCheck"
    @request-verification="requestVerification"
    @change-state="changeState"
    @save-mark="saveMark"
    @custom-sort="customSort"
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
import type { ITableHeaders, ITableParamsAdmin, IUserInfoData } from '@/interfaces/AppModel'
import { adminInfoHeaders } from '@/constants/tableHeaders'
import { useRouter } from 'vue-router'
import { useAdminInfo } from '@/stores/AdminInfo'
import TableAdminInfo from '@/components/tables/TableAdminInfo.vue'
import { useError } from '@/stores/Errors.ts'
import DateFilter from '@/components/base/DateFilter.vue'

const headers = ref<ITableHeaders[]>(adminInfoHeaders)
const errorStore = useError()

const adminInfo = useAdminInfo()

const isLoading = computed(() => adminInfo.isLoading)
const router = useRouter()
const calcDataItems = computed<IUserInfoData[]>(() => adminInfo.adminInfoData)

const queryParams = computed<ITableParamsAdmin>({
  get() {
    return adminInfo.queryParams
  },
  set(val) {
    adminInfo.setQueryParams(val)
  }
})

const onDateChangeSlicer = (val: string) => {
  if (val) {
    queryParams.value = {
      ...queryParams.value,
      user_created_at: val,
      page: 1
    }
  } else {
    queryParams.value = {
      ...queryParams.value,
      user_created_at: undefined
    }
  }
  getRequest()
}

const onDateChangeVideo = (val: string) => {
  if (val) {
    queryParams.value = {
      ...queryParams.value,
      created_at: val,
      page: 1
    }
  } else {
    queryParams.value = {
      ...queryParams.value,
      created_at: undefined
    }
  }
  getRequest()
}

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

const customSort = (sortData) => {
  if (sortData && Object.keys(sortData).length) {
    queryParams.value = {
      ...queryParams.value,
      ...sortData,
      page: 1
    }
  } else {
    queryParams.value = {
      sort_user_created_at: undefined,
      sort_created_at: undefined,
      page: 1
    }
  }
  getRequest()
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
  const { page } = queryParams.value
  router.push({
    query: {
      ...queryParams.value,
      page: page ?? 1,
      total: undefined
    }
  })
  adminInfo.getPublicationsList(queryParams.value)
}

onMounted(() => {
  queryParams.value = {
    ...router.currentRoute.value.query
  }
  getRequest()
})
</script>

<style scoped lang="scss">
.table-settings-filter {
  margin: 0;
}
</style>
