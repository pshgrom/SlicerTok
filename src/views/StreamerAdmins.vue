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

import AdminBreadcrumbs from '@/components/base/AdminBreadcrumbs.vue'
import TableStreamerAdmins from '@/components/tables/TableStreamerAdmins.vue'
import { streamerMainInfoHeaders } from '@/constants/tableHeaders'
import type { ITableHeaders } from '@/interfaces/AppModel'
import { useAdminMain } from '@/stores/AdminMain.ts'

const headers = ref<ITableHeaders[]>(streamerMainInfoHeaders)

const adminMainStore = useAdminMain()
const router = useRouter()
const route = useRoute()

const isLoading = computed(() => adminMainStore.loadingAdminsForCurrentStreamer)

const calcDataItems = computed(() => adminMainStore.adminsForCurrentStreamer ?? [])

onMounted(async () => {
  await router.isReady()
  const id = route.params.streamerId
  await adminMainStore.getAdminsForCurrentStreamer(id)
})
</script>
