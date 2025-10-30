<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="800px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Видео</span>
        <VBtn icon="mdi-close" variant="text" @click="closeModal" />
      </v-card-title>
      <v-card-text>
        <video
          v-if="video"
          ref="videoEl"
          :key="video"
          :src="video"
          controls
          autoplay
          class="styled-video"
          @ended="onVideoEnded"
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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

const videoEl = ref(null)
const playbackRate = ref(1)
const currentTime = ref(0)

const closeModal = () => {
  if (videoEl.value) {
    currentTime.value = videoEl.value.currentTime
    playbackRate.value = videoEl.value.playbackRate
  }
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

watch(dialog, async (val) => {
  if (val) {
    await nextTick()
    const el = videoEl.value
    if (el) {
      el.playbackRate = playbackRate.value
      el.currentTime = currentTime.value
    }
  }
})

watch(video, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    await nextTick()
    const el = videoEl.value
    if (el) {
      el.pause()
      el.currentTime = 0
      el.play().catch(() => {})
    }
    currentTime.value = 0
  }
})

const handleKeydown = (e) => {
  if (e.key === 'Escape' && dialog.value) {
    closeModal()
  }
}

const onVideoEnded = () => {
  const el = videoEl.value
  if (el) {
    el.pause()
    el.currentTime = 0
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
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
