<template>
  <div class="svg-icon">
    <component :is="dynamicComponent" :class="className" :fill="fill" />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, computed } from "vue";
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    required: false,
  },
  height: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  className: {
    type: String,
    required: false,
  },
  fill: {
    type: String,
    default: "none",
    required: false,
  },
  colored: {
    type: Boolean,
    default: false,
  },
  scale: {
    type: [String, Number],
    default: null,
  },
});

const dynamicComponent = computed(() =>
  defineAsyncComponent(
    () => import(`@/assets/icons/${props.name}.svg?skipsvgo`)
  )
);
</script>

<style lang="scss" scoped>
.svg-icon {
  display: flex;
  align-items: center;
}
</style>
