<template>
  <v-data-table
    :headers="computedHeaders"
    :items="items"
    :loading="isLoading"
    :items-per-page="itemsPerPage"
    class="custom-table"
    hover
    hide-default-footer
  >
    <template #loading>
      <v-progress-circular indeterminate color="#0070ba" />
    </template>
    <template #[`item.wallet`]="{ item }">
      {{ item.wallet.address }}
    </template>
    <template #[`item.number_views`]="{ item }">
      <div>
        <div class="custom-table__increase">
          <v-icon class="mdi-eye" @click.stop="item.viewsDialog = true">visibility</v-icon>
        </div>
        <v-dialog v-model="item.viewsDialog" width="auto">
          <v-card title="Просмотры" class="text-center">
            <v-card-actions class="justify-start">
              <div class="cell-text">{{ item.number_views }}</div>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <template #[`item.nikname`]="{ item }">
      <div class="d-flex justify-space-between">
        <div class="cell-link" @click="goToTelegram(item.nikname)">
          {{ item.nikname }}
        </div>
      </div>
    </template>
    <template #[`item.publications`]="{ item }">
      <a
        v-for="el in item.publications"
        :key="el.id"
        class="custom-table__link"
        :href="el.url"
        target="_blank"
      >
        {{ el.url }}
      </a>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'

import type { IPayoutListItems, ITableHeaders } from '@/interfaces/AppModel'

const props = defineProps({
  headers: {
    type: Array as PropType<ITableHeaders[]>,
    default: () => []
  },
  items: {
    type: Array as PropType<IPayoutListItems[]>,
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

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const goToTelegram = (user: string) => {
  const url = `https://t.me/${user}`
  window.open(url, '_blank')
}
</script>
