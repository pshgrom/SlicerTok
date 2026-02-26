<template>
  <v-data-table
    ref="tableRef"
    :headers="computedHeaders"
    :items="items"
    :loading="isLoading"
    :items-per-page="itemsPerPage"
    class="custom-table"
    hover
    :row-props="rowProps"
    height="70vh"
    fixed-header
    hide-default-footer
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
    <template #[`item.is_bonus`]="{ item }">
      <SvgIcon v-if="item.is_bonus" :name="'check'" />
    </template>
    <template #[`item.number_views`]="{ item }">
      <div
        v-if="item.number_views"
        class="custom-table-views"
        :class="{
          'custom-table-views_cross':
            item.status_moderation_admin?.current?.number_views_moderation &&
            item.number_views !== item.status_moderation_admin?.current?.number_views_moderation
        }"
      >
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.number_views) }}</div>
      </div>
      <div
        v-if="
          item.status_moderation_admin?.current?.number_views_moderation &&
          item.number_views !== item.status_moderation_admin?.current?.number_views_moderation
        "
        class="custom-table-views"
      >
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.status_moderation_admin.current.number_views_moderation) }}</div>
      </div>
    </template>
    <template #[`item.video_stat_link`]="{ item }">
      <button class="custom-table-ref" @click.stop>
        <span @click="openVideo(item.video_stat_link)"> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </button>
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
                        <SvgIcon name="show" />
                      </VCusomButton>
                    </template>
                    <div class="tooltip-content" v-html="sanitizeHtml(showViolations(group.rules))"></div>
                  </v-menu>
                  <div class="badge">{{ group.rules?.length }}</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </template>
      </v-row>
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
        <v-tooltip text="Разрешить спор" location="bottom">
          <template #activator="{ props }">
            <VCusomButton
              v-bind="props"
              :disabled="!item.is_problem_solved"
              :custom-class="['dark', 'avg', 'only-icon']"
              @click.stop="actionRequest(item.is_problem_solved, item.id)"
            >
              <SvgIcon name="check-check" />
            </VCusomButton>
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
  <VideoPlayModal v-model="isModalOpenVideo" v-model:video-src="videoSrc" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, type PropType, ref, watch } from 'vue'

import type { ITableHeaders, IUserInfoData } from '@/shared/config/types/app-model'
import {
  formatLabel,
  formatNumber,
  getColor,
  getIcon,
  getIconSocial,
  getNameSocialMedia,
  getStatusColor,
  getTextStatus,
  sanitizeHtml
} from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'
import VCusomButton from '@/shared/ui/VCusomButton.vue'

const VideoPlayModal = defineAsyncComponent(
  () => import('@/widgets/modals/VideoPlayModal.vue')
)

const props = defineProps({
  headers: {
    type: Array as PropType<ITableHeaders[]>,
    default: () => []
  },
  modelValue: Boolean,
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

const emit = defineEmits(['actionRequest', 'update:modelValue', 'rowClick', 'update:activePanel'])
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

const activePanelVal = computed({
  get() {
    return props.activePanel
  },
  set(val) {
    emit('update:activePanel', val)
  }
})

const openVideo = (url: string) => {
  isModalOpenVideo.value = true
  videoSrc.value = url
}

const showViolations = (rules: any) => {
  const taskRules = props.items[0]?.task?.rules
  return taskRules
    .filter((tr) => rules.includes(tr.key))
    .map((tr) => tr.name_reverse)
    .map((name, index) => `${index + 1}. ${name}`)
    .join('<br>')
}

const actionRequest = (is_problem_solved: boolean, id: number) => {
  if (is_problem_solved) emit('actionRequest', id)
  activePanelVal.value = false
}

const rowProps = (item) => ({
  id: `row-${item.index}`,
  class: ['cursor-pointer'],
  style: item.index === props.selectedIndex ? { background: 'rgb(var(--v-theme-chipBg))' } : {},
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
    color: rgb(var(--v-theme-primary));
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
      color: rgb(var(--v-theme-primary));
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
</style>
