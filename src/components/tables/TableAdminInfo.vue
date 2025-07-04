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
    <template v-slot:[`item.status`]="{ item }">
      <VCustomSelect
        v-model="item.status"
        :items="allStatuses"
        @updateStatus="changeStatus(item.id, item.status, item.status_comment)"
        :style="{ width: '140px' }"
      />
    </template>
    <template v-slot:[`item.status_comment`]="{ item }">
      <v-textarea
        v-model="item.status_comment"
        variant="underlined"
        label="Текст..."
        auto-grow
        rows="1"
        dense
        hide-details
        @blur="() => saveComment(item.id, item.status, item.status_comment)"
      />
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn
        size="small"
        :disabled="item.status === 'todo'"
        color="primary"
        @click="finishCheck(item.id)"
        >Закончить проверку</v-btn
      >
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue'
import { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import VCustomSelect from '@/components/base/VCustomSelect.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'

const emit = defineEmits(['changeStatus', 'saveComment', 'finishCheck'])

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

const finishCheck = (id: number) => {
  emit('finishCheck', id)
}

const saveComment = (id: number | string, status: string, status_comment: string) => {
  if (!status_comment) return
  emit('saveComment', id, status, status_comment)
}

const changeStatus = (id: number | string, status: string, status_comment: string) => {
  emit('changeStatus', id, status, status_comment)
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
