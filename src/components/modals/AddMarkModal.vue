<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Добавить пометку</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-textarea
            v-model="newMark"
            variant="underlined"
            class="mb-4"
            auto-grow
            rows="1"
            dense
            hide-details
            label="Текст"
            required
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
import { computed, ref } from 'vue'
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
const newMark = ref('')

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
    emit('save', newMark.value)
    dialog.value = false
  }
}
</script>
