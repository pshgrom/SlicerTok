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
      <a :href="item.url" target="_blank" class="custom-table-ref">
        <SvgIcon class="custom-table-ref__social" :name="getIconSocial(item.url)" />
        <span>
          {{ getNameSocialMedia(item.url) }}
        </span>
        <SvgIcon name="arrow-up-right" />
      </a>
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <v-chip :color="getStatusColor(item.status)">
        <div>{{ getTextStatus(item.status) }}</div>
      </v-chip>
    </template>
    <template v-slot:[`item.video_stat_link`]="{ item }">
      <a :href="item.video_stat_link" target="_blank" class="custom-table-ref">
        <span> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
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
import { computed, type PropType, ref } from 'vue'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import SvgIcon from '@/components/base/SvgIcon.vue'

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

const getNameSocialMedia = (url: string) => {
  if (url.includes('inst')) {
    return 'Instagram'
  } else if (url.includes('tik')) {
    return 'TikTok'
  } else if (url.includes('shorts')) {
    return 'Shorts'
  } else if (url.includes('vk')) {
    return 'VK Video'
  }
}

const getIconSocial = (url: string) => {
  let icon = ''
  if (url.includes('inst')) {
    icon = 'instagram'
  } else if (url.includes('tik')) {
    icon = 'tiktok'
  } else if (url.includes('shorts')) {
    icon = 'shorts'
  } else if (url.includes('vk')) {
    icon = 'vk'
  }
  return icon
}
</script>

<style lang="scss"></style>
