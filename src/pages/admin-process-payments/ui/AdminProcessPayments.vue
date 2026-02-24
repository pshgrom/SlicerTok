<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Заявки</div>
      <div>
        <TabsSwitcher :tabs="tabsContent" initial-tab="tab2" @tab-click="goToPage" />
      </div>
    </div>
    <div class="table-actions__right">
      <VCusomButton
        :disabled="!selectedIds.length"
        :custom-class="['dark', 'avg']"
        class="mr-2"
        @click="downLoadExcel"
      >
        Выгрузка Excel
      </VCusomButton>
      <ImportDocuments />
      <VCusomButton
        :disabled="!selectedIds.length"
        :custom-class="['light', 'avg']"
        @click="handleSelected"
      >
        Отменить оплату
      </VCusomButton>
    </div>
  </div>
  <TableAdminProcessPayments
    v-model:selected-ids="selectedIds"
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

import { useAdminPaymentsFinance } from '@/entities/payment'
import { adminProcessPayments } from '@/shared/config'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/shared/config/types/app-model'
import { TablePagination } from '@/shared/ui'
import TabsSwitcher from '@/shared/ui/TabsSwitcher.vue'
import VCusomButton from '@/shared/ui/VCusomButton.vue'
import { ImportDocuments } from '@/widgets/import-documents'
import { TableAdminProcessPayments } from '@/widgets/tables'

const headers = ref<ITableHeaders[]>(adminProcessPayments)

const tabsContent = [
  { id: 'tab1', title: 'Все заявки', count: 0, redirect: '/admin-payments-finance' },
  { id: 'tab2', title: 'В процессе выплат', count: 0, redirect: '/admin-process-payments' },
  { id: 'tab3', title: 'Оплаченные', count: 0, redirect: '/admin-finished-list' }
]

const goToPage = (path: string) => {
  router.push(`${path.redirect}?page=1`)
}

const selectedIds = ref<number[]>([])
const adminPaymentsFinanceStore = useAdminPaymentsFinance()

const isLoading = computed(() => adminPaymentsFinanceStore.isLoading)
const router = useRouter()

const calcDataItems = computed<IUserInfoData[]>(() => adminPaymentsFinanceStore.items)

const queryParams = computed<ITableParams>({
  get() {
    return adminPaymentsFinanceStore.queryParams
  },
  set(val) {
    adminPaymentsFinanceStore.setQueryParams(val)
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
  adminPaymentsFinanceStore.getTransferList(queryParams.value)
}

const handleSelected = async () => {
  if (!selectedIds.value.length) return
  await adminPaymentsFinanceStore.cancelTransfer(selectedIds.value)
  getRequest()
  selectedIds.value = []
}

const downLoadExcel = async () => {
  if (!selectedIds.value.length) return
  const response = await adminPaymentsFinanceStore.getTransferListExel(selectedIds.value)
  selectedIds.value = []
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transfer_list.xlsx'
  a.click()
  window.URL.revokeObjectURL(url)
}

onMounted(() => {
  const { page = 1, perPage = 50 } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage
  }
  getRequest()
  adminPaymentsFinanceStore.getAdminFinanceInfo()
})
</script>
