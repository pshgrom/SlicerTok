<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="260px"
    min-width="260px"
  >
    <template #activator="{ props: activatorProps }">
      <v-text-field
        v-bind="activatorProps"
        v-model="formattedDate"
        :label="label"
        placeholder="YYYY-MM-DD"
        readonly
        density="compact"
        color="rgb(169, 55, 244)"
        variant="outlined"
        hide-details
        class="date-filter__input"
      >
        <template #prepend-inner>
          <SvgIcon name="calendar-search" />
        </template>
        <template #append-inner>
          <v-icon v-if="formattedDate" size="18" class="cursor-pointer" @click.stop="clearDate">
            mdi-close
          </v-icon>
        </template>
      </v-text-field>
    </template>

    <v-date-picker
      v-model="selectedDate"
      color="rgb(169, 55, 244)"
      hide-header
      @update:model-value="updateDate"
    />
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import SvgIcon from '@/components/base/SvgIcon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Выберите дату'
  }
})

const emit = defineEmits(['update:modelValue'])

const menu = ref(false)

const selectedDate = ref(props.modelValue || '')

const formattedDate = computed({
  get: () => selectedDate.value,
  set: () => {}
})

const updateDate = (date: Date) => {
  if (!date) return
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const formatted = `${year}-${month}-${day}`

  selectedDate.value = formatted
  emit('update:modelValue', formatted)
  menu.value = false
}

function clearDate() {
  selectedDate.value = ''
  emit('update:modelValue', '')
}

watch(
  () => props.modelValue,
  (val) => {
    selectedDate.value = val || ''
  }
)
</script>

<style scoped lang="scss">
.date-filter__input {
  max-width: 250px;
  min-width: 250px;
  font-size: 16px;

  :deep(.v-field__input) {
    padding: 4px 8px;
  }

  :deep(.v-label) {
    font-size: 0.75rem;
  }
}

.v-date-picker {
  font-size: 0.85rem;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
