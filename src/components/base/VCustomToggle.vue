<template>
  <div class="toggle-switch-wrapper reversed">
    <v-switch
      v-model="internalValue"
      :label="label"
      :color="color"
      :disabled="disabled"
      :density="density"
      :hide-details="hideDetails"
      :inset="inset"
      :true-value="trueValue"
      :false-value="falseValue"
      class="toggle-switch"
      :class="{
        'toggle-switch--disabled': disabled,
        'toggle-switch--dense': dense
      }"
      @update:model-value="handleChange"
    >
      <template v-if="$slots.label" #label>
        <slot name="label"></slot>
      </template>

      <template v-if="$slots.append" #append>
        <slot name="append"></slot>
      </template>
    </v-switch>

    <div v-if="hint && !hideDetails" class="toggle-switch-hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface ToggleSwitchProps {
  modelValue?: boolean | string | number | unknown
  label?: string
  color?: string
  disabled?: boolean
  density?: 'default' | 'comfortable' | 'compact'
  hideDetails?: boolean | 'auto'
  inset?: boolean
  hint?: string
  trueValue?: boolean | string | number
  falseValue?: boolean | string | number
  dense?: boolean
}

const props = withDefaults(defineProps<ToggleSwitchProps>(), {
  modelValue: false,
  label: '',
  color: 'primary',
  disabled: false,
  density: 'default',
  hideDetails: false,
  inset: false,
  hint: '',
  trueValue: true,
  falseValue: false,
  dense: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | string | number): void
  (e: 'change', value: boolean | string | number): void
}>()

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  }
)

const handleChange = (value: boolean | string | number) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.toggle-switch-wrapper {
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
}

.toggle-switch {
  margin: 0;
}

.toggle-switch--dense :deep(.v-switch__thumb) {
  transform: scale(0.8);
}

.toggle-switch--dense :deep(.v-switch__track) {
  transform: scale(0.9);
}

.toggle-switch-hint {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  margin-top: 4px;
  margin-left: 12px;
}

.toggle-switch--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.reversed {
  border: 1px solid rgba(211, 219, 237, 1);
  border-radius: 8px;
  width: 100%;
  padding: 6px 14px;
  margin-bottom: 5px;
  position: relative;
  top: -5px;

  :deep(.v-label) {
    order: -1;
    padding: 0;
    margin-right: 84px;
    font-size: 14px;
    color: rgba(0, 0, 0, 1);
  }
}
</style>
