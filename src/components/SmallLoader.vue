<template>
  <div class="custom-loading">
    <v-progress-circular indeterminate color="rgb(169, 55, 244)" />
  </div>
</template>

<script setup lang="ts"></script>
<style scoped lang="scss">
.custom-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(var(--v-theme-loaderSmall), 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  z-index: 1000;
}
</style>
