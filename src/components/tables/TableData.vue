<!--<template>-->
<!--  <v-data-table-->
<!--    :headers="computedHeaders"-->
<!--    :items="items"-->
<!--    :loading="isLoading"-->
<!--    :itemsPerPage="itemsPerPage"-->
<!--    class="custom-table"-->
<!--    hover-->
<!--    hide-default-footer-->
<!--  >-->
<!--    <template v-slot:loading>-->
<!--      <v-progress-circular indeterminate color="#0070ba"></v-progress-circular>-->
<!--    </template>-->
<!--    <template v-slot:[`item.number_views`]="{ item }">-->
<!--      <div>-->
<!--        <div class="custom-table__increase">-->
<!--          <v-icon @click.stop="item.viewsDialog = true" class="mdi-eye">visibility</v-icon>-->
<!--        </div>-->
<!--        <v-dialog v-model="item.viewsDialog" width="auto">-->
<!--          <v-card title="Просмотры" class="text-center">-->
<!--            <v-card-actions class="justify-start">-->
<!--              <div class="cell-text">{{ item.number_views }}</div>-->
<!--            </v-card-actions>-->
<!--          </v-card>-->
<!--        </v-dialog>-->
<!--      </div>-->
<!--    </template>-->
<!--    <template v-slot:[`item.nikname`]="{ item }">-->
<!--      <div class="d-flex justify-space-between">-->
<!--        <div @click="goToTelegram(item.nikname)" class="cell-link">-->
<!--          {{ item.nikname }}-->
<!--        </div>-->
<!--        <v-chip :color="getStatusColorUser(item.nikname_status)">-->
<!--          <div>{{ getStatusUser(item.nikname_status) }}</div>-->
<!--        </v-chip>-->
<!--      </div>-->
<!--    </template>-->
<!--    <template v-slot:[`item.wallet_id`]="{ item }">-->
<!--      <div class="d-flex">-->
<!--        <div @click="item.showWallet = true" class="cell-wallet-id">-->
<!--          {{ formatWallet(item.wallet_id) }}-->
<!--        </div>-->
<!--        <v-btn size="x-small" class="ml-4" @click="copyWallet(item.wallet_id)">Copy</v-btn>-->
<!--        <v-btn-->
<!--          size="x-small"-->
<!--          color="primary"-->
<!--          class="ml-4"-->
<!--          :disabled="!item.wallet_transfer_list_link"-->
<!--          @click="goToService(item.wallet_transfer_list_link)"-->
<!--          >Link</v-btn-->
<!--        >-->
<!--      </div>-->
<!--      <v-dialog v-model="item.showWallet" width="auto">-->
<!--        <v-card title="Текущий кошелек" class="text-center">-->
<!--          <v-card-actions class="d-flex flex-column align-start">-->
<!--            {{ item.wallet_id }}-->
<!--          </v-card-actions>-->
<!--        </v-card>-->
<!--      </v-dialog>-->
<!--    </template>-->
<!--    <template v-slot:[`item.declared_status`]="{ item }">-->
<!--      <v-chip :color="getPayColor(item.declared_status)">-->
<!--        <div>{{ getPayStatus(item.declared_status) }}</div>-->
<!--      </v-chip>-->
<!--    </template>-->
<!--    <template v-slot:[`item.actual_status`]="{ item }">-->
<!--      <div class="d-flex align-center">-->
<!--        <v-chip :color="getPayColor(item.actual_status)">-->
<!--          <div>{{ getPayStatus(item.actual_status) }}</div>-->
<!--        </v-chip>-->
<!--        <v-btn-->
<!--          size="x-small"-->
<!--          color="primary"-->
<!--          class="ml-4"-->
<!--          :disabled="!item.transaction_tron_link"-->
<!--          @click="goToService(item.transaction_tron_link)"-->
<!--          >Link</v-btn-->
<!--        >-->
<!--      </div>-->
<!--    </template>-->
<!--    <template v-slot:[`item.suspicion_status`]="{ item }">-->
<!--      <div class="status-wallet">-->
<!--        <v-chip :color="getColor(item.suspicion_status)">-->
<!--          {{ getStatus(item.suspicion_status) }}-->
<!--        </v-chip>-->
<!--      </div>-->
<!--    </template>-->
<!--  </v-data-table>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { computed, type PropType, ref } from 'vue'-->
<!--import type { ITableHeaders, ITableItems } from '@/interfaces/AppModel'-->

<!--const props = defineProps({-->
<!--  headers: {-->
<!--    type: Array as PropType<ITableHeaders[]>,-->
<!--    default: () => []-->
<!--  },-->
<!--  items: {-->
<!--    type: Array as PropType<ITableItems[]>,-->
<!--    default: () => []-->
<!--  },-->
<!--  isLoading: {-->
<!--    type: Boolean,-->
<!--    default: false-->
<!--  },-->
<!--  itemsPerPage: {-->
<!--    type: [Number, String],-->
<!--    default: 10-->
<!--  }-->
<!--})-->

<!--const headersData = ref(props.headers)-->

<!--const computedHeaders = computed<ITableHeaders[]>({-->
<!--  get() {-->
<!--    return headersData.value-->
<!--  },-->
<!--  set(val) {-->
<!--    headersData.value = val-->
<!--  }-->
<!--})-->

<!--const goToTelegram = (user: string) => {-->
<!--  const url = `https://t.me/${user}`-->
<!--  window.open(url, '_blank')-->
<!--}-->

<!--const getColor = (status: string) => {-->
<!--  switch (status) {-->
<!--    case 'yes_suspicion':-->
<!--      return 'red'-->
<!--    case 'no_suspicion':-->
<!--      return 'green'-->
<!--    default:-->
<!--      return ''-->
<!--  }-->
<!--}-->

<!--const getStatus = (status: string) => {-->
<!--  switch (status) {-->
<!--    case 'yes_suspicion':-->
<!--      return 'Подозрительный'-->
<!--    case 'no_suspicion':-->
<!--      return 'Не подозрительный'-->
<!--    default:-->
<!--      return 'Неизвестно'-->
<!--  }-->
<!--}-->

<!--const getPayStatus = (status: string) => {-->
<!--  switch (status) {-->
<!--    case 'paid':-->
<!--      return 'Оплачено'-->
<!--    case 'not_paid':-->
<!--      return 'Не оплачено'-->
<!--    default:-->
<!--      return 'Неизвестно'-->
<!--  }-->
<!--}-->

<!--const getPayColor = (status: string) => {-->
<!--  switch (status) {-->
<!--    case 'paid':-->
<!--      return 'green'-->
<!--    case 'not_paid':-->
<!--      return 'red'-->
<!--    default:-->
<!--      return ''-->
<!--  }-->
<!--}-->

<!--const getStatusColorUser = (status: string) => {-->
<!--  switch (status) {-->
<!--    case 'find':-->
<!--      return 'green'-->
<!--    case 'deleted':-->
<!--      return 'red'-->
<!--    default:-->
<!--      return ''-->
<!--  }-->
<!--}-->

<!--const getStatusUser = (status: string) => {-->
<!--  switch (status) {-->
<!--    case 'find':-->
<!--      return 'Найден'-->
<!--    case 'deleted':-->
<!--      return 'Удален'-->
<!--    default:-->
<!--      return 'Неопределено'-->
<!--  }-->
<!--}-->

<!--const formatWallet = (wallet: string) => {-->
<!--  if (!wallet) return ''-->
<!--  const firstPart = wallet.slice(0, 3)-->
<!--  const lastPart = wallet.slice(wallet.length - 3)-->
<!--  return `${firstPart}...${lastPart}`-->
<!--}-->

<!--const goToService = (url: string) => {-->
<!--  if (!url) return ''-->
<!--  window.open(url, '_blank')-->
<!--}-->

<!--async function copyWallet(wallet: string) {-->
<!--  if (!wallet) return-->
<!--  try {-->
<!--    await navigator.clipboard.writeText(wallet)-->
<!--  } catch (err) {-->
<!--    console.error('Ошибка копирования текста:', err)-->
<!--    alert('Не удалось скопировать текст.')-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss">-->
<!--.cell-link {-->
<!--  text-decoration: underline;-->
<!--  transition: opacity 0.15s ease-in;-->
<!--  cursor: pointer;-->

<!--  &:hover {-->
<!--    opacity: 0.7;-->
<!--  }-->
<!--}-->

<!--.cell-wallet-id {-->
<!--  cursor: pointer;-->
<!--  transition: opacity 0.15s ease-in;-->
<!--  min-width: 80px;-->

<!--  &:hover {-->
<!--    opacity: 0.7;-->
<!--  }-->
<!--}-->
<!--</style>-->
