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
            item.number_views_moderation && item.number_views !== item.number_views_moderation
        }"
      >
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.number_views) }}</div>
      </div>
      <div
        v-if="item.number_views_moderation && item.number_views !== item.number_views_moderation"
        class="custom-table-views"
      >
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.number_views_moderation) }}</div>
      </div>
    </template>
    <template #[`item.status`]="{ item }">
      <div
        v-if="item.status"
        class="custom-table-chip"
        :style="{
          'background-color': getStatusColor(item.status),
          color: getColor(item.status)
        }"
      >
        <div class="custom-table-chip__icon">
          <SvgIcon :name="getIcon(item.status)" />
        </div>
        <div class="custom-table-chip__status">
          {{ getTextStatus(item.status) }}
        </div>
      </div>
    </template>
    <template #[`item.video_stat_link`]="{ item }">
      <a
        v-if="item.video_stat_link"
        :href="item.video_stat_link"
        target="_blank"
        class="custom-table-ref"
      >
        <span> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </a>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'

import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import { formatNumber } from '@/utils/formatNumbers.ts'
import {
  getColor,
  getIcon,
  getIconSocial,
  getNameSocialMedia,
  getStatusColor,
  getTextStatus
} from '@/utils/socials.ts'

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
</script>
