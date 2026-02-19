<template>
  <v-card class="content-card">
    <v-tabs v-model="currentTab" bg-color="white" color="primary" grow>
      <v-tab
        v-for="tab in tabs"
        :key="tab.id"
        :value="tab.id"
        class="custom-tab"
        @click="handleTabClick(tab.id, tab.redirect)"
      >
        {{ tab.title }}
        <span v-if="tab.count" class="custom-tab__badge">{{ tab.count }}</span>
      </v-tab>
    </v-tabs>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  tabs: {
    type: Array,
    default: () => [
      { id: 'moderation', title: 'На модерации', count: 0 },
      { id: 'verified', title: 'Проверенные', count: 0 }
    ]
  },
  initialTab: {
    type: String,
    default: 'moderation'
  }
})

const emit = defineEmits(['tab-click'])

const currentTab = ref(props.initialTab)

const handleTabClick = (tabId: string, redirect: string): void => {
  currentTab.value = tabId
  emit('tab-click', {
    redirect
  })
}
</script>

<style scoped lang="scss">
.custom-tab {
  font-size: 14px;
  color: rgba(17, 17, 17, 1) !important;
  text-transform: none;
  letter-spacing: normal;
  height: 40px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px !important;
  margin-right: 4px;

  &.v-tab--selected {
    background: rgba(229, 236, 253, 1);
    pointer-events: none !important;
  }

  :deep(.v-tab__slider) {
    display: none !important;
  }

  &__badge {
    background-color: rgba(169, 55, 244, 1);
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 22px;
    margin-left: 4px;
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    font-weight: 500;
    padding: 0 6px;
  }
}
.content-card {
  border: none;
  box-shadow: none;
  height: 40px;
  border-radius: 50px;

  :deep(.v-slide-group) {
    background: rgb(var(--v-theme-chipBg)) !important;

    button {
      color: rgb(var(--v-theme-chipColor)) !important;
    }
  }
}
</style>
