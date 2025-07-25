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
      <v-progress-circular indeterminate color="#0070ba"></v-progress-circular>
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
    <template #[`item.video_stat_link`]="{ item }">
      <a :href="item.video_stat_link" target="_blank" class="custom-table-ref">
        <span> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </a>
    </template>
    <template #[`item.number_views`]="{ item }">
      <div
        v-if="item.number_views"
        class="custom-table-views"
        :class="{ 'custom-table-views_cross': item.number_views_moderation }"
      >
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.number_views) }}</div>
      </div>
      <div v-if="item.number_views_moderation" class="custom-table-views">
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
    <template #[`item.rules`]="{ item }">
      <VCusomButton
        v-if="item.rules.length"
        :customClass="['light']"
        @click="showReasonsReject(item.rules)"
      >
        Показать
      </VCusomButton>
      <span v-else> - </span>
    </template>
  </v-data-table>
  <ReasonsRejectModal
    v-if="isModalOpen"
    v-model="isModalOpen"
    :currentReasonsReject="currentReasonsReject"
  />
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import { formatNumber } from '@/utils/formatNumbers'
import SvgIcon from '@/components/base/SvgIcon.vue'
import {
  getNameSocialMedia,
  getTextStatus,
  getStatusColor,
  getIconSocial,
  getColor,
  getIcon
} from '@/utils/socials.ts'
import ReasonsRejectModal from '@/components/modals/ReasonsRejectModal.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'

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
const isModalOpen = ref(false)
const currentReasonsReject = ref([])

const showReasonsReject = (rules) => {
  currentReasonsReject.value =
    rules.map((el, index) => `<p>${index + 1}. ${el.description}</p>`).join('<br>') || '-'
  isModalOpen.value = true
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
