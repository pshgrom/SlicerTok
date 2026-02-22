<template>
  <AdminBreadcrumbs />
  <div class="table-actions">
    <div class="table-actions__label">Стримеры</div>
  </div>
  <v-divider />
  <v-list density="compact">
    <v-list-item
      v-for="streamer in streamers"
      :key="streamer.id"
      class="py-4 px-6 streamer-row"
      @click="goToStreamerProfile(streamer.id)"
    >
      <v-row align="center" class="w-100">
        <v-col cols="12" md="3">
          <div class="text-body-1 font-weight-medium">
            {{ streamer.name }}
          </div>
        </v-col>

        <v-col cols="12" md="9">
          <div class="d-flex flex-wrap ga-3">
            <v-chip size="small" variant="tonal" color="grey">
              <v-icon size="18" class="mr-1">mdi-video</v-icon>
              {{ streamer.statistic.publication_total }}
            </v-chip>

            <v-chip size="small" variant="tonal" color="green">
              <v-icon size="18" class="mr-1">mdi-check</v-icon>
              {{ streamer.statistic.publication_approved_total }}
            </v-chip>

            <v-chip size="small" variant="tonal" color="blue">
              <v-icon size="18" class="mr-1">mdi-clock-outline</v-icon>
              {{ streamer.statistic.publication_moderation_total }}
            </v-chip>

            <v-chip size="small" variant="tonal" color="red">
              <v-icon size="18" class="mr-1">mdi-close</v-icon>
              {{ streamer.statistic.publication_rejected_total }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAdminMain } from '@/entities/admin'
import { AdminBreadcrumbs } from '@/widgets/admin-breadcrumbs'

const adminMainStore = useAdminMain()
const router = useRouter()
const streamers = computed(() => adminMainStore.streamers)

const goToStreamerProfile = (streamerId: number) => {
  router.push({ name: 'StreamerAdmins', params: { streamerId } })
}

onMounted(() => {
  adminMainStore.getAdminMainInfo()
  adminMainStore.getMainAdminInfo()
})
</script>

<style scoped lang="scss">
.streamer-row {
  transition: background-color 0.2s ease;
}

.streamer-row:hover {
  background: #f8f9fa;
}
</style>
