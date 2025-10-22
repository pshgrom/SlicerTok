<template>
  <v-card class="side-panel pa-4 grey lighten-3">
    <v-card-title>
      <span class="headline"># {{ selectedRecord.id }}</span>
      <v-btn icon="mdi-close" variant="text" @click="activePanelVal = false" />
    </v-card-title>
    <div class="d-flex justify-space-between align-center mb-4">
      <span class="text-h6">Заявка </span>
      <div>
        <v-btn icon size="small" variant="text" :disabled="isFirst" @click="$emit('prev')">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" :disabled="isLast" @click="$emit('next')">
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  selected: {
    type: Object,
    default: () => ({})
  },
  isFirst: {
    type: Boolean,
    default: false
  },
  activePanel: {
    type: Boolean,
    default: false
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['prev', 'next', 'update:activePanel', 'update:selected'])

const activePanelVal = computed({
  get() {
    return props.activePanel
  },
  set(val) {
    emit('update:activePanel', val)
  }
})

const selectedRecord = computed({
  get() {
    return props.selected
  },
  set(val) {
    emit('update:selected', val)
  }
})
</script>

<style scoped lang="scss">
.side-panel {
  height: 92vh;
  z-index: 999;
  min-width: 500px;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: none;
  margin-left: 6px;
}
</style>
