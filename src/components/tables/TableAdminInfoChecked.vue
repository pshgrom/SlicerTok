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
    <template v-slot:loading>
      <v-progress-circular indeterminate color="#0070ba"></v-progress-circular>
    </template>
    <template v-slot:[`item.url`]="{ item }">
      <a class="custom-table__link" :href="item.url" target="_blank">
        {{ formatUrl(item.url) }}
      </a>
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <v-chip :color="getStatusColor(item.status)">
        <div>{{ getTextStatus(item.status) }}</div>
      </v-chip>
    </template>
    <template v-slot:[`item.video_stat_link`]="{ item }">
      <a class="custom-table__link" :href="item.video_stat_link" target="_blank">
        {{ formatUrl(item.video_stat_link) }}
      </a>
    </template>
    <template v-slot:[`item.resource`]="{ item }">
      <div class="flex gap-4">
        <v-chip
          v-if="item.resource === 'INSTAGRAM'"
          class="social-chip instagram"
          text="Instagram"
          prepend-icon="mdi-instagram"
        />
        <v-chip
          v-else-if="item.resource === 'TIKTOK'"
          class="social-chip tiktok"
          text="TikTok"
          prepend-icon="mdi-music-note"
        />
        <v-chip
          v-else-if="item.resource === 'YOUTIBE'"
          class="social-chip youtube"
          text="YouTube"
          prepend-icon="mdi-youtube"
        />
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'

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

const formatUrl = (url: string) => {
  if (!url) return ''
  const firstPart = url.slice(0, 30)
  const lastPart = url.slice(url.length - 3)
  return `${firstPart}...${lastPart}`
}

const getTextStatus = (status: string) => {
  switch (status) {
    case 'create':
      return 'Новая'
    case 'approved':
      return 'Одобрено'
    case 'rejected':
      return 'Отклонено'
    default:
      return ''
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'create':
      return 'primary'
    case 'approved':
      return 'green'
    case 'rejected':
      return 'red'
    default:
      return ''
  }
}
</script>

<style lang="scss"></style>
