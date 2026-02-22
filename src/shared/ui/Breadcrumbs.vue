<template>
  <v-breadcrumbs class="custom-breadcrumbs" :items="processedItems" :divider="divider">
    <template #divider>
      <v-icon v-if="dividerIcon">{{ dividerIcon }}</v-icon>
      <span v-else>{{ divider }}</span>
    </template>

    <template #item="{ item }">
      <v-breadcrumbs-item
        :href="item.href"
        :disabled="item.disabled"
        :class="{ 'breadcrumb-item--active': !item.href }"
      >
        <v-icon v-if="item.icon" small class="mr-1">{{ item.icon }}</v-icon>
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

import type { BreadcrumbItem } from '@/shared/config/types/breadcrumb'

const props = defineProps({
  items: {
    type: Array as PropType<BreadcrumbItem[]>,
    required: true,
    validator: (value: BreadcrumbItem[]) => {
      return value.every((item) => typeof item.text === 'string')
    }
  },
  divider: {
    type: String,
    default: '/'
  },
  dividerIcon: {
    type: String,
    default: undefined
  }
})

const processedItems = computed(() => {
  return props.items.map((item, index) => ({
    ...item,
    disabled: item.disabled || index === props.items.length - 1,
    href: index === props.items.length - 1 ? undefined : item.href
  }))
})
</script>

<style lang="scss" scoped>
.custom-breadcrumbs {
  padding-top: 4px;
  padding-bottom: 10px;
  padding-left: 0;
}

:deep(.v-breadcrumbs-item--link) {
  font-size: 12px;
  color: rgba(143, 150, 165, 1);
  font-weight: 500;
}

:deep(.breadcrumb-item--active) {
  font-weight: 500;
  color: rgba(17, 17, 17, 1);
  font-size: 12px;
  opacity: 1;
}

:deep(.v-breadcrumbs-divider) {
  padding: 0 1px;
  font-size: 12px;
  color: rgba(143, 150, 165, 1);
}
</style>
