<template>
  <v-data-table
    v-bind="$attrs"
    ref="tableRef"
    :headers="computedHeaders"
    :items="items"
    :loading="isLoading"
    :items-per-page="itemsPerPage"
    class="custom-table"
    hover
    height="70vh"
    fixed-header
    hide-default-footer
    :row-props="rowProps"
    @update:sort-by="onSortChange"
    @update:sort-desc="onSortChange"
  >
    <template #loading>
      <v-progress-circular indeterminate color="rgb(169, 55, 244)" />
    </template>

    <template #[`item.url`]="{ item }">
      <a v-if="item.url" :href="item.url" target="_blank" class="custom-table-ref" @click.stop>
        <SvgIcon class="custom-table-ref__social" :name="getIconSocial(item.url)" />
        <span>
          {{ getNameSocialMedia(item.url) }}
        </span>
        <SvgIcon name="arrow-up-right" />
      </a>
    </template>
    <template #[`item.user_created_at`]="{ item }">
      <div style="min-width: 150px">{{ formatDate(item.user_created_at) }}</div>
    </template>
    <template #[`item.created_at`]="{ item }">
      <div style="min-width: 150px">{{ formatDate(item.created_at) }}</div>
    </template>
    <template #[`item.video_stat_link`]="{ item }">
      <button class="custom-table-ref" @click="openVideo(item.video_stat_link)">
        <span> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </button>
    </template>
    <template #[`item.number_views`]="{ item }">
      <div
        v-if="item.number_views"
        class="custom-table-views"
        :class="{
          'custom-table-views_cross': showNumberViews(item)
        }"
      >
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.number_views) }}</div>
      </div>
      <div v-if="showNumberViews(item)" class="custom-table-views">
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.status_moderation_admin.current.number_views_moderation) }}</div>
      </div>
    </template>
    <template #[`item.status`]="{ item }">
      <div class="d-flex align-center ga-2">
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
        <v-tooltip text="Было переподано" location="bottom">
          <template #activator="{ props: activatorProps }">
            <VCusomButton
              v-if="item.status_moderation_admin.old?.length"
              v-bind="activatorProps"
              :custom-class="['light', 'avg', 'only-icon']"
              @click.stop="openHistory(item)"
            >
              <SvgIcon name="rotate" />
            </VCusomButton>
          </template>
        </v-tooltip>
      </div>
    </template>
    <template #[`item.status_comment`]="{ item }">
      <p>{{ item.status_moderation_admin?.current?.status_comment || '-' }}</p>
    </template>
    <template #[`item.is_bonus`]="{ item }">
      <SvgIcon v-if="item.is_bonus" :name="'check'" />
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="d-flex">
        <v-tooltip text="Запросить верификацию" location="bottom">
          <template #activator="{ props }">
            <VCusomButton
              v-bind="props"
              class="mr-3"
              :custom-class="[themeStore.current !== 'dark' ? 'light' : '', 'avg', 'only-icon']"
              :disabled="!!item.user_requires_verification"
              @click.stop="requestVerification(item.id, item.user_requires_verification)"
            >
              <SvgIcon name="request-verification" />
            </VCusomButton>
          </template>
        </v-tooltip>
        <v-tooltip text="Пометка" location="bottom">
          <template #activator="{ props }">
            <VCusomButton
              v-bind="props"
              class="mr-1"
              :custom-class="[themeStore.current !== 'dark' ? 'light' : '', 'avg', 'only-icon']"
              @click.stop="openMarkModal(item.id)"
            >
              <SvgIcon name="sticky-note" />
            </VCusomButton>
          </template>
        </v-tooltip>
        <v-tooltip text="Открыть заявку" location="bottom">
          <template #activator="{ props }">
            <VCusomButton
              v-bind="props"
              class="mr-1"
              :custom-class="[themeStore.current !== 'dark' ? 'light' : '', 'avg', 'only-icon']"
              @click="showDialog(item)"
            >
              <SvgIcon name="open-modal" />
            </VCusomButton>
          </template>
        </v-tooltip>
        <v-tooltip text="Закончить проверку" location="bottom">
          <template #activator="{ props }">
            <VCusomButton
              v-bind="props"
              :custom-class="['dark', 'avg', 'only-icon']"
              :disabled="
                item.status_moderation_admin.current.status === 'todo' ||
                !item.status_moderation_admin.current.status
              "
              @click.stop="finishCheck(item.id, item.status_moderation_admin.current.status)"
            >
              <SvgIcon name="check-check" />
            </VCusomButton>
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
  <AddMarkModal v-if="isModalOpen" v-model="isModalOpen" @save="saveMark" />
  <VideoPlayModal v-model="isModalOpenVideo" v-model:video-src="videoSrc" />
  <OldHistoryModal
    v-model="showOldHistory"
    :item-history="itemHistory"
    :id-item-history="idItemHistory"
  />
</template>

<script setup lang="ts">
import { defineAsyncComponent, type PropType, ref } from 'vue'

import { useThemeStore } from '@/app/stores'
import type { ITableHeaders, IUserInfoData } from '@/shared/config/types/app-model'
import {
  formatDate,
  formatNumber,
  getColor,
  getIcon,
  getIconSocial,
  getNameSocialMedia,
  getStatusColor,
  getTextStatus,
  useTableHeaders,
  useTableRowScroll
} from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'
import VCusomButton from '@/shared/ui/VCusomButton.vue'

const AddMarkModal = defineAsyncComponent(() => import('@/widgets/modals/AddMarkModal.vue'))
const OldHistoryModal = defineAsyncComponent(() => import('@/widgets/modals/OldHistoryModal.vue'))
const VideoPlayModal = defineAsyncComponent(() => import('@/widgets/modals/VideoPlayModal.vue'))

const emit = defineEmits([
  'finishCheck',
  'saveMark',
  'requestVerification',
  'customSort',
  'rowClick'
])

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
  },
  selectedIndex: {
    type: Number,
    default: null
  }
})

const { computedHeaders } = useTableHeaders(props.headers)
const dialog = ref(false)
const currentItem = ref({})
const isModalOpen = ref(false)
const themeStore = useThemeStore()
const itemHistory = ref({})
const idItemHistory = ref(null)
const isModalOpenVideo = ref(false)
const videoSrc = ref('')
const markId = ref<null | number>(null)
const tableRef = ref(null)
const showOldHistory = ref(false)

const rowProps = (item) => ({
  id: `row-${item.index}`,
  class: ['cursor-pointer'],
  style: item.index === props.selectedIndex ? { background: 'rgb(var(--v-theme-chipBg))' } : {},
  onClick: () => emit('rowClick', item)
})

useTableRowScroll(tableRef, () => props.selectedIndex)

const showNumberViews = (item) => {
  return (
    item.status_moderation_admin.current.number_views_moderation &&
    item.number_views !== item.status_moderation_admin.current.number_views_moderation &&
    item.status_moderation_admin.current.number_views_moderation !== '0'
  )
}

const openHistory = (item) => {
  itemHistory.value = item.status_moderation_admin.old
  idItemHistory.value = item.id
  showOldHistory.value = true
}

const openVideo = (url: string) => {
  isModalOpenVideo.value = true
  videoSrc.value = url
}

const finishCheck = (id: number | string, status: string) => {
  if (status === 'todo' || !status) return
  emit('finishCheck', id)
}

const requestVerification = (id: number | string, userRequiresVerification: boolean) => {
  if (userRequiresVerification) return
  emit('requestVerification', id)
}

const onSortChange = (newSort) => {
  let data = ''
  if (newSort.length) {
    const { key, order } = newSort[0]
    data = {
      [`sort_${key}`]: order.toUpperCase()
    }
  } else {
    data = ''
  }

  emit('customSort', data)
}

const openMarkModal = (id: number | null) => {
  isModalOpen.value = true
  markId.value = id
}

const saveMark = async (mark: string) => {
  const newData = {
    id: markId.value,
    text: mark
  }
  emit('saveMark', newData)
}

const showDialog = (item) => {
  currentItem.value = {
    ...item,
    number_views_moderation: item.status_moderation_admin.current.number_views_moderation ?? ''
  }
  dialog.value = true
}
</script>
