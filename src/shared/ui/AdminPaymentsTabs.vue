<template>
  <TabsSwitcher :tabs="tabsWithCounts" :initial-tab="activeTabId" @tab-click="goToPage" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { adminPaymentsTabs } from '@/shared/config'
import TabsSwitcher from '@/shared/ui/TabsSwitcher.vue'

const props = defineProps<{
  counts?: Partial<Record<string, number>>
}>()

const route = useRoute()
const router = useRouter()

const activeTabId = computed(() => {
  const path = route.path
  const tab = adminPaymentsTabs.find((t) => t.redirect === path)
  return tab?.id ?? adminPaymentsTabs[0].id
})

const tabsWithCounts = computed(() =>
  adminPaymentsTabs.map((tab) => ({
    ...tab,
    count: props.counts?.[tab.id] ?? 0
  }))
)

const goToPage = (payload: { redirect: string }) => {
  router.push(`${payload.redirect}?page=1`)
}
</script>
