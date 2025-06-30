<template>
  <div class="graph">
    <DoughnutChart :chartData="dataGraphDef" />
  </div>
  <div class="table-settings">
    <div class="table-settings-search">
      <VCustomInput
        v-model.trim="queryParams.walletId"
        :label="'Поиск по кошельку'"
        :hideDetails="true"
        @updateValue="searchByWallet"
      />
    </div>
    <div class="table-settings-filter">
      <div class="table-settings-filter__wrapper">
        <VCustomSelect
          v-model="queryParams.status"
          :label="'Статус суммы'"
          :items="statusSum"
          @updateStatus="changeSumStatus"
          :style="{ width: '140px' }"
        />
        <v-btn class="table-settings-filter__reset" size="x-small" @click="resetFilters">
          Сбросить
        </v-btn>
      </div>
    </div>
  </div>
  <TableDataAmountList
    class="table-settings__table"
    :headers="headers"
    :isLoading="isLoading"
    :items="calcDataAmountList"
    v-model:options="options"
    :items-per-page="queryParams.perPage"
    @update:options="onOptionsUpdate"
  ></TableDataAmountList>
  <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">
    <TablePagination
      v-model:queryParams="queryParams"
      :loading="isLoading"
      :totalPages="totalPages"
      @changePage="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import TablePagination from '@/components/tables/TablePagination.vue'
import { computed, onMounted, ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { ITableHeaders, IAmountListItems, IAmountListParams } from '@/interfaces/AppModel'
import { amountListHeaders } from '@/constants/tableHeaders'
import { useAmountList } from '@/stores/AmountList'
import { useRouter } from 'vue-router'
import TableDataAmountList from '@/components/tables/TableDataAmountList.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import VCustomSelect from '@/components/base/VCustomSelect.vue'
import { getSortParams } from '@/utils/params'
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const dataGraphDef = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [
        'rgb(57,222,40)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(255, 99, 132)'
      ]
    }
  ]
})

const statusSum = [
  {
    label: 'Дефицит',
    value: 'deficit'
  },
  {
    label: 'Свыше',
    value: 'over'
  },
  {
    label: 'Точно',
    value: 'exactly'
  }
]

const amountList = useAmountList()
const router = useRouter()
const sort = ref({})

const options = ref({
  sortBy: [],
  sortDesc: []
})

const isLoading = computed(() => amountList.isLoading)
const calcDataAmountList = computed<IAmountListItems[]>(() => amountList.calcDataAmountList)

const calcGraphData = computed(() => amountList.graphData)
const headers = ref<ITableHeaders[]>(amountListHeaders)

const graphLabel = {
  actual_payout_amount_for_doc: 'Фактическая сумма выплаты по документу',
  actual_payout_amount_undefined: 'Фактическая сумма выплаты не определена',
  declared_payment_amount: 'заявленная сумма платежа',
  shortage: 'Дефицит'
}

const totalPages = computed(() =>
  queryParams.value?.total && queryParams.value?.perPage
    ? Math.ceil(queryParams.value.total / queryParams.value.perPage)
    : 0
)

const queryParams = computed<IAmountListParams>({
  get() {
    return amountList.queryParams
  },
  set(val) {
    amountList.setQueryParams(val)
  }
})

const searchByWallet = debounce((walletId: string) => {
  queryParams.value = {
    ...queryParams.value,
    walletId: walletId ? walletId : undefined,
    page: 1
  }
  getRequest()
}, 500)

const changePage = (page: number) => {
  queryParams.value = {
    ...queryParams.value,
    page: +page
  }
  getRequest()
}

const changeSumStatus = (status: string) => {
  queryParams.value = {
    ...queryParams.value,
    status,
    page: 1
  }
  getRequest()
}

const onOptionsUpdate = (e: any) => {
  if (e?.sortBy.length) {
    const sortByKey = e.sortBy[0].key
    const order = e.sortBy[0].order
    sort.value = {
      ...sort.value,
      [sortByKey]: order
    }
    queryParams.value = {
      ...queryParams.value,
      ...sort.value
    }
    getRequest()
  }
}

const resetFilters = () => {
  sort.value = {}
  queryParams.value = {
    page: 1,
    perPage: 50,
    walletId: undefined,
    status: undefined,
    ...sort.value
  }
  getRequest()
}

const getRequest = () => {
  const { page, perPage, status, walletId } = queryParams.value
  router.push({
    query: {
      page: page ?? 1,
      perPage: perPage,
      status: status ?? undefined,
      walletId: walletId ?? undefined,
      ...sort.value
    }
  })
  amountList.setDataAmountList(queryParams.value, sort.value)
}

watch(
  () => calcGraphData.value,
  (val) => {
    if (Object.keys(val).length) {
      Object.keys(val).forEach((key) => {
        dataGraphDef.value.labels.push(`${graphLabel[key]} (${val[key]})`)
        const filterNumber = filterDigits(val[key])
        dataGraphDef.value.datasets[0].data.push(filterNumber)
      })
    }
  }
)

const filterDigits = (str: string) => str.replace(/\D/g, '')

onMounted(() => {
  sort.value = getSortParams(router.currentRoute.value.query, sort.value)
  const { page = 1, perPage = 50, status, walletId } = router.currentRoute.value.query
  queryParams.value = {
    page,
    perPage,
    status,
    walletId,
    ...sort.value
  }
  getRequest()
  amountList.setReceivedStatistic()
})
</script>

<style scoped lang="scss"></style>
