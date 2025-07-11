<!--<template>-->
<!--  &lt;!&ndash;  <ErrorAlert :message="errors.msg" :show="errors.show" />&ndash;&gt;-->
<!--  <div class="table-settings">-->
<!--    <div class="table-settings-search"></div>-->
<!--    <div class="table-settings-filter">-->
<!--      <v-btn color="#0070BE" @click="openPaymentDialog"> Создать платеж </v-btn>-->
<!--    </div>-->
<!--  </div>-->
<!--  <TableDataPayoutList-->
<!--    class="table-settings__table"-->
<!--    :headers="headers"-->
<!--    :isLoading="isLoading"-->
<!--    :items="calcDataItems"-->
<!--    :items-per-page="queryParams.perPage"-->
<!--  ></TableDataPayoutList>-->
<!--  <div v-if="totalPages !== 0" class="sticky-pagination custom-pagination">-->
<!--    <TablePagination-->
<!--      v-model:queryParams="queryParams"-->
<!--      :loading="isLoading"-->
<!--      :totalPages="totalPages"-->
<!--      @changePage="changePage"-->
<!--    />-->
<!--  </div>-->
<!--  <v-dialog v-model="dialog" max-width="600px" max-height="526px" persistent>-->
<!--    <v-card>-->
<!--      <v-card-title>Добавить данные</v-card-title>-->
<!--      <v-card-text class="scrollable-content" ref="scrollableContent">-->
<!--        <v-form ref="formRef">-->
<!--          <VCustomInput-->
<!--            class="mb-2"-->
<!--            :autofocus="true"-->
<!--            v-model="form.wallet_address"-->
<!--            :label="'Кошелек нарезчика'"-->
<!--            :rules="[rules.required]"-->
<!--          />-->
<!--          <VCustomInput-->
<!--            class="mb-2"-->
<!--            v-model="form.nikname"-->
<!--            :label="'Ник в Telegram'"-->
<!--            :rules="[rules.required, rules.telegram]"-->
<!--          />-->
<!--          <VCustomInput-->
<!--            class="mb-2"-->
<!--            v-model="form.number_views"-->
<!--            :label="'Количество просмотров'"-->
<!--            type="number"-->
<!--            :rules="[rules.required, rules.minViews]"-->
<!--          />-->
<!--          <VCustomInput-->
<!--            class="mb-2"-->
<!--            v-model="form.amount"-->
<!--            :label="'Сумма выплаты'"-->
<!--            type="number"-->
<!--            :rules="[rules.required, rules.minPayment]"-->
<!--          />-->
<!--          <div-->
<!--            class="d-flex justify-space-between align-center"-->
<!--            v-for="(video, index) in form.publications"-->
<!--            :key="video.id"-->
<!--          >-->
<!--            <VCustomInput-->
<!--              class="mb-2"-->
<!--              v-model="video.url"-->
<!--              :label="`Ссылка на видео ${index + 1}`"-->
<!--              :rules="[rules.required, rules.url]"-->
<!--            />-->
<!--            <v-btn-->
<!--              size="x-small"-->
<!--              color="primary"-->
<!--              class="ml-4"-->
<!--              @click="removeVideo(index)"-->
<!--              :disabled="form.publications.length === 1"-->
<!--              >Удалить поле</v-btn-->
<!--            >-->
<!--          </div>-->
<!--        </v-form>-->
<!--      </v-card-text>-->
<!--      <v-spacer></v-spacer>-->
<!--      <v-card-actions class="d-flex justify-space-between">-->
<!--        <v-btn color="#0070BE" @click="addNewVideo"> Добавить ссылку на видео </v-btn>-->
<!--        <div>-->
<!--          <v-btn color="red" @click="resetData()">Отмена</v-btn>-->
<!--          <v-btn color="green" @click="saveData">Сохранить</v-btn>-->
<!--        </div>-->
<!--      </v-card-actions>-->
<!--    </v-card>-->
<!--  </v-dialog>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { computed, nextTick, onMounted, reactive, ref } from 'vue'-->
<!--import { payoutListHeaders } from '@/constants/tableHeaders'-->
<!--import { IPayoutListItems, ITableHeaders, ITableParams } from '@/interfaces/AppModel'-->
<!--import { usePayoutList } from '@/stores/PayoutList'-->
<!--import TablePagination from '@/components/tables/TablePagination.vue'-->
<!--import { useRouter } from 'vue-router'-->
<!--import VCustomInput from '@/components/base/VCustomInput.vue'-->
<!--import TableDataPayoutList from '@/components/tables/TableDataPayoutList.vue'-->
<!--import { createPayment } from '@/api/payoutList'-->
<!--import { IPayout } from '@/interfaces/IPayout'-->
<!--import ErrorAlert from '@/components/base/ErrorAlert.vue'-->

<!--const headers = ref<ITableHeaders[]>(payoutListHeaders)-->
<!--const payoutList = usePayoutList()-->
<!--const router = useRouter()-->

<!--const errors = reactive({-->
<!--  show: false,-->
<!--  msg: ''-->
<!--})-->

<!--const dialog = ref(false)-->
<!--const formRef = ref(null)-->
<!--const scrollableContent = ref(null)-->
<!--const form = ref<IPayout>({-->
<!--  wallet_address: '',-->
<!--  nikname: '',-->
<!--  number_views: null,-->
<!--  amount: null,-->
<!--  publications: [-->
<!--    {-->
<!--      id: +(Date.now() + Math.floor(Math.random() * 1000)),-->
<!--      url: ''-->
<!--    }-->
<!--  ]-->
<!--})-->

<!--const addNewVideo = () => {-->
<!--  form.value.publications.push({-->
<!--    id: +(Date.now() + Math.floor(Math.random() * 1000)),-->
<!--    url: ''-->
<!--  })-->
<!--  nextTick(() => {-->
<!--    if (scrollableContent.value) {-->
<!--      scrollableContent.value.$el.scrollTop = scrollableContent.value.$el.scrollHeight-->
<!--    }-->
<!--  })-->
<!--}-->

<!--const queryParams = computed<ITableParams>({-->
<!--  get() {-->
<!--    return payoutList.queryParams-->
<!--  },-->
<!--  set(val) {-->
<!--    payoutList.setQueryParams(val)-->
<!--  }-->
<!--})-->

<!--const calcDataItems = computed<IPayoutListItems[]>(() => payoutList.calcDataItems)-->

<!--const isLoading = computed(() => payoutList.isLoading)-->

<!--const openPaymentDialog = () => {-->
<!--  dialog.value = true-->
<!--}-->

<!--const removeVideo = (index: number) => {-->
<!--  if (!form.value.publications?.length || form.value.publications?.length === 1) return-->
<!--  form.value.publications.splice(index, 1)-->
<!--}-->

<!--const changePage = (page: number) => {-->
<!--  queryParams.value = {-->
<!--    ...queryParams.value,-->
<!--    page: +page-->
<!--  }-->
<!--  getRequest()-->
<!--}-->

<!--const rules = {-->
<!--  required: (v: any) => !!v || 'Обязательно для заполнения',-->
<!--  telegram: (v: any) => /^@\w{3,}/.test(v) || 'Ник должен начинаться с @',-->
<!--  minViews: (v: any) => v > 0 || 'Минимум 1 просмотр',-->
<!--  minPayment: (v: any) => v >= 0.01 || 'Минимальная сумма 0.01',-->
<!--  url: (v: any) =>-->
<!--    /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/._-]+)?)?$/.test(v) || 'Введите корректный URL'-->
<!--}-->

<!--const resetData = () => {-->
<!--  if (dialog.value) dialog.value = false-->
<!--  ;(form.value.wallet_address = ''),-->
<!--    (form.value.nikname = ''),-->
<!--    (form.value.number_views = null),-->
<!--    (form.value.amount = null),-->
<!--    (form.value.publications = [-->
<!--      {-->
<!--        id: +Date.now() + Math.floor(Math.random() * 1000),-->
<!--        url: ''-->
<!--      }-->
<!--    ])-->
<!--}-->

<!--const saveData = async () => {-->
<!--  const isValid = await formRef?.value?.validate()-->
<!--  if (isValid.valid) {-->
<!--    const data = {-->
<!--      ...form.value,-->
<!--      number_views: +form.value.number_views!,-->
<!--      publications: form.value.publications.map((el) => el.url)-->
<!--    }-->
<!--    try {-->
<!--      const resp = await createPayment(data)-->
<!--      if (resp.status === 200) getRequest()-->
<!--    } catch (e: any) {-->
<!--      errors.show = true-->
<!--      errors.msg = e.response?.data?.message ?? ''-->
<!--    } finally {-->
<!--      dialog.value = false-->
<!--      resetData()-->
<!--    }-->
<!--  }-->
<!--}-->

<!--const totalPages = computed(() =>-->
<!--  queryParams.value?.total && queryParams.value?.perPage-->
<!--    ? Math.ceil(queryParams.value.total / queryParams.value.perPage)-->
<!--    : 0-->
<!--)-->
<!--const getRequest = () => {-->
<!--  const { page, perPage } = queryParams.value-->
<!--  router.push({-->
<!--    query: {-->
<!--      page: page ?? 1,-->
<!--      perPage: perPage-->
<!--    }-->
<!--  })-->
<!--  payoutList.setPayoutList(queryParams.value)-->
<!--}-->

<!--onMounted(() => {-->
<!--  const { page = 1, perPage = 50 } = router.currentRoute.value.query-->
<!--  queryParams.value = {-->
<!--    page,-->
<!--    perPage-->
<!--  }-->
<!--  getRequest()-->
<!--})-->
<!--</script>-->

<!--<style lang="scss">-->
<!--.scrollable-content {-->
<!--  max-height: calc(100% - 64px - 48px);-->
<!--  overflow-y: auto;-->
<!--}-->
<!--</style>-->
