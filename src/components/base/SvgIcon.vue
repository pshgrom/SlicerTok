<template>
  <div class="svg-icon" :style="{ transform: `scale(${scale})` }">
    <component
      v-if="width && height"
      :is="dynamicComponent"
      :class="className"
      :fill="fill"
      :width="width"
      :height="height"
    />
    <component v-else :is="dynamicComponent" :class="className" :fill="fill" />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false
  },
  className: {
    type: String,
    required: false
  },
  fill: {
    type: String,
    default: 'none',
    required: false
  },
  scale: {
    type: [Number, String],
    default: 1
  },
  width: {
    type: [Number, String],
    default: null
  },
  height: {
    type: [Number, String],
    default: null
  }
})

const dynamicComponent = computed(() => {
  return props.name
    ? defineAsyncComponent(() => import(`@/assets/icons/${props.name}.svg?skipsvgo`))
    : ''
})
</script>

<style lang="scss" scoped>
.svg-icon {
  display: flex;
  align-items: center;
}
</style>
