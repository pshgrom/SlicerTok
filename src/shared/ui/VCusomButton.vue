<template>
  <v-btn
    class="custom-btn"
    :color="color"
    :variant="variant"
    :class="customClasses"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    :block="block"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </v-btn>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
  color: { type: String, default: 'primary' },
  customClass: { type: Array, default: () => [] },
  variant: { type: String, default: 'elevated' }, // flat, outlined, text, plain, tonal, etc.
  size: { type: String, default: 'default' }, // x-small, small, default, large, x-large
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  icon: { type: Boolean, default: false },
  block: { type: Boolean, default: false } // full-width
})

defineEmits(['click'])

const customClasses = computed(() => props.customClass.join(' '))
</script>

<style scoped lang="scss">
.custom-btn {
  height: 32px !important;
  font-size: 14px !important;
  text-transform: none;
  box-shadow: none;
  padding: 0 10px !important;
  border-radius: 12px;
  font-weight: 500;
  letter-spacing: 0;
  transition: all 0.15s ease-in;

  :deep(.svg-icon) {
    margin-right: 8px;
    margin-left: 4px;
  }

  &.light {
    color: rgb(var(--v-theme-primary)) !important;
    border: 1px solid rgb(var(--v-theme-borderColor));
    background: rgb(var(--v-theme-background)) !important;

    &:hover {
      background: #28283c;
      box-shadow: none !important;
    }

    &:focus,
    &:focus-visible {
      //background: #302f44 !important;
      box-shadow: none !important;
    }

    &:active {
      box-shadow: none !important;
    }
  }
  &.dark {
    background: rgba(169, 55, 244, 1) !important;
    color: rgba(255, 255, 255, 1) !important;
    &:hover {
      background: $primary-color;
      box-shadow: none !important;
    }

    &:focus {
      background: $primary-color !important;
      border-color: transparent !important;
      box-shadow: none !important;
    }

    &:active {
      box-shadow: none !important;
    }
  }
  &.avg {
    height: 40px !important;
    padding: 0 16px !important;
  }
  &.lg {
    height: 48px !important;
    padding: 0 20px !important;
    font-size: 16px !important;
  }
  &.v-btn--disabled {
    background: rgba(229, 236, 253, 1) !important;
    color: rgba(143, 150, 165, 1) !important;
    border: 1px solid rgba(229, 236, 253, 1) !important;

    :deep(.v-btn__overlay) {
      opacity: 0 !important;
    }
  }
  &.with-icon {
    padding: 0 12px !important;
  }
  &.only-icon {
    max-width: 40px;
    min-width: 40px;

    :deep(.svg-icon) {
      margin: 0;
    }
  }
}
</style>
