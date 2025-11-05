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
    <template #no-data>
      <div class="empty-table">
        <div class="empty-table__img">
          <SvgIcon name="request-empty" />
        </div>
        <div class="empty-table__text">
          У вас пока нет заявок.<br />
          Подайте ваше первую заявку.
        </div>
      </div>
    </template>
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
    <template #[`item.video_stat_link`]="{ item }">
      <div class="custom-table-ref" @click.stop>
        <span @click="openVideo(item.video_stat_link)"> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </div>
    </template>
    <template #[`item.expected_reward`]="{ item }">
      <div>~ {{ formatCompactUSD(item.expected_reward) }}</div>
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
      <div class="d-flex gap-4">
        <VCusomButton
          v-if="item.rules.length"
          :custom-class="['light']"
          class="mr-2"
          @click="showReasonsReject(item.rules)"
        >
          Показать
        </VCusomButton>
        <v-tooltip text="Переподать видео" location="bottom">
          <template #activator="{ props }">
            <VCusomButton
              v-if="item.is_resubmission"
              v-bind="props"
              :custom-class="['light', 'only-icon']"
              @click="resubmissionPublication(item)"
            >
              <SvgIcon name="resend" />
            </VCusomButton>
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
  <ReasonsRejectModal
    v-if="isModalOpen"
    v-model="isModalOpen"
    :current-reasons-reject="currentReasonsReject"
  />
  <VideoPlayModal v-model="isModalOpenVideo" v-model:video-src="videoSrc" />
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'

import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import ReasonsRejectModal from '@/components/modals/ReasonsRejectModal.vue'
import VideoPlayModal from '@/components/modals/VideoPlayModal.vue'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import { formatCompactUSD, formatNumber } from '@/utils/formatNumbers'
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
    default: 20
  }
})

const emit = defineEmits(['resubmissionPublication'])

const isModalOpenVideo = ref(false)
const videoSrc = ref('')
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

const resubmissionPublication = (item) => {
  emit('resubmissionPublication', item)
}

const openVideo = (url: string) => {
  isModalOpenVideo.value = true
  videoSrc.value = url
}
</script>
