<template>
  <v-data-table
    :headers="computedHeaders"
    :items="items"
    :loading="isLoading"
    :items-per-page="itemsPerPage"
    class="custom-table"
    hover
    height="70vh"
    fixed-header
    hide-default-footer
  >
    <template #loading>
      <v-progress-circular indeterminate color="rgb(169, 55, 244)" />
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="d-flex align-center justify-end">
        <VCusomButton
          v-if="item.rate !== 1"
          :custom-class="['light', 'avg', 'only-icon']"
          :disabled="items.length <= 1"
          @click="removeCoeff(item.id)"
        >
          <SvgIcon name="remove" />
        </VCusomButton>
      </div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

import type { ITableHeaders, IUserInfoData } from '@/shared/config/types/app-model'
import { useTableHeaders } from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'
import VCusomButton from '@/shared/ui/VCusomButton.vue'

const emit = defineEmits(['removeCoeff'])

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
  }
})

const { computedHeaders } = useTableHeaders(props.headers)

const removeCoeff = (id: number) => {
  emit('removeCoeff', id)
}
</script>
