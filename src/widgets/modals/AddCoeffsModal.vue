<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Добавить значение</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <VCustomInput
            v-model="newCoeff"
            label="Коэффициент"
            required
            autofocus
            pattern="^\d+\.\d+$"
            :rules="[coeffsRules.required, coeffsRules.format, coeffsRules.min, coeffsRules.max]"
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
import { computed, ref } from 'vue'

import { coeffsRules } from '@/shared/lib'
import VCusomButton from '@/shared/ui/VCusomButton.vue'
import VCustomInput from '@/shared/ui/VCustomInput.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'save'])

const formRef = ref(null)
const newCoeff = ref<string>('')

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
    emit('save', newCoeff.value)
  }
}
</script>
