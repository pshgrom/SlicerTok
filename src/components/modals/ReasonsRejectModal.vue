<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="500px">
    <v-card>
      <v-card-title>
        <span>Причины отказа</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text> <div v-html="currentReasonsReject"></div></v-card-text>
      <v-card-actions>
        <v-spacer />
        <VCusomButton :custom-class="['light', 'avg']" @click="closeModal"> Ok </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import VCusomButton from '@/components/base/VCusomButton.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentReasonsReject: {
    type: [Array, String],
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const closeModal = () => {
  dialog.value = false
}
</script>

<style lang="scss" scoped>
:deep(.v-card-actions) {
  position: sticky;
  bottom: 0;
  background: #fff;
}

:deep(.v-card-title) {
  position: sticky;
  top: 0;
  padding-bottom: 0;
  background: #fff;
}
</style>
