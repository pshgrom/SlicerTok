<template>
  <v-text-field
    class="custom-input"
    v-model="value"
    :label="label"
    :rules="rules"
    :variant="variant"
    :density="density"
    :autofocus="autofocus"
    :type="type"
    :hide-details="hideDetails"
    clearable
  >
  </v-text-field>
  <!--  @update:modelValue="updateValue"-->
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  rules: {
    type: Array,
    default: () => []
  },
  label: {
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
  },
  type: {
    type: String,
    default: 'string'
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  hideDetails: {
    type: Boolean,
    default: false
  },
  autofocus: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// const updateValue = (e: string) => {
//   console.error('e', e)
//   emit('updateValue', e)
// }
</script>

<style lang="scss" scoped>
.custom-input {
  :deep(input) {
    font-size: 14px;
    color: rgba(17, 17, 17, 1);
    border: rgba(211, 219, 237, 1) !important;
  }
}
</style>
