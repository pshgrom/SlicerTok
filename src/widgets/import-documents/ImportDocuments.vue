<template>
  <div class="v-import-button inline-flex items-center">
    <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="onFileChange" />
    <VCusomButton
      :disabled="loading"
      :custom-class="['dark', 'avg']"
      class="mr-2"
      :loading="loading"
      @click="triggerFileSelect"
    >
      Импорт Excel
    </VCusomButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useError } from '@/app/stores'
import { useAdminPaymentsFinance } from '@/entities/payment'
import VCusomButton from '@/shared/ui/VCusomButton.vue'

const errorStore = useError()

const fileInput = ref<HTMLInputElement | null>(null)
const adminPaymentsFinanceStore = useAdminPaymentsFinance()
const loading = ref(false)

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const onFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file)
  try {
    loading.value = true
    const { data } = await adminPaymentsFinanceStore.importFile(formData)
    const msg = data?.message ?? ''
    errorStore.setErrors(msg, 'success')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
    input.value = ''
  }
}
</script>

<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
