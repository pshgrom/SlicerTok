import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { getDataWalletList } from '@/api/walletList'
import type { IWalletListItems } from '@/interfaces/AppModel'

export const useWalletList = defineStore('walletListStore', () => {
  const isLoading = ref<boolean>(false)
  const perPage = ref(50)
  const dataWalletList = ref<IWalletListItems[]>([])

  const calcDataWalletList = computed<IWalletListItems[]>(() => dataWalletList.value)

  const setDataWalletList = async () => {
    try {
      isLoading.value = true
      const resp = await getDataWalletList()
      dataWalletList.value = resp?.data?.data ?? []
      dataWalletList.value = dataWalletList.value?.map((el) => {
        return {
          ...el,
          viewsDialog: false,
          showWallet: false
        }
      })
      perPage.value = dataWalletList.value.length
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    setDataWalletList,
    calcDataWalletList,
    perPage
  }
})
