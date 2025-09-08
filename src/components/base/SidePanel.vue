<template>
  <v-card class="side-panel pa-4 grey lighten-3">
    <div class="d-flex justify-space-between align-center mb-4">
      <span class="text-h6">Заявка {{ selected.id }}</span>
      <div>
        <v-btn icon size="small" variant="text" :disabled="isFirst" @click="$emit('prev')">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" :disabled="isLast" @click="$emit('next')">
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
      </div>
    </div>

    <v-btn block color="red" class="mb-4" variant="outlined"> страйк!!! </v-btn>

    <div class="d-flex flex-column gap-2 mb-4">
      <v-sheet height="40" rounded="md" color="grey-lighten-2" />
      <v-sheet height="40" rounded="md" color="grey-lighten-2" />
      <v-sheet height="40" rounded="md" color="grey-lighten-2" />
      <v-sheet height="40" rounded="md" color="grey-lighten-2" />
      <v-sheet height="40" rounded="md" color="grey-lighten-2" />
      <v-sheet height="40" rounded="md" color="grey-lighten-2" />
      <v-sheet height="40" rounded="md" color="grey-lighten-2" />
    </div>

    <div class="d-flex justify-space-between">
      <v-btn variant="outlined" color="grey">Левая</v-btn>
      <v-btn variant="outlined" color="grey">Правая</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  selected: Object,
  isFirst: Boolean,
  isLast: Boolean
})

defineEmits(['prev', 'next'])
</script>

<style scoped lang="scss">
.side-panel {
  position: fixed;
  right: 15px;
  top: 15px;
  height: 96vh;
  z-index: 9999;
  min-width: 300px;
  max-width: 300px;
}
</style>
