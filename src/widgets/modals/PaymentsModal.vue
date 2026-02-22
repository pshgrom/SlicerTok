<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Оплата</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <VCustomInput
            v-model="currentPay.txid"
            label="txid"
            required
            :rules="[requiredRules.required]"
            autofocus
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <VCusomButton :custom-class="['light', 'avg']" @click="closeModal"> Отмена </VCusomButton>
        <VCusomButton :custom-class="['dark', 'avg']" :loading="loadingPay" @click="submit">
          Выплатить
        </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { requiredRules } from '@/shared/lib'
import VCusomButton from '@/shared/ui/VCusomButton.vue'
import VCustomInput from '@/shared/ui/VCustomInput.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  loadingPay: {
    type: Boolean,
    default: false
  },
  currentItem: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue', 'pay', 'update:currentItem'])

const formRef = ref(null)
const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const currentPay = computed({
  get() {
    return props.currentItem
  },
  set(val) {
    emit('update:currentItem', val)
  }
})

const closeModal = () => {
  dialog.value = false
}

const submit = async () => {
  const isValid = await formRef?.value?.validate()
  if (isValid.valid) {
    const { id, txid } = currentPay.value
    const data = {
      id,
      txid
    }
    emit('pay', data)
  }
}
</script>
