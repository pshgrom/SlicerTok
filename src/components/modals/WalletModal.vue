<template>
  <v-dialog class="custom-modal" v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Добавить кошелек</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <VCustomInput
            label="Адрес кошелька"
            required
            v-model="wallet.address"
            :rules="[requiredRules.required]"
            autofocus
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <VCusomButton :customClass="['light', 'avg']" @click="closeModal"> Отмена </VCusomButton>
        <VCusomButton :customClass="['dark', 'avg']" @click="submit"> Сохранить </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { requiredRules } from '@/utils/validators.ts'
import VCusomButton from '@/components/base/VCusomButton.vue'

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
    dialog.value = false
  }
}
</script>
