<!--<template>-->
<!--  <div class="graph">-->
<!--    <DoughnutChart :chartData="dataGraphDef" />-->
<!--  </div>-->
<!--  <div class="table-settings">-->
<!--    <div class="table-settings-search">-->
<!--      <VCustomInput-->
<!--        v-model.trim="queryParams.walletId"-->
<!--        :label="'Поиск по кошельку'"-->
<!--        :hideDetails="true"-->
<!--        @updateValue="searchByWallet"-->
<!--      />-->
<!--    </div>-->
<!--    <div class="table-settings-filter">-->
<!--      <div class="table-settings-filter__wrapper">-->
<!--        <VCustomSelect-->
<!--          v-model="queryParams.declaredStatus"-->
<!--          :label="'Заявленный статус'"-->
<!--          :items="statuses"-->
<!--          @updateStatus="changeDeclaredStatus"-->
<!--          :style="{ width: '140px' }"-->
<!--        />-->
<!--        <VCustomSelect-->
<!--          v-model="queryParams.actualStatus"-->
<!--          :label="'Актуальный статус'"-->
<!--          :items="statuses"-->
<!--          @updateStatus="changeActualStatus"-->
<!--          :style="{ width: '140px' }"-->
<!--        />-->
<!--        <VCustomSelect-->
<!--          v-model="queryParams.suspicionStatus"-->
<!--          :label="'Подозрительный статус'"-->
<!--          :items="statusesSuspicion"-->
<!--          @updateStatus="changeSuspicionStatus"-->
<!--          :style="{ width: '140px' }"-->
<!--        />-->
<!--        <v-btn class="table-settings-filter__reset" size="x-small" @click="resetFilters">-->
<!--          Сбросить-->
<!--        </v-btn>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--  <TableData-->
<!--    :headers="headers"-->
<!--    :isLoading="isLoading"-->
<!--    :items="calcDataWallet"-->
<!--    :items-per-page="queryParams.perPage"-->
<!--  ></TableData>-->
<!--  <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">-->
<!--    <TablePagination-->
<!--      v-model:queryParams="queryParams"-->
<!--      :loading="isLoading"-->
<!--      :totalPages="totalPages"-->
<!--      @changePage="changePage"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import TableData from '@/components/tables/TableData.vue'-->
<!--import { computed, onMounted, ref, watch } from 'vue'-->
<!--import { paymentListHeaders } from '@/constants/tableHeaders'-->
<!--import { ITableHeaders, ITableItems, ITableParams } from '@/interfaces/AppModel'-->
<!--import { usePaymentList } from '@/stores/PaymentList'-->
<!--import TablePagination from '@/components/tables/TablePagination.vue'-->
<!--import { useRouter } from 'vue-router'-->
<!--import VCustomSelect from '@/components/base/VCustomSelect.vue'-->
<!--import VCustomInput from '@/components/base/VCustomInput.vue'-->
<!--import debounce from 'lodash/debounce'-->
<!--import { DoughnutChart } from 'vue-chart-3'-->
<!--import { Chart, registerables } from 'chart.js'-->

<!--Chart.register(...registerables)-->

<!--const dataGraphDef = ref({-->
<!--  labels: [],-->
<!--  datasets: [-->
<!--    {-->
<!--      data: [],-->
<!--      backgroundColor: ['rgb(255, 205, 86)', 'rgb(54, 162, 235)', 'rgb(255, 99, 132)']-->
<!--    }-->
<!--  ]-->
<!--})-->

<!--const headers = ref<ITableHeaders[]>(paymentListHeaders)-->
<!--const wallet = usePaymentList()-->
<!--const router = useRouter()-->

<!--const statuses = [-->
<!--  {-->
<!--    label: 'Оплачено',-->
<!--    value: 'paid'-->
<!--  },-->
<!--  {-->
<!--    label: 'Не отплачено',-->
<!--    value: 'not_paid'-->
<!--  }-->
<!--]-->

<!--const statusesSuspicion = [-->
<!--  {-->
<!--    label: 'Подозрительный',-->
<!--    value: 'yes_suspicion'-->
<!--  },-->
<!--  {-->
<!--    label: 'Не подозрительный',-->
<!--    value: 'no_suspicion'-->
<!--  }-->
<!--]-->

<!--const graphLabel = {-->
<!--  transactions_all: 'Все транзакции',-->
<!--  transactions_found: 'Найденые транзакции',-->
<!--  transactions_not_found: 'Транзакции не найдены'-->
<!--}-->

<!--const queryParams = computed<ITableParams>({-->
<!--  get() {-->
<!--    return wallet.queryParams-->
<!--  },-->
<!--  set(val) {-->
<!--    wallet.setQueryParams(val)-->
<!--  }-->
<!--})-->

<!--const calcDataWallet = computed<ITableItems[]>(() => wallet.calcDataWallet)-->
<!--const calcGraphData = computed(() => wallet.graphData)-->

<!--const isLoading = computed(() => wallet.isLoading)-->

<!--const searchByWallet = debounce((walletId: string) => {-->
<!--  queryParams.value = {-->
<!--    ...queryParams.value,-->
<!--    walletId: walletId ? walletId : undefined,-->
<!--    page: 1-->
<!--  }-->
<!--  getRequest()-->
<!--}, 500)-->

<!--watch(-->
<!--  () => calcGraphData.value,-->
<!--  (val) => {-->
<!--    if (Object.keys(val).length) {-->
<!--      Object.keys(val).forEach((key) => {-->
<!--        dataGraphDef.value.labels.push(`${graphLabel[key]} (${val[key].amount})`)-->
<!--        dataGraphDef.value.datasets[0].data.push(val[key].total)-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--)-->

<!--const changeDeclaredStatus = (declaredStatus: string) => {-->
<!--  queryParams.value = {-->
<!--    ...queryParams.value,-->
<!--    declaredStatus,-->
<!--    page: 1-->
<!--  }-->
<!--  getRequest()-->
<!--}-->

<!--const resetFilters = () => {-->
<!--  queryParams.value = {-->
<!--    page: 1,-->
<!--    perPage: 50,-->
<!--    declaredStatus: undefined,-->
<!--    actualStatus: undefined,-->
<!--    suspicionStatus: undefined,-->
<!--    walletId: undefined-->
<!--  }-->
<!--  getRequest()-->
<!--}-->

<!--const changeActualStatus = (actualStatus: string) => {-->
<!--  queryParams.value = {-->
<!--    ...queryParams.value,-->
<!--    actualStatus,-->
<!--    page: 1-->
<!--  }-->
<!--  getRequest()-->
<!--}-->

<!--const changeSuspicionStatus = (suspicionStatus: string) => {-->
<!--  queryParams.value = {-->
<!--    ...queryParams.value,-->
<!--    suspicionStatus,-->
<!--    page: 1-->
<!--  }-->
<!--  getRequest()-->
<!--}-->

<!--const changePage = (page: number) => {-->
<!--  queryParams.value = {-->
<!--    ...queryParams.value,-->
<!--    page: +page-->
<!--  }-->
<!--  getRequest()-->
<!--}-->

<!--const totalPages = computed(() =>-->
<!--  queryParams.value?.total && queryParams.value?.perPage-->
<!--    ? Math.ceil(queryParams.value.total / queryParams.value.perPage)-->
<!--    : 0-->
<!--)-->
<!--const getRequest = () => {-->
<!--  const { page, perPage, declaredStatus, actualStatus, walletId, suspicionStatus } =-->
<!--    queryParams.value-->
<!--  router.push({-->
<!--    query: {-->
<!--      page: page ?? 1,-->
<!--      perPage: perPage,-->
<!--      declaredStatus: declaredStatus ?? undefined,-->
<!--      suspicionStatus: suspicionStatus ?? undefined,-->
<!--      actualStatus: actualStatus ?? undefined,-->
<!--      walletId: walletId ?? undefined-->
<!--    }-->
<!--  })-->
<!--  wallet.setDataWallet(queryParams.value)-->
<!--}-->

<!--onMounted(() => {-->
<!--  const {-->
<!--    page = 1,-->
<!--    perPage = 50,-->
<!--    declaredStatus,-->
<!--    suspicionStatus,-->
<!--    actualStatus,-->
<!--    walletId-->
<!--  } = router.currentRoute.value.query-->
<!--  queryParams.value = {-->
<!--    page,-->
<!--    perPage,-->
<!--    declaredStatus,-->
<!--    suspicionStatus,-->
<!--    actualStatus,-->
<!--    walletId-->
<!--  }-->
<!--  getRequest()-->
<!--  wallet.setPaymentStatistic()-->
<!--})-->
<!--</script>-->

<!--<style lang="scss"></style>-->
