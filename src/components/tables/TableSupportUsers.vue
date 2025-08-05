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
    @click:row="onRowClick"
  >
    <template #loading>
      <v-progress-circular indeterminate color="#0070ba"></v-progress-circular>
    </template>
    <template #[`item.total_views`]="{ item }">
      <div class="custom-table-views">
        <SvgIcon name="show" />
        <div>{{ formatNumber(item.total_views) }}</div>
      </div>
    </template>
    <template #[`item.is_verified`]="{ item }">
      <div
        class="custom-table-chip"
        :style="{
          'background-color': getStatusColor(item.is_verified),
          color: getColor(item.is_verified)
        }"
      >
        <div class="custom-table-chip__icon">
          <SvgIcon :name="getIcon(item.is_verified)" />
        </div>
        <div class="custom-table-chip__status">
          {{ getTextStatus(item.is_verified) }}
        </div>
      </div>
    </template>
    <template #[`item.requires_verification`]="{ item }">
      <div
        class="custom-table-chip"
        :style="{
          'background-color': getCheckBgColor(item.requires_verification),
          color: getCheckColor(item.requires_verification)
        }"
      >
        <div class="custom-table-chip__status">
          {{ getTextCheck(item.requires_verification) }}
        </div>
      </div>
    </template>
    <template #[`item.actions`]="{ item }">
      <VCusomButton :customClass="['light']" @click.stop="goToChat(item.id)">
        Написать в чат
      </VCusomButton></template
    >
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import type { ITableHeaders, IUserInfoData } from '@/interfaces/AppModel'
import VCusomButton from '@/components/base/VCusomButton.vue'
import { formatNumber } from '@/utils/formatNumbers.ts'
import SvgIcon from '@/components/base/SvgIcon.vue'
import { useRouter } from 'vue-router'

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
const router = useRouter()
const headersData = ref(props.headers)

const computedHeaders = computed<ITableHeaders[]>({
  get() {
    return headersData.value
  },
  set(val) {
    headersData.value = val
  }
})

const onRowClick = (event, { item }) => {
  router.push({ name: 'User', params: { id: item.id } })
}

const goToChat = (id: number | string) => {
  router.push({ name: 'SupportChat', query: { id } })
}

const getStatusColor = (is_verified: boolean) => {
  switch (is_verified) {
    case true:
      return 'rgba(187, 251, 228, 1)'
    case false:
      return 'rgba(255, 224, 224, 1)'
  }
}

const getCheckBgColor = (is_verified: boolean) => {
  switch (is_verified) {
    case true:
      return 'rgba(255, 224, 224, 1)'
    case false:
      return 'rgba(187, 251, 228, 1)'
  }
}

const getTextStatus = (is_verified: boolean) => {
  switch (is_verified) {
    case true:
      return 'Верифицирован'
    case false:
      return 'Не верифицирован'
  }
}

const getTextCheck = (is_verified: boolean) => {
  switch (is_verified) {
    case true:
      return 'Нужна'
    case false:
      return 'Не нужна'
  }
}

const getIcon = (is_verified: boolean) => {
  let icon = ''
  switch (is_verified) {
    case true:
      icon = 'status-ok'
      break
    case false:
      icon = 'status-bad'
      break
  }
  return icon
}

const getColor = (is_verified: boolean) => {
  switch (is_verified) {
    case true:
      return 'rgba(16, 154, 106, 1)'
    case false:
      return 'rgba(255, 0, 0, 1)'
  }
}

const getCheckColor = (is_verified: boolean) => {
  switch (is_verified) {
    case true:
      return 'rgba(255, 0, 0, 1)'
    case false:
      return 'rgba(16, 154, 106, 1)'
  }
}
</script>

<style lang="scss" scoped></style>
