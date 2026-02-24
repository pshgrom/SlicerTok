<template>
  <AdminBreadcrumbs />
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Админы стримера</div>
    </div>
  </div>
  <TableStreamerAdmins :headers="headers" :is-loading="isLoading" :items="calcDataItems" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAdminMain } from '@/entities/admin'
import { streamerMainInfoHeaders } from '@/shared/config'
import type { ITableHeaders } from '@/shared/config/types/app-model'
import { AdminBreadcrumbs } from '@/widgets/admin-breadcrumbs'
import { TableStreamerAdmins } from '@/widgets/tables'

const headers = ref<ITableHeaders[]>(streamerMainInfoHeaders)

const adminMainStore = useAdminMain()
const router = useRouter()
const route = useRoute()

const isLoading = computed(() => adminMainStore.loadingAdminsForCurrentStreamer)

const calcDataItems = computed(
  () => adminMainStore.adminsForCurrentStreamer.filter((el) => !el?.name?.includes('Finance')) ?? []
)

onMounted(async () => {
  await router.isReady()
  const id = route.params.streamerId
  await adminMainStore.getAdminsForCurrentStreamer(id)
})
</script>
