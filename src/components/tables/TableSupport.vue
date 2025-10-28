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
    <template #[`item.video_stat_link`]="{ item }">
      <div class="custom-table-ref" @click.stop>
        <span @click="openVideo(item.video_stat_link)"> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </div>
    </template>
    <template #[`item.status_moderation`]="{ item }">
      <v-row no-gutters class="flex-nowrap" style="overflow-x: auto; white-space: nowrap">
        <v-col
          v-for="(group, groupName) in item.status_moderation"
          :key="groupName"
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
            <div class="info-admin-comment">
              <div class="info-admin-comment__label">Нарушения:</div>
              <div class="info-admin-comment__value" v-html="showViolations(group.rules)"></div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="d-flex align-center">
        <v-tooltip text="Открыть заявку" location="bottom">
          <template #activator="{ props }">
            <VCusomButton
              v-bind="props"
              class="mr-1"
              :custom-class="['light', 'avg', 'only-icon']"
              @click="showDialog(item)"
            >
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
              @click="actionRequest(item.is_problem_solved, item.id)"
            >
              <SvgIcon name="check-check" />
            </VCusomButton>
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
  <DifferencesDialog
    v-model="dialogModel"
    v-model:current-item="currentItem"
    @change-final-values="changeFinalValues"
  />
  <VideoPlayModal v-if="isModalOpenVideo" v-model="isModalOpenVideo" v-model:video-src="videoSrc" />
  <!--  <ShowRulesModal v-if="showRules" v-model="showRules" :currentRules="currentRules" />-->
</template>

<script setup lang="ts">
import { computed, nextTick, type PropType, ref, watch } from 'vue'

import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import DifferencesDialog from '@/components/modals/DifferencesDialog.vue'
import VideoPlayModal from '@/components/modals/VideoPlayModal.vue'
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
// import ShowRulesModal from '@/components/modals/ShowRulesModal.vue'

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
  selectedIndex: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['actionRequest', 'changeFinalValues', 'update:modelValue', 'rowClick'])
const currentItem = ref({})
const headersData = ref(props.headers)

const isModalOpenVideo = ref(false)
const videoSrc = ref('')
const tableRef = ref(null)

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

// const openRules = (group) => {
//   // currentRules.value = group.rules
//   // showRules.value = true
// }
const openVideo = (url: string) => {
  isModalOpenVideo.value = true
  videoSrc.value = url
}

const showViolations = (rules: any) => {
  return rules.map((el, index) => `${index + 1}. ${el.name_reverse}`).join('<br>') || '-'
}

const actionRequest = (is_problem_solved: boolean, id: number) => {
  if (is_problem_solved) emit('actionRequest', id)
}

const rowProps = (item) => ({
  id: `row-${item.index}`,
  class: ['cursor-pointer', item.index === props.selectedIndex ? 'bg-blue-lighten-4' : ''],
  onClick: () => emit('rowClick', item)
})

const changeFinalValues = (data: any) => {
  emit('changeFinalValues', data)
}

const showDialog = (item) => {
  currentItem.value = {
    ...item
  }
  dialogModel.value = true
}

const formatLabel = (label: string) => {
  switch (label) {
    case 'group_a':
      return 'Админ группы А'
    case 'group_b':
      return 'Админ группы B'
  }
}

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
    }
  }
}
</style>
