<template>
  <div class="v-custom-select">
    <v-select
      v-model="select"
      class="v-custom-select__select"
      :items="items"
      :label="label"
      :color="color"
      item-title="label"
      item-value="value"
      :clearable="clearable"
      :variant="variant"
      :disabled="disabled"
      :attach="attach"
      :menu-icon="readonly ? null : 'mdi-menu-down'"
      :density="density"
      :rules="rules"
      :hide-details="hideDetails"
      :readonly="readonly"
      @click:clear="clearSelect"
      @update:model-value="updateStatus"
    >
      <template #item="{ props: slotProps, item }">
        <slot name="item" :item="item" :props="{ ...slotProps, disabled: item.raw.disabled }">
          <v-list-item v-bind="slotProps" :disabled="item.raw.disabled">
            {{ item.raw.label }}
          </v-list-item>
        </slot>
      </template>
    </v-select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  rules: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  hideDetails: {
    type: Boolean,
    default: true
  },
  clearable: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: ''
  },
  variant: {
    type: String as () => 'underlined' | 'outlined' | 'filled' | 'solo' | 'plain',
    default: 'outlined'
  },
  attach: {
    type: [String, Boolean, HTMLElement],
    default: 'self'
  },
  density: {
    type: String as () => 'default' | 'comfortable' | 'compact',
    default: 'comfortable'
  }
})

const emit = defineEmits(['update:modelValue', 'updateStatus'])

const select = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const updateStatus = (e: string | number) => {
  emit('updateStatus', e)
}

const clearSelect = () => {
  emit('update:modelValue', null)
  emit('updateStatus', null)
}
</script>

<style lang="scss" scoped>
.v-custom-select {
  :deep(.v-select__selection-text) {
    font-size: 14px !important;
    color: rgba(17, 17, 17, 1);
  }
}
:deep(.v-field--outlined) {
  --v-field-border-opacity: 1;
  border-color: rgba(100, 100, 100, 1) !important;
  outline: none;
}

:deep(.v-label) {
  font-weight: 500;
  color: rgba(143, 150, 165, 1) !important;
  font-size: 14px !important;
}

:deep(.v-field--focused .v-field__outline__start),
:deep(.v-field--focused .v-field__outline__notch::before),
:deep(.v-field--focused .v-field__outline__notch::after),
:deep(.v-field--focused .v-field__outline__end) {
  border-color: $primary-color !important;
  --v-field-border-width: 1px !important;
}
</style>
