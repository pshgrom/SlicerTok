<template>
  <transition name="fade" mode="out-in">
    <VAlert v-if="visible" :type="type" class="error-alert" closable @click:close="close">
      <div v-html="errors.errorsValue.msg"></div>
    </VAlert>
  </transition>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import { useError } from '@/stores/Errors'

const errors = useError()

const props = defineProps({
  duration: {
    type: Number,
    default: 4000
  }
})

const visible = computed({
  get() {
    return errors.errorsValue.show
  },
  set(value) {
    errors.errorsValue.show = value
  }
})

const type = computed(() => errors.errorsValue.type)

let timeoutId = null

const close = () => {
  visible.value = false
  clearTimeout(timeoutId)
}

function startTimer() {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    visible.value = false
  }, props.duration)
}

watch(
  () => errors.errorsValue.show,
  (newVal) => {
    if (newVal) {
      visible.value = true
      startTimer()
    } else {
      visible.value = false
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  clearTimeout(timeoutId)
})
</script>

<style lang="scss" scoped>
.error-alert {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 999999999;
  padding: 10px;
  max-width: 400px;

  div {
    font-size: 14px;
  }
}
</style>
