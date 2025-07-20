<template>
  <v-dialog v-model="dialogModel" class="custom-modal" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Проверка заявки</span>
        <v-btn icon="mdi-close" variant="text" @click="dialogModel = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <VCustomSelect
            v-model="currentItem.status"
            :items="allStatuses"
            class="mt-4 mb-4"
            :label="'Статус'"
          />
          <template v-if="currentItem.status === 'rejected'">
            <v-checkbox
              v-model="selectAll"
              label="Выбрать все"
              density="compact"
              hide-details
              @change="toggleSelectAll"
            />
            <v-divider />
            <div v-for="option in tasks" :key="option.key">
              <v-checkbox
                :label="option.name_reverse"
                density="compact"
                hide-details
                :model-value="selectedTasks[option.key] || false"
                @update:model-value="(val) => (selectedTasks[option.key] = val)"
              />
            </div>
          </template>
          <VCustomInput
            v-model="currentItem.number_views_moderation"
            label="Количество просмотров по факту"
            :rules="[videoRules.quantityViews]"
            class="mt-4"
            @input="onInput"
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
import { ref, computed, watch } from 'vue'
import { useAdminInfo } from '@/stores/AdminInfo.ts'
import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomSelect from '@/components/base/VCustomSelect.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { videoRules } from '@/utils/validators.ts'

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

const selectAll = ref(false)

const allStatuses = [
  { label: 'Новая', value: 'todo', disabled: true },
  { label: 'Одобрено', value: 'approved' },
  { label: 'Отклонено', value: 'rejected' }
]

const formRef = ref(null)

const toggleSelectAll = () => {
  Object.keys(selectedTasks.value).forEach((key) => {
    selectedTasks.value[key] = selectAll.value
  })
}
const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentItem = computed({
  get: () => props.currentItem,
  set: (val) => {
    emit('update:currentItem', val)
  }
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

const onInput = (val) => {
  const digitsOnly = val.target.value.replace(/\D/g, '')
  currentItem.value.number_views = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

watch(
  () => Object.values(selectedTasks.value),
  (vals) => {
    const allChecked = vals.length === tasks.value.length && vals.every((v) => v)
    if (selectAll.value !== allChecked) {
      selectAll.value = allChecked
    }
  },
  { deep: true }
)

adminInfo.getTask()
</script>

<style scoped lang="scss"></style>
