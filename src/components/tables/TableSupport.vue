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
    <template v-slot:loading>
      <v-progress-circular indeterminate color="#0070ba"></v-progress-circular>
    </template>
    <template v-slot:[`item.url`]="{ item }">
      <a :href="item.url" target="_blank" class="custom-table-ref">
        <SvgIcon class="custom-table-ref__social" :name="getIconSocial(item.url)" />
        <span>
          {{ getNameSocialMedia(item.url) }}
        </span>
        <SvgIcon name="arrow-up-right" />
      </a>
    </template>
    <template v-slot:[`item.video_stat_link`]="{ item }">
      <a :href="item.video_stat_link" target="_blank" class="custom-table-ref">
        <span> Смотреть </span>
        <SvgIcon name="arrow-up-right" />
      </a>
    </template>
    <template v-slot:[`item.status_moderation`]="{ item }">
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
              <v-btn class="ml-2" icon size="24" @click="openModal(group.id)">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </div>
            <div style="color: #1867c0">
              <strong class="mr-4">Комментарий:</strong>
              {{ group.status_comment }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-table>
  <CheckDialog
    v-if="openDialog"
    v-model="openDialog"
    :currentIdStatus="currentIdStatus"
    @returnRecord="returnRecord"
  />
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import CheckDialog from '@/components/modals/CheckDialog.vue'
import { ISupportSaveStatus } from '@/interfaces/ISupport'
import SvgIcon from '@/components/base/SvgIcon.vue'

const emit = defineEmits(['returnRecord'])

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

const openDialog = ref(false)
const currentIdStatus = ref<null | number>(null)

const allStatuses = [
  {
    label: 'Новая',
    value: 'create',
    disabled: true
  },
  {
    label: 'Одобрено',
    value: 'approved'
  },
  {
    label: 'Отклонено',
    value: 'rejected'
  }
]

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const openModal = (id: number) => {
  currentIdStatus.value = id
  openDialog.value = true
}

const returnRecord = (data: ISupportSaveStatus) => {
  emit('returnRecord', data)
}

const getTextStatus = (status: string) => {
  switch (status) {
    case 'create':
      return 'Новая'
    case 'approved':
      return 'Одобрено'
    case 'rejected':
      return 'Отклонено'
    default:
      return ''
  }
}

const formatLabel = (label: string) => {
  switch (label) {
    case 'group_a':
      return 'Админ группы А'
    case 'group_b':
      return 'Админ группы B'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'create':
      return 'primary'
    case 'approved':
      return 'green'
    case 'rejected':
      return 'red'
    default:
      return ''
  }
}

const getNameSocialMedia = (url: string) => {
  if (url.includes('inst')) {
    return 'Instagram'
  } else if (url.includes('tik')) {
    return 'TikTok'
  } else if (url.includes('shorts')) {
    return 'Shorts'
  } else if (url.includes('vk')) {
    return 'VK Video'
  }
}

const getIconSocial = (url: string) => {
  let icon = ''
  if (url.includes('inst')) {
    icon = 'instagram'
  } else if (url.includes('tik')) {
    icon = 'tiktok'
  } else if (url.includes('shorts')) {
    icon = 'shorts'
  } else if (url.includes('vk')) {
    icon = 'vk'
  }
  return icon
}

const formatUrl = (url: string) => {
  if (!url) return ''
  const firstPart = url.slice(0, 30)
  const lastPart = url.slice(url.length - 3)
  return `${firstPart}...${lastPart}`
}
</script>

<style lang="scss">
.cell-link {
  text-decoration: underline;
  transition: opacity 0.15s ease-in;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}

.custom-table__link {
  cursor: pointer;
  transition: opacity 0.15s ease-in;
  border-bottom: 1px solid transparent;

  &:hover {
    opacity: 0.7;
    border-color: #000;
  }
}
</style>
