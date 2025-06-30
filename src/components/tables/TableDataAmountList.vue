<template>
  <v-data-table
    :headers="computedHeaders"
    :items="items"
    :loading="isLoading"
    :itemsPerPage="itemsPerPage"
    class="custom-table"
    hover
    hide-default-footer
  >
    <template v-slot:loading>
      <v-progress-circular indeterminate color="#0070ba"></v-progress-circular>
    </template>
    <template v-slot:[`item.wallet_id`]="{ item }">
      <div class="d-flex">
        <div @click="item.showWallet = true" class="cell-wallet-id">
          {{ formatWallet(item.wallet_id) }}
        </div>
        <v-btn size="x-small" class="ml-4" @click="copyWallet(item.wallet_id)">Copy</v-btn>
        <v-btn
          size="x-small"
          color="primary"
          class="ml-4"
          :disabled="!item.wallet_transfer_list_link"
          @click="goToService(item.wallet_transfer_list_link)"
          >Link</v-btn
        >
      </div>
      <v-dialog v-model="item.showWallet" width="auto">
        <v-card title="Текущий кошелек" class="text-center">
          <v-card-actions class="d-flex flex-column align-start">
            {{ item.wallet_id }}
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template v-slot:[`item.status.amount`]="{ item }">
      <v-chip :color="getStatusColor(item.status.name)">
        {{ getStatus(item.status.name) }} {{ item.status.amount }}
      </v-chip>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { ITableHeaders, ITableItems } from '@/interfaces/AppModel'

const props = defineProps({
  headers: {
    type: Array as PropType<ITableHeaders[]>,
    default: () => []
  },
  items: {
    type: Array as PropType<ITableItems[]>,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  itemsPerPage: {
    type: [Number, String],
    default: 10
  }
})

const headersData = ref(props.headers)

const getStatus = (name: string) => {
  switch (name) {
    case 'deficit':
      return 'Дефицит'
    case 'over':
      return 'Свыше'
    case 'exactly':
      return 'Точно'
  }
}

const getStatusColor = (name: string) => {
  switch (name) {
    case 'deficit':
      return 'red'
    case 'over':
      return ''
    case 'exactly':
      return 'green'
  }
}

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const formatWallet = (wallet: string) => {
  if (!wallet) return ''
  const firstPart = wallet.slice(0, 3)
  const lastPart = wallet.slice(wallet.length - 3)
  return `${firstPart}...${lastPart}`
}

const goToService = (url: string) => {
  if (!url) return ''
  window.open(url, '_blank')
}

async function copyWallet(wallet: string) {
  if (!wallet) return
  try {
    await navigator.clipboard.writeText(wallet)
  } catch (err) {
    console.error('Ошибка копирования текста:', err)
    alert('Не удалось скопировать текст.')
  }
}
</script>

<style lang="scss">
.cell-wallet-id {
  cursor: pointer;
  transition: opacity 0.15s ease-in;
  min-width: 80px;

  &:hover {
    opacity: 0.7;
  }
}
</style>
