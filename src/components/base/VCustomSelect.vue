<template>
  <div class="v-custom-select">
    <v-select
      class="v-custom-select__select"
      v-model="select"
      :items="items"
      :label="label"
      item-title="label"
      item-value="value"
      :color="color"
      :variant="variant"
      :disabled="disabled"
      :menu-icon="readonly ? null : 'mdi-menu-down'"
      :density="density"
      hide-details
      :readonly="readonly"
      @update:modelValue="updateStatus"
    >
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" :disabled="item.raw.disabled" />
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
  color: {
    type: String,
    default: ''
  },
  variant: {
    type: String as () => 'underlined' | 'outlined' | 'filled' | 'solo' | 'plain',
    default: 'outlined'
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
</script>

<style lang="scss" scoped>
.custom-input {
  :deep(input) {
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
  font-family: 'Inter Medium', sans-serif;
  color: rgba(143, 150, 165, 1) !important;
  font-size: 14px !important;
}

:deep(.v-field--focused .v-field__outline__start),
:deep(.v-field--focused .v-field__outline__notch::before),
:deep(.v-field--focused .v-field__outline__notch::after),
:deep(.v-field--focused .v-field__outline__end) {
  border-color: rgba(96, 135, 242, 1) !important;
  --v-field-border-width: 1px !important;
}
</style>
