<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    width="500px"
    max-width="260px"
    min-width="auto"
  >
    <template #activator="{ props }">
      <v-text-field
        v-bind="props"
        v-model="formattedDate"
        :label="label"
        placeholder="YYYY-MM-DD"
        readonly
        density="compact"
        variant="outlined"
        hide-details
        class="date-filter__input"
      >
        <template #append-inner>
          <v-icon v-if="formattedDate" size="18" class="cursor-pointer" @click.stop="clearDate">
            mdi-close
          </v-icon>
        </template>
      </v-text-field>
    </template>

    selectedDate = {{ selectedDate }}
    <v-date-picker
      v-model="selectedDate"
      color="primary"
      hide-header
      @update:model-value="updateDate"
    />
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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
const selectedDate = ref<Date | null>(props.modelValue ? new Date(props.modelValue) : null)

const formattedDate = computed({
  get: () => (selectedDate.value ? formatDate(selectedDate.value) : ''),
  set: () => {}
})

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
const updateDate = (date: Date) => {
  if (date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const formatted = `${year}-${month}-${day}`

    emit('update:modelValue', formatted)
    selectedDate.value = date
  }
  menu.value = false
}

function clearDate() {
  selectedDate.value = null
  emit('update:modelValue', null)
}
</script>

<style scoped lang="scss">
.date-filter__input {
  max-width: 280px;
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
</style>
