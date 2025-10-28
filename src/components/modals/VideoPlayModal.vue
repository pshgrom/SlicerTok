<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="800px">
    <v-card>
      <v-card-title>
        <span class="headline">Видео</span>
        <VBtn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <video
          v-if="video"
          :key="video"
          :src="video"
          controls
          autoplay
          class="styled-video"
        ></video>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <VCusomButton :custom-class="['light', 'avg']" @click="closeModal"> Ок </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

import VCusomButton from '@/components/base/VCusomButton.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  videoSrc: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'update:videoSrc'])

const closeModal = () => {
  dialog.value = false
}

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const video = computed({
  get() {
    return props.videoSrc
  },
  set(val) {
    emit('update:videoSrc', val)
  }
})
</script>

<style lang="scss" scoped>
.styled-video {
  width: 100%;
  height: auto;
  max-height: 70vh;
  border-radius: 12px;
  object-fit: contain;
  background: #000;
}

:deep(.v-card-actions) {
  position: sticky;
  bottom: 0;
  background: #fff;
}

:deep(.v-card-title) {
  position: sticky;
  top: 0;
  background: #fff !important;
  z-index: 1;
}
</style>
