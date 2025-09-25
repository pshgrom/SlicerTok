<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Заявки</div>
    </div>
  </div>
  <TableSupport
    v-model="dialog"
    :headers="headers"
    :is-loading="isLoading"
    :items="calcDataItems"
    :items-per-page="queryParams.perPage"
    @action-request="actionRequest"
    @change-final-values="changeFinalValues"
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
import TableSupport from '@/components/tables/TableSupport.vue'
import { supportHeaders } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { useAdminInfo } from '@/stores/AdminInfo.ts'
import { useError } from '@/stores/Errors.ts'
import { useRequestSocket } from '@/stores/RequestsSocket.ts'
import { useSupport } from '@/stores/Support'
// import type { ISupportSaveStatus } from '@/interfaces/ISupport'

const headers = ref<ITableHeaders[]>(supportHeaders)
const errorStore = useError()
const dialog = ref(false)

const supportStore = useSupport()
const requestSocketStore = useRequestSocket()

const isLoading = computed(() => supportStore.isLoading)
const router = useRouter()
const adminInfo = useAdminInfo()

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

const actionRequest = async (id: number) => {
  await supportStore.actionRequest(id)
  getRequest()
}

const changeFinalValues = async (dataRes: any) => {
  try {
    const { data } = await supportStore.changeFinalValues(dataRes)
    const msg = data?.message ?? ''
    errorStore.setErrors(msg, 'success')
    getRequest()
    dialog.value = false
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  const { page = 1, perPage = 50 } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage
  }
  getRequest()
  adminInfo.getCoefficient()
  requestSocketStore.setChannel('publication-new.support')
  requestSocketStore.connect()
})
</script>
