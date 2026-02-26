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
        :custom-class="['light', 'avg']"
        @click="handleSelected"
      >
        Отправить на выплату
      </VCusomButton>
    </div>
  </div>
  <TableAdminPaymentsFinance
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
import { adminPaymentsFinance } from '@/shared/config'
import type { ITableHeaders, IUserInfoData } from '@/shared/config/types/app-model'
import { useTableQuery } from '@/shared/lib'
import { AdminPaymentsTabs, TablePagination } from '@/shared/ui'
import VCusomButton from '@/shared/ui/VCusomButton.vue'
import { TableAdminPaymentsFinance } from '@/widgets/tables'

const headers = ref<ITableHeaders[]>(adminPaymentsFinance)
const selectedIds = ref<number[]>([])
const adminPaymentsFinanceStore = useAdminPaymentsFinance()

const { queryParams, totalPages, changePage, getRequest } = useTableQuery({
  getQueryParams: () => adminPaymentsFinanceStore.queryParams,
  setQueryParams: (params) => adminPaymentsFinanceStore.setQueryParams(params),
  fetchData: (params) => adminPaymentsFinanceStore.getPublicationListPayment(params)
})

const isLoading = computed(() => adminPaymentsFinanceStore.isLoading)
const calcDataItems = computed<IUserInfoData[]>(() => adminPaymentsFinanceStore.items)

const handleSelected = async () => {
  if (!selectedIds.value.length) return
  await adminPaymentsFinanceStore.setMakeTransfer(selectedIds.value)
  getRequest()
  selectedIds.value = []
}

onMounted(() => {
  adminPaymentsFinanceStore.getAdminFinanceInfo()
})
</script>
