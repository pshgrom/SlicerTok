<template>
  <div class="svg-icon" :style="{ transform: `scale(${scale})` }">
    <component
      :is="dynamicComponent"
      v-if="width && height"
      :class="className"
      :fill="fill"
      :width="width"
      :height="height"
    />
    <component :is="dynamicComponent" v-else :class="className" :fill="fill" />
  </div>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue'
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
    default: ''
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
  // eslint-disable-next-line
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
