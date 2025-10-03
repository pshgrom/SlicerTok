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
<!--      <v-progress-circular indeterminate color="rgb(169, 55, 244)"></v-progress-circular>-->
<!--    </template>-->
<!--    <template v-slot:[`item.wallet_id_interaction`]="{ item }">-->
<!--      <div class="d-flex">-->
<!--        <div @click="item.showWallet = true" class="cell-wallet-id">-->
<!--          {{ formatWallet(item.wallet_id_interaction) }}-->
<!--        </div>-->
<!--        <v-btn size="x-small" class="ml-4" @click="copyWallet(item.wallet_id_interaction)"-->
<!--          >Copy</v-btn-->
<!--        >-->
<!--        <v-btn-->
<!--          size="x-small"-->
<!--          color="primary"-->
<!--          class="ml-4"-->
<!--          :disabled="!item.wallet_id_interaction"-->
<!--          @click="goToService(item.wallet_id_interaction)"-->
<!--          >Link</v-btn-->
<!--        >-->
<!--      </div>-->
<!--      <v-dialog v-model="item.showWallet" width="auto">-->
<!--        <v-card title="Текущий кошелек" class="text-center">-->
<!--          <v-card-actions class="d-flex flex-column align-start">-->
<!--            {{ item.wallet_id_interaction }}-->
<!--          </v-card-actions>-->
<!--        </v-card>-->
<!--      </v-dialog>-->
<!--    </template>-->
<!--    <template v-slot:[`item.wallet_id_out`]="{ item }">-->
<!--      <div>-->
<!--        <div class="custom-table__increase">-->
<!--          <v-icon @click.stop="item.viewsDialog = true" class="mdi-eye">visibility</v-icon>-->
<!--        </div>-->
<!--        <v-dialog v-model="item.viewsDialog" width="800px">-->
<!--          <v-card title="Кошельки" class="text-center">-->
<!--            <v-card-actions class="d-flex align-start flex-wrap justify-center">-->
<!--              <v-chip-->
<!--                v-for="el in item.wallet_id_out"-->
<!--                :key="el"-->
<!--                :color="'green'"-->
<!--                @click="goToService(el)"-->
<!--                class="mb-2 ml-2 mr-2 mt-2 cell-wallet"-->
<!--                style="width: 45%"-->
<!--              >-->
<!--                {{ el }}-->
<!--              </v-chip>-->
<!--            </v-card-actions>-->
<!--          </v-card>-->
<!--        </v-dialog>-->
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

<!--const formatWallet = (wallet: string) => {-->
<!--  if (!wallet) return ''-->
<!--  const firstPart = wallet.slice(0, 3)-->
<!--  const lastPart = wallet.slice(wallet.length - 3)-->
<!--  return `${firstPart}...${lastPart}`-->
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

<!--const goToService = (url: string) => {-->
<!--  if (!url) return ''-->
<!--  const fullUrl = `https://tronscan.org/#/address/${url}/transfers`-->
<!--  window.open(fullUrl, '_blank')-->
<!--}-->

<!--const computedHeaders = computed<ITableHeaders[]>({-->
<!--  get() {-->
<!--    return headersData.value-->
<!--  },-->
<!--  set(val) {-->
<!--    headersData.value = val-->
<!--  }-->
<!--})-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--.cell-wallet {-->
<!--  transition: transform 0.15s ease-in;-->
<!--  &:hover {-->
<!--    transform: scale(1.1);-->
<!--  }-->
<!--}-->
<!--</style>-->
