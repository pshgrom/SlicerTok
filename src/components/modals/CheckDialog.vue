<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="500px">
    <v-card>
      <v-card-title>Отправить обратно</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="statusComment"
          variant="underlined"
          label="Комметарий..."
          auto-grow
          rows="1"
          dense
          hide-details
        />
      </v-card-text>
      <v-card-actions>
        <VCusomButton :customClass="['light', 'avg']" @click="closeModal"> Отмена </VCusomButton>
        <VCusomButton :customClass="['dark', 'avg']" @click="submit"> Сохранить </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import VCusomButton from '@/components/base/VCusomButton.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentIdStatus: {
    type: [Number, null],
    default: null
  }
})
const emit = defineEmits(['update:modelValue', 'returnRecord'])

const statusComment = ref('')

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
  const data = {
    id: props.currentIdStatus,
    comment: statusComment.value ? statusComment.value : undefined
  }
  emit('returnRecord', data)
  dialog.value = false
}
</script>
