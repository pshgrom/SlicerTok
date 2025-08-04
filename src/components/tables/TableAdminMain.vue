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
    <template #[`item.status_moderation`]="{ item }">
      <v-row no-gutters class="flex-nowrap" style="overflow-x: auto; white-space: nowrap">
        <v-col
          v-for="(group, groupName) in item.status_moderation"
          :key="groupName"
          class="pa-2"
          cols="auto"
          style="min-width: 250px"
        >
          <v-card
            class="pa-3"
            color="grey-lighten-4"
            variant="outlined"
            rounded
            style="border: none !important"
          >
            <div class="font-weight-medium text-primary mb-4">{{ formatLabel(groupName) }}</div>
            <div class="d-flex align-center mb-4">
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
            </div>
            <div style="color: #1867c0">
              <strong class="mr-4">Комментарий:</strong><br />
              {{ group.status_comment || '-' }}
            </div>
          </v-card>
        </v-col>
      </v-row>
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
      {{ formatDate(item.created_at) }}
    </template>
    <template #[`item.video_stat_link`]="{ item }">
      <a :href="item.video_stat_link" target="_blank" class="custom-table-ref">
        <span> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </a>
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="d-flex align-center" :class="{ 'justify-end': item.status === 'rejected' }">
        <VCusomButton
          v-if="item.status !== 'rejected'"
          :customClass="['light']"
          @click="actionRequest(item.id, 'rejected')"
        >
          Отклонить заявку
        </VCusomButton>
        <VCusomButton
          v-if="item.status !== 'awaiting_payment'"
          class="ml-4"
          :customClass="['dark']"
          @click="actionRequest(item.id, 'approved')"
        >
          Принять заявку
        </VCusomButton>
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
// import VCustomSelect from '@/components/base/VCustomSelect.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'
import {
  getTextStatus,
  getStatusColor,
  getIconSocial,
  getNameSocialMedia,
  getColor,
  getIcon
} from '@/utils/socials.ts'
import { formatDate } from '@/utils/formatDate.ts'
import VCusomButton from '@/components/base/VCusomButton.vue'

const emit = defineEmits(['changeStatus', 'saveComment', 'finishCheck', 'actionRequest'])

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

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const formatLabel = (label: string) => {
  switch (label) {
    case 'group_a':
      return 'Админ группы А'
    case 'group_b':
      return 'Админ группы B'
  }
}

const actionRequest = (id: number, status: string) => {
  emit('actionRequest', id, status)
}
</script>
