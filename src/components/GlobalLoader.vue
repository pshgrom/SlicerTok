<template>
  <v-overlay :model-value="true" class="z-loader" persistent>
    <v-progress-circular color="rgba(169, 55, 244, 1)" size="64" indeterminate />
  </v-overlay>
</template>

<style scoped lang="scss">
.z-loader {
  z-index: 9999 !important;

  :deep(.v-overlay__content) {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
