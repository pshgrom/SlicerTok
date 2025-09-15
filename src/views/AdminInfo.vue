<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Заявки</div>
      <div>
        <TabsSwitcher :tabs="tabsContent" initial-tab="tab1" @tab-click="goToPage" />
      </div>
    </div>
    <div class="table-actions__right">
      <DateFilter
        v-model="queryParams.user_created_at"
        label="Поиск по дате регистрации нарезчика"
        @update:model-value="onDateChangeSlicer"
      />
      <DateFilter
        v-model="queryParams.created_at"
        label="Поиск по дате загрузки видео"
        @update:model-value="onDateChangeVideo"
      />
      <VCusomButton :custom-class="['light']" class="ml-2" @click="resetFilters">
        Сбросить все
      </VCusomButton>
    </div>
  </div>
  <TableAdminInfo
    :headers="headers"
    :is-loading="isLoading"
    :items="calcDataItems"
    :items-per-page="queryParams.perPage"
    :selected-index="selectedIndex"
    @finish-check="finishCheck"
    @request-verification="requestVerification"
    @change-state="changeState"
    @save-mark="saveMark"
    @custom-sort="customSort"
    @row-click="onRowClick"
  />
  <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
    <TablePagination
      v-model:query-params="queryParams"
      :loading="isLoading"
      :total-pages="totalPages"
      @change-page="changePage"
    />
  </div>
  <!--  <transition name="scale-fade">-->
  <!--    <SidePanel-->
  <!--      v-if="selected"-->
  <!--      :selected="selected"-->
  <!--      :is-first="selectedIndex === 0"-->
  <!--      :is-last="selectedIndex === calcDataItems.length - 1"-->
  <!--      @prev="prevRow"-->
  <!--      @next="nextRow"-->
  <!--    />-->
  <!--  </transition>-->
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import DateFilter from '@/components/base/DateFilter.vue'
import TabsSwitcher from '@/components/base/TabsSwitcher.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import TableAdminInfo from '@/components/tables/TableAdminInfo.vue'
import TablePagination from '@/components/tables/TablePagination.vue'
import { adminInfoHeaders } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParamsAdmin, IUserInfoData } from '@/interfaces/AppModel'
import { useAdminInfo } from '@/stores/AdminInfo'
import { useError } from '@/stores/Errors.ts'

const headers = ref<ITableHeaders[]>(adminInfoHeaders)
const errorStore = useError()

const tabsContent = [
  { id: 'tab1', title: 'На модерации', count: 0, redirect: '/admin-info' },
  { id: 'tab2', title: 'Проверенные', count: 0, redirect: '/admin-info-checked' }
]
const adminInfo = useAdminInfo()
// const selected = ref(null)
const selectedIndex = ref(-1)
const isLoading = computed(() => adminInfo.isLoading)
const router = useRouter()
const calcDataItems = computed<IUserInfoData[]>(() => adminInfo.adminInfoData)

const queryParams = computed<ITableParamsAdmin>({
  get() {
    return adminInfo.queryParams
  },
  set(val) {
    adminInfo.setQueryParams(val)
  }
})

const goToPage = (path: string) => {
  router.push(path.redirect)
}

const onRowClick = (item) => {
  //   selected.value = item?.item ?? {}
  //   selectedIndex.value = item.index
}

// const prevRow = () => {
//   if (selectedIndex.value > 0) {
//     selectedIndex.value--
//     selected.value = calcDataItems.value[selectedIndex.value]
//   }
// }
//
// const nextRow = () => {
//   if (selectedIndex.value < calcDataItems.value.length - 1) {
//     selectedIndex.value++
//     selected.value = calcDataItems.value[selectedIndex.value]
//   }
// }

const onDateChangeSlicer = (val: string) => {
  if (val) {
    queryParams.value = {
      ...queryParams.value,
      user_created_at: val,
      page: 1
    }
  } else {
    queryParams.value = {
      ...queryParams.value,
      user_created_at: undefined
    }
  }
  getRequest()
}

const resetFilters = () => {
  Object.keys(queryParams.value).forEach((key) => {
    delete queryParams.value[key]
  })
  queryParams.value.page = 1
  queryParams.value.perPage = 20
  getRequest()
}

const onDateChangeVideo = (val: string) => {
  if (val) {
    queryParams.value = {
      ...queryParams.value,
      created_at: val,
      page: 1
    }
  } else {
    queryParams.value = {
      ...queryParams.value,
      created_at: undefined
    }
  }
  getRequest()
}

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

const cleanNumber = (str: string) => str.replace(/\D/g, '')

const changeState = async (item, selectedTasks) => {
  const { id, status, status_comment, number_views_moderation, coefficient } = item
  const data = {
    id,
    status,
    status_comment,
    number_views_moderation: cleanNumber(number_views_moderation),
    rules: selectedTasks,
    coefficient
  }
  try {
    await adminInfo.setPublicationStatus(data)
    getRequest()
  } catch (error: any) {
    errorStore.setErrors(error.response?.data?.message ?? '')
  }
}

const saveMark = async (markData: any) => {
  const { data } = await adminInfo.saveMark(markData)
  const msg = data?.message ?? ''
  errorStore.setErrors(msg, 'success')
  if (data?.code === 200) {
    getRequest()
  }
}

const customSort = (sortData) => {
  if (sortData && Object.keys(sortData).length) {
    queryParams.value = {
      ...queryParams.value,
      ...sortData,
      page: 1
    }
  } else {
    queryParams.value = {
      sort_user_created_at: undefined,
      sort_created_at: undefined,
      page: 1
    }
  }
  getRequest()
}

const finishCheck = async (id: number) => {
  const { data } = await adminInfo.finishCheck(id)
  const msg = data?.message ?? ''
  errorStore.setErrors(msg, 'success')
  if (data?.code === 200) {
    getRequest()
  }
}

const requestVerification = async (id: number) => {
  const { data } = await adminInfo.requestVerification(id)
  const msg = data?.message ?? ''
  errorStore.setErrors(msg, 'success')
  if (data?.code === 200) {
    getRequest()
  }
}

const getRequest = () => {
  const { page } = queryParams.value
  router.push({
    query: {
      ...queryParams.value,
      page: page ?? 1,
      total: undefined
    }
  })
  adminInfo.getPublicationsList(queryParams.value)
}

// const handleKeydown = (e) => {
//   if (!calcDataItems.value.length) return
//   if (e.key === 'ArrowUp') {
//     e.preventDefault()
//     prevRow()
//   }
//   if (e.key === 'ArrowDown') {
//     e.preventDefault()
//     nextRow()
//   }
// }

onMounted(() => {
  queryParams.value = {
    ...router.currentRoute.value.query
  }
  getRequest()
  adminInfo.getCoefficient()
  adminInfo.getAdminInfo()
  // window.addEventListener('keydown', handleKeydown)
})

// onBeforeUnmount(() => {
//   window.removeEventListener('keydown', handleKeydown)
// })
</script>

<style scoped lang="scss">
.table-settings-filter {
  margin: 0;
}
</style>
