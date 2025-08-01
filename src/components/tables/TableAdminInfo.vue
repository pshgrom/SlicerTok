<template>
  <v-data-table
    :headers="computedHeaders"
    :items="items"
    :loading="isLoading"
    :items-per-page="itemsPerPage"
    class="custom-table"
    hover
    height="80vh"
    fixed-header
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
        :class="{
          'custom-table-views_cross': showNumberViews(item)
        }"
      >
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.number_views) }}</div>
      </div>
      <div v-if="showNumberViews(item)" class="custom-table-views">
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
    <template #[`item.status_comment`]="{ item }">
      <p>{{ item.status_comment ? item.status_comment : '-' }}</p>
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="d-flex" style="min-width: 300px">
        <div class="custom-table__icon mr-2">
          <SvgIcon name="edit-row" @click="showDialog(item)" />
        </div>
        <VCusomButton
          class="custom-table__button"
          :customClass="['dark']"
          :disabled="item.status === 'todo' || !item.status"
          @click="finishCheck(item.id)"
          >Закончить проверку
        </VCusomButton>
        <VCusomButton
          class="custom-table__button ml-2"
          :customClass="['light']"
          @click="openMarkModal(item.id)"
          >Пометка
        </VCusomButton>
      </div>
    </template>
  </v-data-table>
  <ModerationDialog
    v-model="dialog"
    v-model:currentItem="currentItem"
    @change-state="changeState"
  />
  <AddMarkModal v-if="isModalOpen" v-model="isModalOpen" @save="saveMark" />
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import SvgIcon from '@/components/base/SvgIcon.vue'
import { formatNumber } from '@/utils/formatNumbers.ts'
import {
  getNameSocialMedia,
  getIconSocial,
  getStatusColor,
  getColor,
  getIcon,
  getTextStatus
} from '@/utils/socials.ts'
import ModerationDialog from '@/components/modals/ModerationDialog.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import AddMarkModal from '@/components/modals/AddMarkModal.vue'

const emit = defineEmits(['finishCheck', 'changeState', 'saveMark'])

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
const dialog = ref(false)
const currentItem = ref({})
const isModalOpen = ref(false)
const markId = ref<null | number>(null)

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const showNumberViews = (item) => {
  return (
    item.number_views_moderation &&
    item.number_views !== item.number_views_moderation &&
    item.number_views_moderation !== '0'
  )
}

const finishCheck = (id: number | string) => {
  emit('finishCheck', id)
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
    number_views_moderation: item.number_views_moderation ?? ''
  }
  dialog.value = true
}

const changeState = (item: any, selectedTasks: any, additionalCheck: boolean) => {
  emit('changeState', item, selectedTasks, additionalCheck)
}
</script>

<style lang="scss" scoped>
.custom-table__button {
  display: none;
}
.custom-table__icon {
  display: none;
  cursor: pointer;

  &:hover {
    :deep(svg) {
      & > path {
        fill: rgba(229, 236, 253, 1);
        stroke: rgba(0, 212, 254, 1);
      }
    }
  }
}

:deep(.v-data-table__tr) {
  &:hover {
    .custom-table__icon,
    .custom-table__button {
      display: block;
    }
  }
}
</style>
