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
      <p>{{ getStatus(item.status) }}</p>
    </template>
    <template #[`item.status_comment`]="{ item }">
      <p>{{ item.status_comment ? item.status_comment : '-' }}</p>
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="d-flex" style="min-width: 210px">
        <div class="custom-table__icon mr-2">
          <SvgIcon name="edit-row" @click="showDialog(item)" />
        </div>
        <VCusomButton
          class="custom-table__button"
          size="small"
          :disabled="item.status === 'todo'"
          color="primary"
          @click="finishCheck(item.id)"
          >Закончить проверку
        </VCusomButton>
      </div>
    </template>
  </v-data-table>
  <ModerationDialog
    v-if="dialog"
    v-model="dialog"
    v-model:currentItem="currentItem"
    @change-state="changeState"
  />
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import SvgIcon from '@/components/base/SvgIcon.vue'
import { formatNumber } from '@/utils/formatNumbers.ts'
import { getNameSocialMedia, getIconSocial } from '@/utils/socials.ts'
import ModerationDialog from '@/components/modals/ModerationDialog.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'

const emit = defineEmits(['finishCheck', 'changeState'])

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

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const finishCheck = (id: number) => {
  emit('finishCheck', id)
}

const getStatus = (status: string) => {
  let formatStatus = ''
  switch (status) {
    case 'todo':
      formatStatus = 'Новая'
      break
    case 'approved':
      formatStatus = 'Одобрено'
      break
    case 'rejected':
      formatStatus = 'Отклонено'
      break
  }
  return formatStatus
}

const showDialog = (item) => {
  currentItem.value = {
    ...item,
    number_views: item.number_views ?? ''
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
