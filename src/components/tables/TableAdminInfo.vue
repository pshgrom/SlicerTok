<template>
  <v-data-table
    v-bind="$attrs"
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
    <template #[`item.user_created_at`]="{ item }">
      {{ formatDate(item.created_at) }}
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
    <!--    <template #[`item.is_verified`]="{ item }">-->
    <!--      <div-->
    <!--        class="custom-table-chip"-->
    <!--        :style="{-->
    <!--          'background-color': getVerifiedColor(item.is_verified),-->
    <!--          color: getVerifiedColor(item.is_verified)-->
    <!--        }"-->
    <!--      >-->
    <!--        <div class="custom-table-chip__icon">-->
    <!--          <SvgIcon :name="getVerifiedIcon(item.is_verified)" />-->
    <!--        </div>-->
    <!--        <div class="custom-table-chip__status">-->
    <!--          {{ getVerifiedStatus(item.is_verified) }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </template>-->
    <template #[`item.actions`]="{ item }">
      <div class="d-flex" style="min-width: 500px">
        <div class="custom-table__icon mr-2">
          <SvgIcon name="edit-row" @click="showDialog(item)" />
        </div>
        <VCusomButton
          class="custom-table__button"
          :customClass="['dark']"
          :disabled="item.status === 'todo' || !item.status"
          @click="finishCheck(item.id, item.status)"
          >Закончить проверку
        </VCusomButton>
        <VCusomButton
          class="custom-table__button ml-2"
          :customClass="['light']"
          @click="openMarkModal(item.id)"
          >Пометка
        </VCusomButton>
        <VCusomButton
          class="custom-table__button ml-2"
          :customClass="['dark']"
          :disabled="!!item.user_requires_verification"
          @click="requestVerification(item.id, item.user_requires_verification)"
          >Запросить верификацию
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
import { formatDate } from '@/utils/formatDate.ts'
import { computed, type PropType, ref } from 'vue'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
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

const emit = defineEmits(['finishCheck', 'changeState', 'saveMark', 'requestVerification'])

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

const getVerifiedColor = (is_verified: boolean) => {
  switch (is_verified) {
    case true:
      return 'rgba(187, 251, 228, 1)'
    case false:
      return 'rgba(255, 224, 224, 1)'
  }
}

const getVerifiedStatus = (is_verified: boolean) => {
  switch (is_verified) {
    case true:
      return 'Верифицирован'
    case false:
      return 'Не верифицирован'
  }
}

const getVerifiedIcon = (is_verified: boolean) => {
  let icon = ''
  switch (is_verified) {
    case true:
      icon = 'status-ok'
      break
    case false:
      icon = 'status-bad'
      break
  }
  return icon
}

const finishCheck = (id: number | string, status: string) => {
  if (status === 'todo' || !status) return
  emit('finishCheck', id)
}

const requestVerification = (id: number | string, userRequiresVerification: boolean) => {
  if (userRequiresVerification) return
  emit('requestVerification', id)
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

const changeState = (item: any, selectedTasks: any) => {
  emit('changeState', item, selectedTasks)
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
