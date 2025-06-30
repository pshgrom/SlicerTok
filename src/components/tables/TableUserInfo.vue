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
        <img class="custom-table-ref__social" :src="getIconSocial(item.url)" alt="link" />
        <span>
          {{ getNameSocialMedia(item.url) }}
        </span>
        <img src="@/static/icons/arrow-up-right.svg" alt="link" />
      </a>
    </template>
    <template v-slot:[`item.video_stat_link`]="{ item }">
      <a :href="item.video_stat_link" target="_blank" class="custom-table-ref">
        <span> Смотреть </span>
        <img src="@/static/icons/arrow-up-right.svg" alt="link" />
      </a>
    </template>
    <template v-slot:[`item.number_views`]="{ item }">
      <div v-if="item.number_views" class="custom-table-views">
        <img src="@/static/icons/show.svg" alt="show" />
        {{ formatNumber(item.number_views) }}<br />
      </div>
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <div
        v-if="item.status"
        class="custom-table-chip"
        :style="{ 'background-color': getStatusColor(item.status), color: getColor(item.status) }"
      >
        <div class="custom-table-chip__icon">
          <img :src="getIcon(item.status)" alt="icon" />
        </div>
        <div class="custom-table-chip__status">{{ getTextStatus(item.status) }}</div>
      </div>
    </template>
    <!--    <template v-slot:[`item.status_comment`]="{ item }">-->
    <!--      <div style="white-space: pre-wrap">-->
    <!--        {{ item.status_comment || '—' }}-->
    <!--      </div>-->
    <!--    </template>-->
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import { formatNumber } from '@/utils/formatNumbers'

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
      return 'rgba(229, 236, 253, 1)'
    case 'approved':
      return 'rgba(187, 251, 228, 1)'
    case 'rejected':
      return 'rgba(255, 224, 224, 1)'
    default:
      return ''
  }
}

const getColor = (status: string) => {
  switch (status) {
    case 'create':
      return 'rgba(34, 93, 255, 1)'
    case 'approved':
      return 'rgba(16, 154, 106, 1)'
    case 'rejected':
      return 'rgba(255, 0, 0, 1)'
    default:
      return ''
  }
}

const getIcon = (status: string) => {
  let icon = ''
  switch (status) {
    case 'create':
      icon = 'status-new'
      break
    case 'approved':
      icon = 'status-ok'
      break
    case 'rejected':
      icon = 'status-bad'
      break
  }
  return `/icons/${icon}.svg`
}

const formatUrl = (url: string) => {
  if (!url) return ''
  const firstPart = url.slice(0, 30)
  const lastPart = url.slice(url.length - 3)
  return `${firstPart}...${lastPart}`
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
  if (icon) {
    return `/icons/${icon}.svg`
  }
  return ''
}

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})
</script>

<style lang="scss">
.cell-link {
  text-decoration: underline;
  transition: opacity 0.15s ease-in;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}

.social-chip {
  color: white !important;
  font-weight: bold !important;
}

.instagram {
  background: radial-gradient(circle at 30% 30%, #feda75, #d62976, #962fbf) !important;
}

.tiktok {
  background-color: #010101 !important;
  border: 1px solid #25f4ee !important;
  color: #25f4ee !important;
}

.youtube {
  background-color: #ff0000 !important;
}
</style>
