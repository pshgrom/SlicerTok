<template>
  <v-dialog v-model="dialogModel" class="custom-modal" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">Изменить профиль</span>
        <v-btn icon="mdi-close" variant="text" @click="dialogModel = false" />
      </v-card-title>
      <v-card-text>
        <div class="change-info">
          <div class="change-info__icon">
            <SvgIcon name="info" />
          </div>
          <div class="change-info__text">
            Вы можете менять информацию 1 раз в неделю.
            <span v-if="endDate">Следующий раз {{ endDate }}</span>
          </div>
        </div>
        <v-form ref="formRef">
          <VCustomInput
            v-model.trim="form.name"
            label="Ваше имя"
            class="mb-5"
            autofocus
            :rules="[infoRules.required, infoRules.name]"
          />
          <VCustomInput
            v-model.trim="form.phone"
            label="Номер телефона"
            class="mb-5"
            :rules="[infoRules.required, infoRules.phone]"
          />
          <VCustomInput
            v-model.trim="form.email"
            label="Почта"
            class="mb-5"
            :rules="[infoRules.required, infoRules.email, infoRules.noCyrillic]"
          />
          <VCustomInput
            v-model.trim="form.telegram"
            label="Никнейм в Telegram"
            :rules="[infoRules.telegram, infoRules.required, infoRules.noCyrillic]"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <VCusomButton :custom-class="['light', 'avg']" @click="cancel"> Отмена </VCusomButton>
        <VCusomButton :custom-class="['dark', 'avg']" @click="save"> Сохранить </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'

import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import type { IUser } from '@/interfaces/Slicer'
import { infoRules } from '@/utils/validators'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false
  },
  endDate: {
    type: String,
    default: null
  },
  user: {
    type: Object as PropType<IUser>,
    default: () => ({})
  }
})
const emit = defineEmits(['update', 'update:dialog'])

const initialUser = ref({ ...props.user })
const formRef = ref(null)
const form = ref({ ...initialUser.value })

const dialogModel = computed({
  get: () => props.dialog,
  set: (val) => emit('update:dialog', val)
})

watch(
  () => props.user,
  (newUser) => {
    initialUser.value = { ...newUser }
    resetForm()
  }
)

const resetForm = () => {
  form.value = { ...initialUser.value }
}

const save = async () => {
  const isValid = await formRef?.value?.validate()
  if (isValid.valid) {
    emit('update', { ...form.value })
    dialogModel.value = false
  }
}

const cancel = () => {
  resetForm()
  dialogModel.value = false
}
</script>

<style lang="scss" scoped>
.change-info {
  height: 44px;
  display: flex;
  align-items: center;
  background: rgba(242, 246, 254, 1);
  border-radius: 12px;
  padding: 0 12px;
  margin-bottom: 25px;

  &__text {
    font-size: 12px;
    margin-left: 10px;
    letter-spacing: 0;
    line-height: normal;
  }
}

:deep(.v-card-text) {
  padding-top: 0 !important;
}
</style>
