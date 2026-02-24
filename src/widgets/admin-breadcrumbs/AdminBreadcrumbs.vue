<template>
  <Breadcrumbs :items="breadcrumbs" divider="/" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import type { BreadcrumbItem } from '@/shared/config/types/breadcrumb'
import { Breadcrumbs } from '@/shared/ui'

const route = useRoute()

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [{ text: 'Стримеры', href: '/admin-main', icon: '' }]

  if (route.name === 'StreamerAdmins' || route.name === 'AdminStats') {
    const streamerId = route.params.streamerId as string
    items.push({
      text: 'Админы',
      href: `/admin-main/${streamerId}/admins`,
      icon: ''
    })
  }

  if (route.name === 'AdminStats') {
    items.push({
      text: 'Статистика',
      icon: ''
    })
  }

  return items
})
</script>
