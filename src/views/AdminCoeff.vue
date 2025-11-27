<template>
  <div class="table-actions table-actions_admin">
    <div class="table-actions__left">
      <div class="table-actions__label">Коэффициенты</div>
    </div>
    <div class="table-actions__right">
      <VCusomButton :custom-class="['dark', 'avg']" @click="isModalOpen = true">
        <SvgIcon name="plus" /> Добавить
      </VCusomButton>
    </div>
  </div>
  <TableStreamerCoeffs
    :headers="headers"
    :is-loading="isLoading"
    :items="calcDataItems"
    :items-per-page="queryParams.perPage"
    @remove-coeff="removeCoeff"
  />
  <AddCoeffsModal v-if="isModalOpen" v-model="isModalOpen" @save="addCoeff" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import AddCoeffsModal from '@/components/modals/AddCoeffsModal.vue'
import TableStreamerCoeffs from '@/components/tables/TableStreamerCoeffs.vue'
import { adminCoeffs } from '@/constants/tableHeaders'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/interfaces/AppModel'
import { useAdminMain } from '@/stores/AdminMain'
import { useError } from '@/stores/Errors.ts'

const headers = ref<ITableHeaders[]>(adminCoeffs)

const errorStore = useError()
const adminMainStore = useAdminMain()
const isModalOpen = ref(false)

const isLoading = computed(() => adminMainStore.isLoading)

const calcDataItems = computed<IUserInfoData[]>(() => adminMainStore.coeffs)

const queryParams = computed<ITableParams>({
  get() {
    return adminMainStore.queryParams
  },
  set(val) {
    adminMainStore.setQueryParams(val)
  }
})

const removeCoeff = async (id: number) => {
  const { data } = await adminMainStore.removeCoeff(id)
  if (data.code === 200) {
    getRequest()
  }
}

const addCoeff = async (newCoeff: string) => {
  const resp = await adminMainStore.addNewCoeff(newCoeff)
  const msg = resp?.data?.message
  if (msg) errorStore.setErrors(msg, 'success')
  if (resp?.data?.code === 200) {
    isModalOpen.value = false
    getRequest()
  }
}

const getRequest = () => {
  adminMainStore.getCoeffsList()
}

onMounted(() => {
  getRequest()
})
</script>
