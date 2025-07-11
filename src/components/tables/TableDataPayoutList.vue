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
    <template v-slot:[`item.wallet`]="{ item }">
      {{ item.wallet.address }}
    </template>
    <template v-slot:[`item.number_views`]="{ item }">
      <div>
        <div class="custom-table__increase">
          <v-icon @click.stop="item.viewsDialog = true" class="mdi-eye">visibility</v-icon>
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
    <template v-slot:[`item.nikname`]="{ item }">
      <div class="d-flex justify-space-between">
        <div @click="goToTelegram(item.nikname)" class="cell-link">
          {{ item.nikname }}
        </div>
      </div>
    </template>
    <template v-slot:[`item.publications`]="{ item }">
      <a
        class="custom-table__link"
        :href="el.url"
        target="_blank"
        v-for="el in item.publications"
        :key="el.id"
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
