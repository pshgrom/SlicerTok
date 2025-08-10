<template>
  <div class="alert-container">
    <transition-group name="fade" tag="div">
      <VAlert
        v-for="message in errors.errorsValue.messages"
        :key="message.id"
        :type="message.type"
        class="error-alert"
        closable
        @click:close="close(message.id)"
      >
        <div class="error-alert__text" :class="message.type" v-html="message.msg" />
      </VAlert>
    </transition-group>
  </div>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'
import { useError } from '@/stores/Errors'

const props = defineProps({
  duration: { type: Number, default: 4000 }
})

const errors = useError()
const timers = new Map()

const close = (id) => {
  clearTimeout(timers.get(id))
  timers.delete(id)
  errors.clearError(id)
}

watch(
  () => [...errors.errorsValue.messages],
  (newMessages) => {
    newMessages.forEach((msg) => {
      if (!timers.has(msg.id)) {
        const timeout = setTimeout(() => close(msg.id), props.duration)
        timers.set(msg.id, timeout)
      }
    })
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  timers.clear()
})
</script>

<style scoped lang="scss">
.alert-container {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 999999999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.error-alert {
  min-width: 361px;
  max-width: 361px;
  border-radius: 16px;
  box-shadow: 0 0 14.6px 0 rgba(0, 0, 0, 0.15);
  background: #fff !important;
  margin-bottom: 15px;

  :deep(.v-alert__prepend) {
    display: none;
  }

  :deep(.v-alert__content) {
    padding: 0 !important;
  }

  :deep(.v-alert__close) {
    display: inline-flex;
    position: relative;
    top: -5px;
    right: -5px;

    button {
      color: black;
      font-size: 14px;
    }
  }
}

.error-alert__text {
  font-size: 14px;
  max-width: 274px;
  color: #15171a;
  line-height: 1.4;
  position: relative;
  margin-left: 19px;

  &:before {
    content: '';
    position: absolute;
    left: -19px;
    height: 100%;
    width: 3px;
    border-radius: 4px;
    background: rgba(34, 93, 255, 1);
  }

  &.error:before {
    background: rgba(255, 0, 0, 1);
  }
  &.success:before {
    background: rgba(16, 154, 106, 1);
  }
  &.info:before {
    background: rgba(34, 93, 255, 1);
  }
}
</style>
