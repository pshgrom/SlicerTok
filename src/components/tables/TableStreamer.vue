<template>
  <v-data-table
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
  >
    <template #loading>
      <v-progress-circular indeterminate color="rgb(169, 55, 244)" />
    </template>
    <template #[`item.status_moderation`]="{ item }">
      <v-row no-gutters class="flex-nowrap" style="overflow-x: auto; white-space: nowrap">
        <template v-for="(group, groupName) in item.status_moderation_admins" :key="groupName">
          <v-col
            v-if="groupName === 'group_a_current' || groupName === 'group_b_current'"
            cols="auto"
            style="min-width: 250px"
          >
            <v-card class="info-admin" variant="outlined" rounded style="border: none !important">
              <div class="info-admin__title">{{ formatLabel(groupName) }}</div>
              <div
                v-if="group.status"
                class="custom-table-chip"
                :style="{
                  'background-color': getStatusColor(group.status),
                  color: getColor(group.status)
                }"
              >
                <div class="custom-table-chip__icon">
                  <SvgIcon :name="getIcon(group.status)" />
                </div>
                <div class="custom-table-chip__status">
                  {{ getTextStatus(group.status) }}
                </div>
              </div>
              <div class="info-admin-comment">
                <div class="info-admin-comment__label">Комментарий:</div>
                <div class="info-admin-comment__value">{{ group.status_comment || '-' }}</div>
              </div>
              <div v-if="group.rules?.length" class="info-admin-comment">
                <div class="info-admin-comment__label mb-2">Нарушения:</div>
                <div class="info-admin-comment__value info-admin-comment__value_actions">
                  <v-menu
                    v-if="group.rules.length"
                    location="bottom"
                    open-on-hover
                    :close-on-content-click="false"
                    offset="4"
                  >
                    <template #activator="{ props }">
                      <VCusomButton
                        v-bind="props"
                        :custom-class="['light', 'avg', 'only-icon']"
                        @click.stop
                      >
                        <SvgIcon name="eye" />
                      </VCusomButton>
                    </template>
                    <div class="tooltip-content" v-html="showViolations(group.rules)"></div>
                  </v-menu>
                  <div class="badge">{{ group.rules?.length }}</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </template>
    <template #[`item.is_bonus`]="{ item }">
      <SvgIcon v-if="item.is_bonus" :name="'check'" />
    </template>
    <template #[`item.number_views`]="{ item }">
      <div v-if="item.number_views" class="custom-table-views">
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.number_views) }}</div>
      </div>
    </template>
    <template #[`item.url`]="{ item }">
      <a v-if="item.url" :href="item.url" target="_blank" class="custom-table-ref">
        <SvgIcon v-if="item.url" class="custom-table-ref__social" :name="getIconSocial(item.url)" />
        <span v-if="item.url">
          {{ getNameSocialMedia(item.url) }}
        </span>
        <SvgIcon name="arrow-up-right" />
      </a>
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
    <template #[`item.created_at`]="{ item }">
      <div style="min-width: 150px">{{ formatDate(item.created_at) }}</div>
    </template>
    <template #[`item.video_stat_link`]="{ item }">
      <button class="custom-table-ref" @click.stop>
        <span @click="openVideo(item.video_stat_link)"> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </button>
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="d-flex align-center">
        <v-tooltip text="Открыть заявку" location="bottom">
          <template #activator="{ props }">
            <VCusomButton v-bind="props" class="mr-1" :custom-class="['light', 'avg', 'only-icon']">
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
                item.status_moderation_streamer.current.status === 'todo' ||
                !item.status_moderation_streamer.current.status
              "
              @click.stop="finishCheck(item.id, item.status_moderation_streamer.current.status)"
            >
              <SvgIcon name="check-check" />
            </VCusomButton>
          </template>
        </v-tooltip>
        <v-tooltip text="Статус был обновлён" location="bottom">
          <template #activator="{ props }">
            <span
              v-if="item.status_moderation_streamer.current.is_complete"
              v-bind="props"
              class="updated-chip"
            >
              ●
            </span>
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
  <VideoPlayModal v-model="isModalOpenVideo" v-model:video-src="videoSrc" />
</template>

<script setup lang="ts">
import { computed, nextTick, type PropType, ref, watch } from 'vue'

import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import VideoPlayModal from '@/components/modals/VideoPlayModal.vue'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import { formatDate } from '@/utils/formatDate.ts'
import { formatNumber } from '@/utils/formatNumbers.ts'
import {
  getColor,
  getIcon,
  getIconSocial,
  getNameSocialMedia,
  getStatusColor,
  getTextStatus
} from '@/utils/socials.ts'

const emit = defineEmits(['rowClick', 'update:activePanel', 'finishCheck'])

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
  activePanel: {
    type: Boolean,
    default: false
  },
  selectedIndex: {
    type: Number,
    default: null
  }
})

const headersData = ref(props.headers)
const isModalOpenVideo = ref(false)
const videoSrc = ref('')
const tableRef = ref(null)

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const finishCheck = (id: number | string, status: string) => {
  if (status === 'todo' || !status) return
  emit('finishCheck', id)
}

const openVideo = (url: string) => {
  isModalOpenVideo.value = true
  videoSrc.value = url
}

const showViolations = (rules: any) => {
  const taskRules = props.items[0]?.task?.rules
  return taskRules
    .filter((tr) => rules.includes(tr.key))
    .map((tr) => tr.name_reverse)
    .map((name, index: number) => `${index + 1}. ${name}`)
    .join('<br>')
}

const formatLabel = (label: string) => {
  switch (label) {
    case 'group_a_current':
      return 'Админ группы А'
    case 'group_b_current':
      return 'Админ группы B'
  }
}

const rowProps = (item) => ({
  id: `row-${item.index}`,
  class: ['cursor-pointer', item.index === props.selectedIndex ? 'bg-blue-lighten-4' : ''],
  onClick: () => emit('rowClick', item)
})

watch(
  () => props.selectedIndex,
  async (newIndex) => {
    if (newIndex < 0) return
    await nextTick()
    const rowEl = tableRef.value?.$el.querySelector(`#row-${newIndex}`)
    if (rowEl) {
      rowEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }
)
</script>

<style lang="scss" scoped>
.info-admin {
  padding: 12px 12px 12px 0;

  &__title {
    font-weight: 500;
    font-size: 14px;
    color: rgba(17, 17, 17, 1);
    margin-bottom: 12px;
  }

  &-comment {
    margin-top: 10px;

    &__label {
      color: rgba(143, 150, 165, 1);
      font-size: 12px;
      font-weight: 500;
    }
    &__value {
      color: rgba(0, 0, 0, 1);
      font-size: 14px;
      line-height: 140%;

      &_actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.updated-chip {
  background: #e9ffe9;
  color: #0a8a0a;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 6px;
  margin-left: 8px;
}
</style>
