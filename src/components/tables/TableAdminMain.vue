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
          <v-card class="pa-3" color="grey-lighten-4" variant="outlined" rounded>
            <div class="font-weight-medium text-primary mb-4">{{ formatLabel(groupName) }}</div>
            <div class="d-flex align-center mb-4">
              <strong class="mr-4" style="color: #1867c0">Статус:</strong>
              <v-chip :color="getStatusColor(group.status)">
                <div>{{ getTextStatus(group.status) }}</div>
              </v-chip>
            </div>
            <div style="color: #1867c0">
              <strong class="mr-4">Комментарий:</strong>
              {{ group.status_comment }}
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
      <v-chip :color="getStatusColor(item.status)">
        <div>{{ getTextStatus(item.status) }}</div>
      </v-chip>
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
  getNameSocialMedia
} from '@/utils/socials.ts'
import { formatDate } from '@/utils/formatDate.ts'

defineEmits(['changeStatus', 'saveComment', 'finishCheck'])

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
</script>
