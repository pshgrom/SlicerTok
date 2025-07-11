<template>
  <v-pagination
    v-model="page"
    :length="totalPages"
    :disabled="loading"
    density="comfortable"
    :total-visible="6"
    rounded="circle"
  ></v-pagination>
</template>

<script setup lang="ts">
import type { ITableParams } from '@/interfaces/AppModel'
import { computed, type PropType } from 'vue'

const props = defineProps({
  queryParams: {
    type: Object as PropType<ITableParams>,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  totalPages: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['changePage'])

const page = computed<number>({
  get() {
    return +props.queryParams.page!
  },
  set(val) {
    emit('changePage', val)
  }
})
</script>
