<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>Добавить кошелек </v-card-title>
      <v-card-text>
        <VCustomInput label="Адрес кошелька" v-model="wallet.address" required autofocus />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeModal">Отмена</v-btn>
        <v-btn color="primary" @click="submit">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import VCustomInput from '@/components/base/VCustomInput.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'save'])

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

function submit() {
  if (!wallet.address) return
  emit('save', { ...wallet })
  dialog.value = false
}
</script>
