<template>
  <div class="views-select-field">
    <VCustomInput
      v-model="innerValue"
      :label="label"
      :rules="rules"
      class="mb-2"
      :clearable="false"
      @input="onInputChange"
      @blur="onBlurFormat"
    />

    <v-btn-toggle
      v-model="selected"
      mandatory
      class="btn-toggle"
      @update:model-value="onSelectChange"
    >
      <v-btn
        v-for="item in options"
        :key="item"
        :value="item"
        class="toggle-btn"
        size="x-small"
        :class="{ active: selected === item }"
      >
        {{ formatOptionLabel(item) }}
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

import VCustomInput from '@/components/base/VCustomInput.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  rules: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref(props.modelValue || '')
const selected = ref(null)

const options = ['100', '500', '1000']

const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

const parseNumber = (val) => String(val).replace(/\D/g, '')

const updateSelectedFromValue = (val) => {
  const numeric = parseNumber(val)
  const thousands = Math.round(numeric / 1000).toString()
  selected.value = options.includes(thousands) ? thousands : null
}

const formatOptionLabel = (val) => (val === '1000' ? '1M' : `${val}k`)

const onSelectChange = (val) => {
  const numeric = parseInt(val) * 1000
  const formatted = formatNumber(numeric)
  innerValue.value = formatted
  emit('update:modelValue', formatted)
}

const onInputChange = (val) => {
  const rawValue = typeof val === 'string' ? val : val?.target?.value || ''
  const digitsOnly = rawValue.replace(/\D/g, '')
  innerValue.value = digitsOnly
  emit('update:modelValue', digitsOnly)
  updateSelectedFromValue(digitsOnly)
}

const onBlurFormat = () => {
  const numeric = parseNumber(innerValue.value)
  if (!numeric) return
  const formatted = formatNumber(numeric)
  innerValue.value = formatted
  emit('update:modelValue', formatted)
}

watch(
  () => props.modelValue,
  (val) => {
    innerValue.value = val
    updateSelectedFromValue(val)
  },
  { immediate: true }
)
</script>

<style scoped>
.views-select-field {
  display: flex;
  flex-direction: column;
}

.btn-toggle {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.toggle-btn {
  text-transform: none;
  background-color: rgba(229, 236, 253, 1);
  height: 31px !important;
  padding: 0 12px 0 8px !important;
  color: rgba(17, 17, 17, 1);
  font-size: 16px;
  font-weight: 500;
  border-radius: 16px !important;
  letter-spacing: 0;
}

.toggle-btn.active {
  color: rgba(169, 55, 244, 1);
  border: rgba(169, 55, 244, 1) 2px solid;
}
</style>
