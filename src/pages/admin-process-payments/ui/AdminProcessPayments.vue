<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Заявки</div>
      <div>
        <AdminPaymentsTabs />
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

import { useAdminPaymentsFinance } from '@/entities/payment'
import { adminProcessPayments } from '@/shared/config'
import type { ITableHeaders, IUserInfoData } from '@/shared/config/types/app-model'
import { useTableQuery } from '@/shared/lib'
import { AdminPaymentsTabs, TablePagination } from '@/shared/ui'
import VCusomButton from '@/shared/ui/VCusomButton.vue'
import { ImportDocuments } from '@/widgets/import-documents'
import { TableAdminProcessPayments } from '@/widgets/tables'

const headers = ref<ITableHeaders[]>(adminProcessPayments)
const selectedIds = ref<number[]>([])
const adminPaymentsFinanceStore = useAdminPaymentsFinance()

const { queryParams, totalPages, changePage, getRequest } = useTableQuery({
  getQueryParams: () => adminPaymentsFinanceStore.queryParams,
  setQueryParams: (params) => adminPaymentsFinanceStore.setQueryParams(params),
  fetchData: (params) => adminPaymentsFinanceStore.getTransferList(params)
})

const isLoading = computed(() => adminPaymentsFinanceStore.isLoading)
const calcDataItems = computed<IUserInfoData[]>(() => adminPaymentsFinanceStore.items)

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
  adminPaymentsFinanceStore.getAdminFinanceInfo()
})
</script>
