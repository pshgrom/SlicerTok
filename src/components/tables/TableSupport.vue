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
      <v-progress-circular indeterminate color="#0070ba" />
    </template>
    <template #[`item.url`]="{ item }">
      <a :href="item.url" target="_blank" class="custom-table-ref">
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
    <template #[`item.video_stat_link`]="{ item }">
      <a :href="item.video_stat_link" target="_blank" class="custom-table-ref">
        <span> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </a>
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
        <div class="mr-2 cursor-pointer">
          <SvgIcon name="edit-row" @click="showDialog(item)" />
        </div>
        <VCusomButton
          class="mr-4"
          :custom-class="['light']"
          @click="actionRequest(item.id, 'rejected')"
        >
          Отклонить заявку
        </VCusomButton>
        <VCusomButton :custom-class="['dark']" @click="actionRequest(item.id, 'approved')">
          Принять заявку
        </VCusomButton>
      </div>
    </template>
  </v-data-table>
  <DifferencesDialog
    v-model="dialog"
    v-model:current-item="currentItem"
    @change-final-values="changeFinalValues"
  />
  <!--  <ShowRulesModal v-if="showRules" v-model="showRules" :currentRules="currentRules" />-->
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'

import VCusomButton from '@/components/base/VCusomButton.vue'
import DifferencesDialog from '@/components/modals/DifferencesDialog.vue'
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

const emit = defineEmits(['actionRequest', 'changeFinalValues'])
const currentItem = ref({})
const dialog = ref(false)
const headersData = ref(props.headers)

// const showRules = ref(false)
// const currentRules = ref([])

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

const showViolations = (rules: any) => {
  return rules.map((el, index) => `${index + 1}. ${el.name_reverse}`).join('<br>') || '-'
}

const actionRequest = (id: number, status: string) => {
  emit('actionRequest', id, status)
}

const changeFinalValues = (data: any) => {
  emit('changeFinalValues', data)
}

const showDialog = (item) => {
  currentItem.value = {
    ...item
  }
  console.warn(currentItem.value)
  dialog.value = true
}

const formatLabel = (label: string) => {
  switch (label) {
    case 'group_a':
      return 'Админ группы А'
    case 'group_b':
      return 'Админ группы B'
  }
}
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
