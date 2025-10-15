<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Добавить кошелек</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <!--        7b1365f927a49c3e75f439c9ce85649d2e3055dbe64088c0207a32c13c28f4ca-->
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
        <VCusomButton :custom-class="['dark', 'avg']" @click="submit"> Выплатить </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { requiredRules } from '@/utils/validators.ts'

const props = defineProps({
  modelValue: {
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
