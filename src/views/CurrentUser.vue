<template>
  <div class="user-info">
    <Breadcrumbs :items="breadcrumbs" divider="/" />
    <div class="user-info__wrapper">
      <ProfileCard
        v-model:dialog="editDialog"
        :user="currentUser"
        :readonly="true"
        @verify-user="verifyUser"
      />
      <WalletsCard :wallets="wallets" :readonly="true" />
    </div>
    <div class="table-actions">
      <div class="table-actions__left">
        <div class="table-actions__label">Ваши видео</div>
      </div>
    </div>
    <TableUserInfo :headers="headers" :is-loading="isLoading" :items="slicerItems" />
    <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
      <TablePagination
        v-model:query-params="queryParams"
        :loading="isLoading"
        :total-pages="totalPages"
        @change-page="changePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Breadcrumbs from '@/components/base/Breadcrumbs.vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import TablePagination from '@/components/tables/TablePagination.vue'
import TableUserInfo from '@/components/tables/TableUserInfo.vue'
import WalletsCard from '@/components/wallets/WalletsCard.vue'
import { userInfoHeaders } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams } from '@/interfaces/AppModel'
import type { BreadcrumbItem } from '@/interfaces/Breadcrumb.ts'
import { useSupport } from '@/stores/Support.ts'

const headers = ref<ITableHeaders[]>(userInfoHeaders)
const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  {
    text: 'Пользователи',
    href: '/support-users',
    icon: 'mdi-arrow-left'
  },
  {
    text: currentUser.value.name ?? 'Юзер'
  }
])

const currentUserStore = useSupport()
const editDialog = ref(false)
// const imageFile = ref<File | null>(null)

const isLoading = computed(() => currentUserStore.isLoading)
const currentUser = computed(() => currentUserStore.currentUser)
const wallets = computed(() => currentUserStore.wallets)
const slicerItems = computed(() => currentUserStore.slicerItems)
const route = useRoute()
const router = useRouter()

const queryParams = computed<ITableParams>({
  get() {
    return currentUserStore.queryParamsSlicer
  },
  set(val) {
    currentUserStore.setQueryParamsSlicer(val)
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
  const id = Number(route.params.id)
  getInfo(id)
}

const getSlicer = async (id: number) => {
  await currentUserStore.getSlicer(id)
}

const getWallets = async (id: number) => {
  await currentUserStore.getWallets(id)
}

const getInfo = async (id: number) => {
  await currentUserStore.getInfo(id)
}

const verifyUser = async (value: boolean) => {
  const id = currentUser.value.id
  const newData = {
    id,
    is_verified: value
  }
  const resp = await currentUserStore.verifyUser(newData)
  if (resp) await router.push({ name: 'SupportUsers' })
}

onMounted(async () => {
  const id = Number(route.params.id)
  await Promise.all([getSlicer(id), getInfo(id), getWallets(id)])
})

onBeforeUnmount(() => {
  queryParams.value.page = 1
  queryParams.value.perPage = 10
  queryParams.value.total = 0
})
</script>

<style scoped lang="scss">
.user-info {
  &__wrapper {
    display: flex;
    margin-bottom: 14px;
    gap: 14px;
    align-items: stretch;

    @media (max-width: 767px) {
      flex-direction: column;
    }
  }
}
</style>
