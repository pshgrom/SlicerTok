<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Добавить кошелек</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <!--        TPAgKfYzRdK83Qocc4gXvEVu4jPKfeuer5-->
        <v-form ref="formRef">
          <VCustomInput
            v-model="wallet.address"
            label="Адрес кошелька"
            required
            :rules="[requiredRules.required, walletRules.isValidWallet]"
            autofocus
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <VCusomButton :custom-class="['light', 'avg']" @click="closeModal"> Отмена </VCusomButton>
        <VCusomButton :custom-class="['dark', 'avg']" @click="submit"> Сохранить </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { requiredRules, walletRules } from '@/utils/validators.ts'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'save'])

const formRef = ref(null)
const wallet = reactive({
  id: null,
  address: '',
  isMain: false
})

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const closeModal = () => {
  dialog.value = false
}

const submit = async () => {
  const isValid = await formRef?.value?.validate()
  if (isValid.valid) {
    emit('save', { ...wallet })
  }
}
</script>
