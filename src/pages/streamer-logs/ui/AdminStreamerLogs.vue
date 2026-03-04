<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Логи</div>
    </div>
    <div class="table-actions__right">
      <VCustomSelect
        v-model="adminLog"
        :items="allAdmins"
        style="width: 300px"
        class="mr-1"
        :label="'Выбрать админа'"
        @update-status="changeAdminLog"
      >
        <template #item="{ item, props: slotProps }">
          <v-list-item v-bind="slotProps">
            {{ item.text }}
          </v-list-item>
        </template>
      </VCustomSelect>
      <VCustomSelect
        v-model="actionLog"
        :items="allStatuses"
        style="width: 300px"
        :label="'Выбрать действие'"
        @update-status="changeActionLog"
      >
        <template #item="{ item, props: slotProps }">
          <v-list-item v-bind="slotProps">
            {{ item.text }}
          </v-list-item>
        </template>
      </VCustomSelect>
    </div>
  </div>
  <TableStreamerLogs
    :headers="headers"
    :is-loading="isLoading"
    :items="logs"
    :items-per-page="queryParams.perPage"
  />
  <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
    <TablePagination
      v-model:query-params="queryParams"
      :loading="isLoading"
      :total-pages="totalPages"
      @change-page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useStreamer } from '@/entities/streamer'
import { adminMainLogs } from '@/shared/config'
import type { ITableHeaders, ITableParams } from '@/shared/config/types/app-model'
import { TablePagination } from '@/shared/ui'
import { TableStreamerLogs } from '@/widgets/tables'

import VCustomSelect from '../../../shared/ui/VCustomSelect.vue'

const headers = ref<ITableHeaders[]>(adminMainLogs)

const streamer = useStreamer()
const actionLog = ref<string | null>(null)
const adminLog = ref<string | null>(null)
const allStatuses = computed(() => streamer.actions)
const allAdmins = computed(() => streamer.admins)

const isLoading = computed(() => streamer.isLoading)
const router = useRouter()

const logs = computed(() => streamer.logs)

const queryParams = computed<ITableParams>({
  get() {
    return streamer.queryParams
  },
  set(val) {
    streamer.setQueryParams(val)
  }
})

const totalPages = computed(() =>
  queryParams.value?.total && queryParams.value?.perPage
    ? Math.ceil(queryParams.value.total / queryParams.value.perPage)
    : 0
)

const changePage = (page: number) => {
  queryParams.value = {
    ...queryParams.value,
    page: +page
  }
  getRequest()
}

const getRequest = () => {
  const { page, perPage, action, admin_id } = queryParams.value
  router.push({
    query: {
      page: page ?? 1,
      perPage: perPage,
      action,
      admin_id
    }
  })
  streamer.getLogList(queryParams.value)
}

const changeActionLog = (val: string) => {
  queryParams.value = {
    ...queryParams.value,
    action: val || undefined
  }
  getRequest()
}

const changeAdminLog = (val: string) => {
  queryParams.value = {
    ...queryParams.value,
    admin_id: val || undefined
  }
  getRequest()
}

onMounted(() => {
  const { page = 1, perPage = 50, action, admin_id } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage,
    action,
    admin_id
  }
  actionLog.value = action?.toString()
  adminLog.value = admin_id?.toString()
  getRequest()
  streamer.getActions()
  streamer.getAdmins()
})
</script>
