<template>
  <v-text-field
    ref="inputRef"
    v-model="value"
    class="custom-input"
    :class="customClasses"
    :label="label"
    :rules="rules"
    :variant="variant"
    :density="density"
    :autofocus="autofocus"
    :type="type"
    :hide-details="hideDetails"
    :color="color"
    :base-color="baseColor"
    :clearable="clearable"
    @click:clear="onClear"
  />
  <!--  @update:modelValue="updateValue"-->
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  rules: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'rgb(169, 55, 244)'
  },
  baseColor: {
    type: String,
    default: 'rgba(211, 219, 237, 1)'
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
  clearable: {
    type: Boolean,
    default: true
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  customClass: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const customClasses = computed(() => props.customClass.join(' '))
const inputRef = ref(null)

defineExpose({
  validate: () => inputRef.value?.validate?.(),
  resetValidation: () => inputRef.value?.resetValidation?.()
})

const onClear = () => {
  value.value = ''
  emit('update:modelValue', '')
}

// const updateValue = (e: string) => {
//   console.error('e', e)
//   emit('updateValue', e)
// }
</script>

<style lang="scss" scoped>
.custom-input {
  :deep(input) {
    font-size: 14px !important;
    color: rgba(17, 17, 17, 1);
  }

  //&.avg :deep(.v-field),
  //:deep(.v-field__field),
  //:deep(input) {
  //  height: 40px;
  //}
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
