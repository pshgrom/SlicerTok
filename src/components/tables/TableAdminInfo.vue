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
      <a class="custom-table__link" :href="item.url" target="_blank">
        {{ formatUrl(item.url) }}
      </a>
    </template>
    <template v-slot:[`item.video_stat_link`]="{ item }">
      <a class="custom-table__link" :href="item.video_stat_link" target="_blank">
        {{ formatUrl(item.video_stat_link) }}
      </a>
    </template>
    <template v-slot:[`item.resource`]="{ item }">
      <div class="flex gap-4">
        <v-chip
          v-if="item.resource === 'INSTAGRAM'"
          class="social-chip instagram"
          text="Instagram"
          prepend-icon="mdi-instagram"
        />
        <v-chip
          v-else-if="item.resource === 'TIKTOK'"
          class="social-chip tiktok"
          text="TikTok"
          prepend-icon="mdi-music-note"
        />
        <v-chip
          v-else-if="item.resource === 'YOUTIBE'"
          class="social-chip youtube"
          text="YouTube"
          prepend-icon="mdi-youtube"
        />
      </div>
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

const formatUrl = (url: string) => {
  if (!url) return ''
  const firstPart = url.slice(0, 30)
  const lastPart = url.slice(url.length - 3)
  return `${firstPart}...${lastPart}`
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
.social-chip {
  color: white !important;
  font-weight: bold !important;
}

.instagram {
  background: radial-gradient(circle at 30% 30%, #feda75, #d62976, #962fbf) !important;
}

.tiktok {
  background-color: #010101 !important;
  border: 1px solid #25f4ee !important;
  color: #25f4ee !important;
}

.youtube {
  background-color: #ff0000 !important;
}
</style>
