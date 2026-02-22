<template>
  <v-card class="side-panel">
    <v-card-title>
      <div>
        <v-btn icon size="small" variant="text" :disabled="isFirst" @click="$emit('prev')">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" :disabled="isLast" @click="$emit('next')">
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
      </div>
      <span class="headline"># {{ currentItem.id }}</span>
      <v-btn icon="mdi-close" variant="text" @click="activePanelVal = false" />
    </v-card-title>
    <v-card-text>
      <v-form v-if="currentItem.status_moderation_admin?.current" ref="formRef">
        <VCustomSelect
          v-model="currentItem.status_moderation_admin.current.status"
          :items="allStatuses"
          class="mt-2 mb-6"
          :label="'Выберите статус'"
        >
          <template #item="{ item, props: slotProps }">
            <v-list-item v-bind="slotProps" :style="getItemStyle(item)">
              {{ item.text }}
            </v-list-item>
          </template>
        </VCustomSelect>
        <div
          v-show="currentItem.status_moderation_admin.current.status === 'rejected'"
          class="mb-4"
        >
          <transition name="fade">
            <div v-if="showError && !selectedTasks.length" class="error-message">
              Необходимо выбрать хотя бы одну причину
            </div>
          </transition>
          <v-checkbox
            v-model="selectAll"
            label="Выбрать все"
            density="compact"
            hide-details
            color="rgb(169, 55, 244)"
            :error="showError && !selectedTasks.length"
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
              required
              hide-details
              :error="showError && !selectedTasks.length"
            />
          </div>
        </div>
        <ViewsSelectField
          v-model="currentItem.status_moderation_admin.current.number_views_moderation"
          label="Количество просмотров по факту"
          :rules="[videoRules.quantityViews, videoRules.required, videoRules.quantityViewsMin]"
        />
        <VCustomSelect v-model="setCoeff" label="Коэффициенты" class="mb-6" :items="coeffs">
          <template #item="{ item, props: slotProps }">
            <v-list-item v-bind="slotProps">
              {{ item.text }}
            </v-list-item>
          </template>
        </VCustomSelect>
        <v-textarea
          v-model.trim="currentItem.status_moderation_admin.current.status_comment"
          variant="outlined"
          class="mb-4"
          label="Комментарий..."
          auto-grow
          rows="1"
          color="rgb(169, 55, 244)"
          dense
          style="height: 100px"
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
          v-if="currentItem.status_moderation_admin?.current"
          :custom-class="['dark', 'avg']"
          :disabled="
            currentItem.status_moderation_admin.current.status === 'todo' ||
            !currentItem.status_moderation_admin.current.status
          "
          @click="change"
        >
          Сохранить
        </VCusomButton>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { useAdminInfo } from '@/entities/admin'
import { videoRules } from '@/shared/lib'
import VCusomButton from '@/shared/ui/VCusomButton.vue'
import VCustomSelect from '@/shared/ui/VCustomSelect.vue'
import ViewsSelectField from '@/shared/ui/ViewsSelectField.vue'

const props = defineProps({
  isFirst: {
    type: Boolean,
    default: false
  },
  activePanel: {
    type: Boolean,
    default: false
  },
  isLast: {
    type: Boolean,
    default: false
  },
  currentItem: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'prev',
  'next',
  'update:activePanel',
  'update:currentItem',
  'changeState'
])

const initialValue = ref({})
const adminInfo = useAdminInfo()

const selectAll = ref(false)
const showError = ref(false)

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

const currentItem = computed({
  get: () => props.currentItem,
  set: (val) => emit('update:currentItem', val)
})

const allTasks = computed(() => currentItem.value?.task?.rules ?? [])
const coeffs = computed(() => adminInfo.coeffs ?? [])

const closeDialog = () => {
  resetForm()
  activePanelVal.value = false
}

type StatusItem = { value: string }
const getItemStyle = (item: StatusItem) => {
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
    return currentItem.value?.status_moderation_admin?.current?.coefficient?.id || null
  },
  set: (value) => {
    if (currentItem.value && value) {
      const selectedCoeff = coeffs.value.find((coeff) => coeff.value === value)
      if (selectedCoeff) {
        currentItem.value.status_moderation_admin.current.coefficient = {
          ...selectedCoeff,
          id: selectedCoeff.value
        }
      }
    } else if (currentItem.value && !value) {
      currentItem.value.status_moderation_admin.current.coefficient = {
        label: '',
        value: '',
        id: ''
      }
    }
  }
})

const change = async () => {
  const isValid = await formRef?.value?.validate()
  if (!isValid.valid) {
    const formEl = formRef.value?.$el || document.querySelector('.side-panel')
    const invalidField = formEl?.querySelector('.v-input--error, .v-field--error')

    if (invalidField) {
      invalidField.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
    return
  } else {
    if (
      currentItem.value.status_moderation_admin.current === 'rejected' &&
      !selectedTasks.value.length
    ) {
      showError.value = true
      return
    }
    showError.value = false
    emit('changeState', currentItem.value, selectedTasks.value)
    activePanelVal.value = false
  }
}

const onInput = (val) => {
  const rawValue = typeof val === 'string' ? val : val?.target?.value || ''
  const digitsOnly = rawValue.replace(/\D/g, '')
  currentItem.value.status_moderation_admin.number_views_moderation = digitsOnly.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ' '
  )
}

watch(
  () => currentItem.value?.status_moderation_admin?.current?.rules,
  (rules) => {
    if (rules?.length) {
      selectedTasks.value = rules.map((r) => r)
    } else {
      selectedTasks.value = []
    }
  }
)

watch(
  () => currentItem.value?.status_moderation_admin?.number_views_moderation,
  (newVal) => {
    onInput(newVal)
  }
)

watch(
  () => selectedTasks.value,
  (newSelected) => {
    selectAll.value = newSelected.length === allTasks.value.length
  },
  { deep: true }
)

onMounted(() => {
  if (currentItem.value?.status_moderation_admin?.number_views_moderation)
    onInput(currentItem.value.status_moderation_admin.number_views_moderation)
})

const activePanelVal = computed({
  get() {
    return props.activePanel
  },
  set(val) {
    emit('update:activePanel', val)
  }
})
</script>
