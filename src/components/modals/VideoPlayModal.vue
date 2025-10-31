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
      <button class="close-btn" @click.stop="closeVideo">✕</button>
    </div>
  </transition>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  videoSrc: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue', 'update:videoSrc'])

const visible = ref(props.modelValue)
const videoEl = ref(null)
const savedTime = ref(0)
const savedSpeed = ref(1)
const floatingEl = ref(null)
const size = ref({ width: 320, height: 460 })
const dragging = ref(false)
const offset = ref({ x: 0, y: 0 })
const lastVideoSrc = ref(props.videoSrc)

const position = ref({
  x: window.innerWidth - size.value.width - 20,
  y: 20
})

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

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.close-btn {
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
  opacity: 0;
  transition: opacity 0.2s;
}

.floating-video:hover .close-btn {
  opacity: 1;
}
</style>
