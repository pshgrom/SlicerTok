<template>
  <v-data-table
    :headers="computedHeaders"
    :items="items"
    :loading="isLoading"
    :items-per-page="itemsPerPage"
    class="custom-table"
    hover
    height="70vh"
    fixed-header
    hide-default-footer
  >
    <template #loading>
      <v-progress-circular indeterminate color="rgb(169, 55, 244)" />
    </template>
    <template #[`item.wallet`]="{ item }">
      <div>
        {{ item?.wallet?.address }}
      </div>
    </template>
    <template #item.publication="{ item }">
      <div class="flex flex-col gap-1">
        <div v-for="pub in item.publication" :key="pub.id">
          ID {{ pub.id }} —
          {{ pub.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
        </div>
      </div>
    </template>
    <template #[`item.amount`]="{ item }">
      <div>{{ formatCompactUSD(item.amount) }}</div>
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="d-flex align-center">
        <div class="table-checkbox mr-2">
          <v-tooltip text="Отменить выплату" location="bottom">
            <template #activator="{ props }">
              <v-checkbox
                v-model="selectedIds"
                :value="item.id"
                v-bind="props"
                color="rgb(169, 55, 244)"
                hide-details
              />
            </template>
          </v-tooltip>
        </div>
        <v-tooltip text="Выплатить" location="bottom">
          <template #activator="{ props }">
            <VCusomButton
              v-bind="props"
              class="mr-1"
              :custom-class="['light', 'avg', 'only-icon']"
              @click="showDialog(item)"
            >
              <SvgIcon name="open-modal" /> </VCusomButton
          ></template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
  <PaymentsModal
    v-if="isModalOpen"
    v-model="isModalOpen"
    v-model:current-item="currentItem"
    @pay="pay"
  />
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'

import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import PaymentsModal from '@/components/modals/PaymentsModal.vue'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import { useAdminPaymentsFinance } from '@/stores/AdminPaymentsFinance.ts'

const props = defineProps({
  headers: {
    type: Array as PropType<ITableHeaders[]>,
    default: () => []
  },
  items: {
    type: Array as PropType<IUserInfoData[]>,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  selectedIds: {
    type: Array,
    default: () => []
  },
  itemsPerPage: {
    type: [Number, String],
    default: 10
  }
})

const emit = defineEmits(['update:selectedIds', 'pay'])
const adminPaymentsFinanceStore = useAdminPaymentsFinance()
const isModalOpen = ref(false)
const currentItem = ref({})

const headersData = ref(props.headers)

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const selectedIds = computed({
  get() {
    return props.selectedIds
  },
  set(val) {
    emit('update:selectedIds', val)
  }
})

const pay = async (data) => {
  const resp = await adminPaymentsFinanceStore.transferFinished(data)
  console.warn(11, resp)
}

const showDialog = (item) => {
  currentItem.value = item
  isModalOpen.value = true
}

const formatCompactUSD = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(amount)
}
</script>
