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
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props" :style="getItemStyle(item)">
                {{ item.text }}
              </v-list-item>
            </template>
          </VCustomSelect>
          <div v-show="currentItem.status === 'rejected'">
            <v-checkbox
              v-model="selectAll"
              label="Выбрать все"
              density="compact"
              hide-details
              color="rgb(169, 55, 244)"
              @change="toggleSelectAll"
            />
            <v-divider />
            <div v-for="option in allTasks" :key="option.key">
              <v-checkbox
                v-model="selectedTasks"
                color="rgb(169, 55, 244)"
                :label="option.name_reverse"
                :value="option.key"
                density="compact"
                hide-details
              />
            </div>
          </div>
          <VCustomInput
            v-model="currentItem.number_views_moderation"
            label="Количество просмотров по факту"
            :rules="[videoRules.quantityViews, videoRules.required]"
            class="mt-4 mb-4"
            @input="onInput"
          />
          <VCustomSelect v-model="setCoeff" label="Коэффициенты" class="mb-4" :items="coeffs">
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                {{ item.text }}
              </v-list-item>
            </template>
          </VCustomSelect>
          <v-textarea
            v-model.trim="currentItem.status_comment"
            variant="underlined"
            class="mb-4"
            label="Комментарий..."
            auto-grow
            rows="1"
            color="rgb(169, 55, 244)"
            dense
            hide-details
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div>
          <VCusomButton :custom-class="['light', 'avg']" class="mr-2" @click="closeDialog">
            Отмена
          </VCusomButton>
          <VCusomButton
            :custom-class="['dark', 'avg']"
            :disabled="currentItem.status === 'todo' || !currentItem.status"
            @click="change"
          >
            Сохранить
          </VCusomButton>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import VCustomSelect from '@/components/base/VCustomSelect.vue'
import { useAdminInfo } from '@/stores/AdminInfo.ts'
import { videoRules } from '@/utils/validators.ts'

const props = defineProps({
  modelValue: Boolean,
  currentItem: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'update:currentItem', 'changeState'])

const initialValue = ref({})
const adminInfo = useAdminInfo()

const selectAll = ref(false)

const selectedTasks = ref([])

const allStatuses = [
  { label: 'Новая', value: 'todo', disabled: true },
  { label: 'Одобрено', value: 'approved' },
  { label: 'Отклонено', value: 'rejected' },
  { label: 'Доп. проверка', value: 'na' }
]

const formRef = ref(null)

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedTasks.value = allTasks.value.map((item) => item.key)
  } else {
    selectedTasks.value = []
  }
}

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentItem = computed({
  get: () => props.currentItem,
  set: (val) => emit('update:currentItem', val)
})

const allTasks = computed(() => currentItem.value?.task?.rules ?? [])
const coeffs = computed(() => adminInfo.coeffs ?? [])

const closeDialog = () => {
  resetForm()
  emit('update:modelValue', false)
}

const getItemStyle = (item: any) => {
  if (item.value === 'na') {
    return 'color: rgb(169, 55, 244)'
  }
  return ''
}

const resetForm = () => {
  currentItem.value = { ...initialValue.value }
}

const setCoeff = computed({
  get: () => {
    return currentItem.value?.coefficient?.id || null
  },
  set: (value) => {
    if (currentItem.value && value) {
      const selectedCoeff = coeffs.value.find((coeff) => coeff.value === value)
      if (selectedCoeff) {
        currentItem.value.coefficient = {
          ...selectedCoeff,
          id: selectedCoeff.value
        }
      }
    }
  }
})

const change = async () => {
  const isValid = await formRef?.value?.validate()
  if (isValid.valid) {
    emit('changeState', currentItem.value, selectedTasks.value)
    emit('update:modelValue', false)
  }
}

const onInput = (val) => {
  const rawValue = typeof val === 'string' ? val : val?.target?.value || ''
  const digitsOnly = rawValue.replace(/\D/g, '')
  currentItem.value.number_views_moderation = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

watch(
  () => currentItem.value?.rules,
  (rules) => {
    if (rules?.length) {
      selectedTasks.value = rules.map((r) => r.key)
    } else {
      selectedTasks.value = []
    }
  }
)

watch(
  () => currentItem.value.number_views_moderation,
  (newVal) => {
    onInput(newVal)
  },
  { immediate: false }
)

watch(
  () => selectedTasks.value,
  (newSelected) => {
    selectAll.value = newSelected.length === allTasks.value.length
  },
  { deep: true }
)

onMounted(() => {
  onInput(currentItem.value.number_views_moderation)
})
</script>

<style scoped lang="scss">
:deep(.v-card-text) {
  padding-top: 0 !important;
}

:deep(.v-card-actions) {
  position: sticky;
  bottom: 0;
  background: #fff;
}

:deep(.v-card-title) {
  position: sticky;
  top: 0;
  background: #fff !important;
  z-index: 1;
}
</style>
