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
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

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

  &.light {
    color: rgba(17, 17, 17, 1) !important;
    border: 1px solid rgba(224, 224, 224, 1);
    background: #fff !important;

    &:hover {
      border-color: rgba(0, 212, 254, 1);
      background: rgba(229, 236, 253, 1);
      box-shadow: none !important;
    }

    &:focus,
    &:focus-visible {
      background: rgba(211, 219, 237, 1) !important;
      border-color: transparent !important;
      box-shadow: none !important;
    }

    &:active {
      box-shadow: none !important;
    }
  }
  &.dark {
    background: rgba(34, 93, 255, 1) !important;
    color: rgba(255, 255, 255, 1) !important;
    &:hover {
      background: rgba(96, 135, 242, 1);
      box-shadow: none !important;
    }

    &:focus {
      background: rgba(8, 55, 185, 1) !important;
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
  &.v-btn--disabled {
    background: rgba(211, 219, 237, 1) !important;
    color: rgba(17, 17, 17, 1) !important;
    border: 1px solid rgba(211, 219, 237, 1) !important;

    :deep(.v-btn__overlay) {
      opacity: 0 !important;
    }
  }
}
</style>
