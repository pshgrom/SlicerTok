<template>
  <div class="admin-info d-flex">
    <div class="admin-info__wrap" :class="{ 'admin-info__wrap_half': activePanel }">
      <div class="table-actions table-actions_admin">
        <div class="table-actions__left">
          <div class="table-actions__label">Заявки</div>
        </div>
      </div>
      <TableSupport
        v-model="dialog"
        v-model:active-panel="activePanel"
        :headers="headers"
        :is-loading="isLoading"
        :items="calcDataItems"
        :selected-index="selectedIndex"
        :items-per-page="queryParams.perPage"
        @action-request="actionRequest"
        @row-click="onRowClick"
      />
      <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
        <TablePagination
          v-model:query-params="queryParams"
          :loading="isLoading"
          :total-pages="totalPages"
          @change-page="changePage"
        />
      </div>
    </div>
    <transition name="scale-fade">
      <SidePanelSupport
        v-show="activePanel"
        v-model:current-item="currentRecord"
        v-model:active-panel="activePanel"
        :is-first="selectedIndex === 0"
        :is-last="selectedIndex === calcDataItems.length - 1"
        @change-final-values="changeFinalValues"
        @prev="prevRow"
        @next="nextRow"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import SidePanelSupport from '@/components/base/SidePanelSupport.vue'
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
const activePanel = ref(false)

const supportStore = useSupport()
const requestSocketStore = useRequestSocket()

const isLoading = computed(() => supportStore.isLoading)
const router = useRouter()
const currentRecord = ref({})
const selectedIndex = ref(-1)

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

const onRowClick = (item) => {
  currentRecord.value = item?.item ?? {}
  selectedIndex.value = item.index
  activePanel.value = true
}

const prevRow = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
    currentRecord.value = calcDataItems.value[selectedIndex.value]
  }
}

const nextRow = () => {
  if (selectedIndex.value < calcDataItems.value.length - 1) {
    selectedIndex.value++
    currentRecord.value = calcDataItems.value[selectedIndex.value]
  }
}

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

const handleKeydown = (e) => {
  if (!calcDataItems.value.length) return
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    prevRow()
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    nextRow()
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
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.admin-info {
  &__wrap {
    width: 100%;

    &_half {
      width: 100%;
      min-width: 100px;
    }
  }
}
</style>
