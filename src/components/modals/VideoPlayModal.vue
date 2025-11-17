<template>
  <transition name="fade">
    <div
      v-if="visible"
      ref="floatingEl"
      class="floating-video"
      :style="{
        top: position.y + 'px',
        left: position.x + 'px',
        width: size.width + 'px',
        height: size.height + 'px'
      }"
      @mousedown="startDrag"
    >
      <video
        ref="videoEl"
        :src="videoSrc"
        autoplay
        playsinline
        controls
        class="video-element"
        @ended="onVideoEnded"
      ></video>
      <button class="close-btn" :class="{ 'close-btn_mobile': !isMobile }" @click.stop="closeVideo">
        ✕
      </button>
      <div class="resize-handle" @mousedown.stop="startResize"></div>
      <button v-if="!isMobile" class="pip-btn" @click="togglePiP">⧉</button>
    </div>
  </transition>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useDeviceDetection } from '@/composables/useDeviceDetection.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  videoSrc: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue', 'update:videoSrc'])

const visible = ref(props.modelValue)
const { isMobile } = useDeviceDetection()
const videoEl = ref(null)
const savedTime = ref(0)
const savedSpeed = ref(1)
const floatingEl = ref(null)
const size = ref({ width: 320, height: 460 })
const dragging = ref(false)
const offset = ref({ x: 0, y: 0 })
const lastVideoSrc = ref(props.videoSrc)
const resizing = ref(false)
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 })

const position = ref({
  x: window.innerWidth - size.value.width - 20,
  y: 20
})

const startResize = (e) => {
  e.preventDefault()
  resizing.value = true
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    width: size.value.width,
    height: size.value.height
  }
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

const onResize = (e) => {
  if (!resizing.value) return
  const dx = e.clientX - resizeStart.value.x
  const dy = e.clientY - resizeStart.value.y

  const newWidth = Math.min(
    Math.max(200, resizeStart.value.width + dx),
    window.innerWidth - position.value.x - 20
  )
  const newHeight = Math.min(
    Math.max(150, resizeStart.value.height + dy),
    window.innerHeight - position.value.y - 20
  )

  size.value = { width: newWidth, height: newHeight }
}

const stopResize = () => {
  resizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

const togglePiP = async () => {
  const el = videoEl.value
  if (!el) return

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture()
    } else {
      await el.requestPictureInPicture()
    }
  } catch (err) {
    console.error('PiP error:', err)
  }
}

const saveState = () => {
  const el = videoEl.value
  if (!el) return
  savedTime.value = el.currentTime
  savedSpeed.value = el.playbackRate
}

const restoreState = () => {
  const el = videoEl.value
  if (!el) return
  el.currentTime = savedTime.value || 0
  el.playbackRate = savedSpeed.value || 1
}

const resetState = () => {
  savedTime.value = 0
  // savedSpeed.value = 1
}

const startDrag = (e) => {
  dragging.value = true
  offset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!dragging.value) return
  const newX = Math.min(
    Math.max(0, e.clientX - offset.value.x),
    window.innerWidth - size.value.width
  )
  const newY = Math.min(
    Math.max(0, e.clientY - offset.value.y),
    window.innerHeight - size.value.height
  )
  position.value = { x: newX, y: newY }
}

const stopDrag = () => {
  dragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

const closeVideo = () => {
  visible.value = false
}

const onVideoEnded = () => {
  const el = videoEl.value
  if (el) {
    el.pause()
    el.currentTime = 0
  }
  resetState()
}

watch(
  () => props.modelValue,
  async (val) => {
    visible.value = val
    if (val) {
      await nextTick()
      const el = videoEl.value
      if (!el) return

      // если видео то же самое — восстанавливаем
      if (props.videoSrc === lastVideoSrc.value) {
        restoreState()
      } else {
        // новое видео — сбрасываем
        resetState()
        lastVideoSrc.value = props.videoSrc
      }

      el.play().catch(() => {})
    } else {
      saveState()
    }
  }
)

watch(
  () => props.videoSrc,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      resetState()
      lastVideoSrc.value = newVal
      await nextTick()
      const el = videoEl.value
      if (el) {
        el.currentTime = 0
        // el.playbackRate = 1
        el.play().catch(() => {})
      }
    }
  }
)

watch(visible, (val) => emit('update:modelValue', val))

onMounted(async () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') visible.value = false
  })
})

onBeforeUnmount(() => {
  saveState()
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.floating-video {
  position: fixed;
  z-index: 9999;
  cursor: grab;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
  user-select: none;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}

.floating-video:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.floating-video:active {
  cursor: grabbing;
}

.resize-handle {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  cursor: se-resize;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  transition: background 0.2s;
}

.resize-handle:hover {
  background: rgba(255, 255, 255, 0.35);
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.close-btn,
.pip-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  line-height: 20px;
  font-size: 12px;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s;
}

.pip-btn {
  right: 0;
  left: 6px;
}

.close-btn {
  &_mobile {
    right: 20px;
  }
}
</style>
