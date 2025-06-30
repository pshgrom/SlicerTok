<template>
  <div class="table-settings">
    <div class="table-settings-search">
      <VCustomInput
        v-model.trim="walletId"
        :label="'Поиск по кошельку'"
        :hideDetails="true"
        @updateValue="searchByWallet"
      />
    </div>
  </div>
  <TableDataWalletList
    class="table-settings__table"
    :headers="headers"
    :isLoading="isLoading"
    :items="walletId ? calcItems : paginatedItems"
    :items-per-page="perPage"
  ></TableDataWalletList>
  <v-pagination
    v-model="currentPage"
    :length="pageCount"
    class="mt-4 custom-pagination sticky-pagination"
    density="comfortable"
    :total-visible="6"
    rounded="circle"
  ></v-pagination>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ITableHeaders, IWalletListItems } from '@/interfaces/AppModel'
import { walletListHeaders } from '@/constants/tableHeaders'
import TableDataWalletList from '@/components/tables/TableDataWalletList.vue'
import { useWalletList } from '@/stores/WalletList'
import VCustomInput from '@/components/base/VCustomInput.vue'
import debounce from 'lodash/debounce'

const walletList = useWalletList()

const currentPage = ref(1)
const walletId = ref('')

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return calcDataAmountList.value.slice(start, start + perPage.value)
})

const pageCount = computed(() => Math.ceil(calcDataAmountList.value.length / perPage.value))

const isLoading = computed(() => walletList.isLoading)
// const perPage = computed(() => walletList.perPage)
const perPage = ref(50)
const calcDataAmountList = computed<IWalletListItems[]>(() => walletList.calcDataWalletList)

const headers = ref<ITableHeaders[]>(walletListHeaders)

const calcItems = ref([])

const getRequest = () => {
  walletList.setDataWalletList()
}

const searchByWallet = debounce((walletId: string) => {
  let result: any[] = []
  Object.values(calcDataAmountList.value).forEach((el) => {
    if (el.wallet_id_interaction === walletId) {
      const { wallet_id_interaction, wallet_id_out, count_wallet } = el
      result.push({
        wallet_id_interaction,
        wallet_id_out,
        count_wallet
      })
    }
  })
  calcItems.value = result?.length ? result : paginatedItems.value
}, 500)

onMounted(() => {
  getRequest()
})
</script>

<style scoped lang="scss"></style>
