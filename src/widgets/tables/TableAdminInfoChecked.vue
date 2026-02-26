<template>
  <v-data-table
    :headers="computedHeaders"
    :items="items"
    :loading="isLoading"
    :items-per-page="itemsPerPage"
    class="custom-table"
    height="70vh"
    fixed-header
    hover
    hide-default-footer
  >
    <template #loading>
      <v-progress-circular indeterminate color="rgb(169, 55, 244)" />
    </template>
    <template #[`item.url`]="{ item }">
      <a v-if="item.url" :href="item.url" target="_blank" class="custom-table-ref">
        <SvgIcon class="custom-table-ref__social" :name="getIconSocial(item.url)" />
        <span>
          {{ getNameSocialMedia(item.url) }}
        </span>
        <SvgIcon name="arrow-up-right" />
      </a>
    </template>
    <template #[`item.number_views`]="{ item }">
      <div
        v-if="item.number_views"
        class="custom-table-views"
        :class="{
          'custom-table-views_cross':
            item.status_moderation_admin.current.number_views_moderation &&
            item.number_views !== item.status_moderation_admin.current.number_views_moderation
        }"
      >
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.number_views) }}</div>
      </div>
      <div
        v-if="
          item.status_moderation_admin.current.number_views_moderation &&
          item.number_views !== item.status_moderation_admin.current.number_views_moderation
        "
        class="custom-table-views"
      >
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.status_moderation_admin.current.number_views_moderation) }}</div>
      </div>
    </template>
    <template #[`item.status`]="{ item }">
      <div
        v-if="item.status_moderation_admin.current.status"
        class="custom-table-chip"
        :style="{
          'background-color': getStatusColor(item.status_moderation_admin.current.status),
          color: getColor(item.status_moderation_admin.current.status)
        }"
      >
        <div class="custom-table-chip__icon">
          <SvgIcon :name="getIcon(item.status_moderation_admin.current.status)" />
        </div>
        <div class="custom-table-chip__status">
          {{ getTextStatus(item.status_moderation_admin.current.status) }}
        </div>
      </div>
    </template>
    <template #[`item.video_stat_link`]="{ item }">
      <button class="custom-table-ref" @click="openVideo(item.video_stat_link)">
        <span> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </button>
    </template>
  </v-data-table>
  <VideoPlayModal v-model="isModalOpenVideo" v-model:video-src="videoSrc" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, type PropType, ref } from 'vue'

import type { ITableHeaders, IUserInfoData } from '@/shared/config/types/app-model'
import {
  formatNumber,
  getColor,
  getIcon,
  getIconSocial,
  getNameSocialMedia,
  getStatusColor,
  getTextStatus,
  useTableHeaders
} from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'

const VideoPlayModal = defineAsyncComponent(() => import('@/widgets/modals/VideoPlayModal.vue'))

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
    default: 20
  }
})

const { computedHeaders } = useTableHeaders(props.headers)
const isModalOpenVideo = ref(false)
const videoSrc = ref('')

const openVideo = (url: string) => {
  isModalOpenVideo.value = true
  videoSrc.value = url
}
</script>
