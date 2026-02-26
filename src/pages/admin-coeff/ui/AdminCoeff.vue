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
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'

import { useError } from '@/app/stores'
import { useStreamer } from '@/entities/streamer'
import { adminCoeffs } from '@/shared/config'
import type { ITableHeaders, ITableParams, IUserInfoData } from '@/shared/config/types/app-model'
import SvgIcon from '@/shared/ui/SvgIcon.vue'
import VCusomButton from '@/shared/ui/VCusomButton.vue'
import { TableStreamerCoeffs } from '@/widgets/tables'

const AddCoeffsModal = defineAsyncComponent(() => import('@/widgets/modals/AddCoeffsModal.vue'))

const headers = ref<ITableHeaders[]>(adminCoeffs)

const errorStore = useError()
const streamer = useStreamer()
const isModalOpen = ref(false)

const isLoading = computed(() => streamer.isLoading)

const calcDataItems = computed<IUserInfoData[]>(() => streamer.coeffs)

const queryParams = computed<ITableParams>({
  get() {
    return streamer.queryParams
  },
  set(val) {
    streamer.setQueryParams(val)
  }
})

const removeCoeff = async (id: number) => {
  const { data } = await streamer.removeCoeff(id)
  if (data.code === 200) {
    getRequest()
  }
}

const addCoeff = async (newCoeff: string) => {
  const resp = await streamer.addNewCoeff(newCoeff)
  const msg = resp?.data?.message
  if (msg) errorStore.setErrors(msg, 'success')
  if (resp?.data?.code === 200) {
    isModalOpen.value = false
    getRequest()
  }
}

const getRequest = () => {
  streamer.getCoeffsList()
}

onMounted(() => {
  getRequest()
})
</script>
