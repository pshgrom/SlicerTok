<template>
  <v-dialog v-model="dialogModel" class="custom-modal" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Проверка заявки</span>
        <v-btn icon="mdi-close" variant="text" @click="dialogModel = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <div v-for="option in tasks" :key="option.key">
            <v-checkbox
              :label="option.name"
              density="compact"
              hide-details
              :model-value="selectedTasks[option.key] || false"
              @update:model-value="(val) => (selectedTasks[option.key] = val)"
            />
          </div>
          <VCustomSelect
            v-model="currentItem.status"
            :items="allStatuses"
            class="mt-4"
            :label="'Статус'"
          />
          <v-textarea
            v-model="currentItem.status_comment"
            variant="underlined"
            class="mb-4"
            label="Комментарий..."
            auto-grow
            rows="1"
            dense
            hide-details
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <VCusomButton :customClass="['light', 'avg']" @click="closeDialog"> Отмена </VCusomButton>
        <VCusomButton
          :customClass="['dark', 'avg']"
          :disabled="currentItem.status === 'todo'"
          @click="change"
        >
          Сохранить
        </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminInfo } from '@/stores/AdminInfo.ts'
import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomSelect from '@/components/base/VCustomSelect.vue'

const props = defineProps({
  modelValue: Boolean,
  currentItem: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'update:currentItem', 'changeState'])

const adminInfo = useAdminInfo()

const initialValue = ref({})

const allStatuses = [
  { label: 'Новая', value: 'todo', disabled: true },
  { label: 'Одобрено', value: 'approved' },
  { label: 'Отклонено', value: 'rejected' }
]

const formRef = ref(null)

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentItem = computed({
  get: () => props.currentItem,
  set: (val) => emit('update:currentItem', val)
})

const tasks = computed({
  get: () => adminInfo.tasks,
  set: (val) => (adminInfo.tasks = val)
})

const selectedTasks = computed({
  get: () => adminInfo.selectedTasks,
  set: (val) => (adminInfo.selectedTasks = val)
})

const closeDialog = () => {
  resetForm()
  emit('update:modelValue', false)
}

const resetForm = () => {
  currentItem.value = { ...initialValue.value }
}

const change = () => {
  emit('changeState', currentItem.value, selectedTasks.value)
  emit('update:modelValue', false)
}

adminInfo.getTask()
</script>

<style scoped lang="scss"></style>
