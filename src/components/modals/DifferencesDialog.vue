<template>
  <v-dialog v-model="dialogModel" class="custom-modal" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Проверка спорных моментов</span>
        <v-btn icon="mdi-close" variant="text" @click="dialogModel = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-row
            no-gutters
            class="flex-nowrap"
            style="overflow-x: auto; white-space: nowrap; justify-content: space-around"
          >
            <v-col
              v-for="(group, groupName) in currentItem.status_moderation"
              :key="groupName"
              cols="auto"
            >
              <v-card class="info-admin" variant="outlined" rounded style="border: none !important">
                <div class="info-admin__title">{{ formatLabel(groupName) }}</div>
                <div class="info-admin-comment">
                  <div class="info-admin-comment__label">Просмотры:</div>
                  <div class="info-admin-comment__value">
                    {{ formatNumber(group.number_views_moderation) || '-' }}
                  </div>
                </div>
                <div class="info-admin-comment">
                  <div class="info-admin-comment__label">Коэффициент:</div>
                  <div class="info-admin-comment__value">
                    {{ group.coefficient.rate || '-' }}
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <div class="info-admin__title text-center">Итоговые значения</div>
          <VCustomInput
            v-if="!sameViews"
            v-model="finalViews"
            label="Количество просмотров по факту"
            :rules="[videoRules.quantityViews, videoRules.required]"
            class="mt-4 mb-2"
            @input="onInput"
          />
          <VCustomInput
            v-else
            v-model="sameViewsValue"
            label="Количество просмотров по факту"
            class="mt-4 mb-2"
            :disabled="sameViews"
          />
          <VCustomSelect
            v-if="!sameCoeffs"
            v-model="finalCoeff"
            :rules="[videoRules.required]"
            label="Коэффициенты"
            class="mb-4"
            :items="coeffs"
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                {{ item.text }}
              </v-list-item>
            </template>
          </VCustomSelect>
          <VCustomSelect
            v-else
            v-model="sameCoeffValue"
            :disabled="sameCoeffs"
            label="Коэффициенты"
            class="mb-4"
            :items="coeffs"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div>
          <VCusomButton :custom-class="['light', 'avg']" class="mr-2" @click="closeDialog">
            Отмена
          </VCusomButton>
          <VCusomButton
            v-if="!sameViews || !sameCoeffs"
            :custom-class="['dark', 'avg']"
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
import { computed, ref } from 'vue'

import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import VCustomSelect from '@/components/base/VCustomSelect.vue'
import { useAdminInfo } from '@/stores/AdminInfo.ts'
import { formatNumber } from '@/utils/formatNumbers.ts'
import { videoRules } from '@/utils/validators.ts'

const props = defineProps({
  modelValue: Boolean,
  currentItem: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'update:currentItem', 'changeFinalValues'])

const selectedTasks = ref([])
const finalCoeff = ref(null)
const finalViews = ref('')

const sameViewsValue = ref<null | number | string>(null)
const sameCoeffValue = ref<null | number>(null)

const formRef = ref(null)
const adminInfo = useAdminInfo()

const coeffs = computed(() => adminInfo.coeffs ?? [])

const sameViews = computed(() => {
  const values = Object.keys(currentItem.value.status_moderation).map(
    (item) => currentItem.value.status_moderation[item].number_views_moderation
    // (item) => 5
  )
  const firstValue = values[0]
  sameViewsValue.value = firstValue
  return values.every((value) => value === firstValue)
})

const sameCoeffs = computed(() => {
  const values = Object.keys(currentItem.value.status_moderation).map(
    (item) => currentItem.value.status_moderation[item].coefficient?.rate
    // (item) => 1
  )
  const firstValue = values[0]
  sameCoeffValue.value = firstValue
  return values.every((value) => value === firstValue)
})

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentItem = computed({
  get: () => props.currentItem,
  set: (val) => emit('update:currentItem', val)
})

const formatLabel = (label: string) => {
  switch (label) {
    case 'group_a':
      return 'Админ группы А'
    case 'group_b':
      return 'Админ группы B'
  }
}

const onInput = (val) => {
  const rawValue = typeof val === 'string' ? val : val?.target?.value || ''
  const digitsOnly = rawValue.replace(/\D/g, '')
  finalViews.value = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const closeDialog = () => {
  emit('update:modelValue', false)
}

const change = async () => {
  const isValid = await formRef?.value?.validate()
  console.warn('isValid', isValid)
  if (isValid.valid) {
    const data = {
      finalCoeff: finalCoeff.value,
      finalViews: finalViews.value
    }
    emit('changeFinalValues', data)
    // emit('update:modelValue', false)
  }
}
</script>

<style scoped lang="scss">
:deep(.v-card-text) {
  padding-top: 0 !important;
}

:deep(.v-card-actions) {
  //position: sticky;
  //bottom: 0;
  background: #fff;
}
</style>
<style lang="scss" scoped>
.info-admin {
  padding: 12px 12px 12px 0;

  &__wrap {
    display: flex;
  }

  &__title {
    font-weight: 500;
    font-size: 14px;
    color: rgba(17, 17, 17, 1);
    margin-bottom: 12px;
  }

  &-comment {
    margin-top: 10px;

    &__label {
      color: rgba(143, 150, 165, 1);
      font-size: 12px;
      font-weight: 500;
    }
    &__value {
      color: rgba(0, 0, 0, 1);
      font-size: 14px;
      line-height: 140%;
    }
  }
}
</style>
