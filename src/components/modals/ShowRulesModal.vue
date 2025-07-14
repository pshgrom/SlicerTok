<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>Правила</v-card-title>
      <v-card-text>
        <div v-for="option in currentRules" :key="option.key">
          <v-checkbox
            :label="option.name"
            :model-value="option.value"
            :readonly="true"
            hide-details
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <VCusomButton :customClass="['light', 'avg']" @click="closeModal"> Отмена </VCusomButton>
        <VCusomButton :customClass="['dark', 'avg']" @click="closeModal"> ОК </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VCusomButton from '@/components/base/VCusomButton.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentRules: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue'])

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
</script>
