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
            Вы можете менять личные данные и аватар 1 раз в неделю.
            <span v-if="!isEqualDate">Следующий раз {{ endDate }}</span>
          </div>
        </div>
        <div class="upload-image">
          <span>Аватар</span>
          <UploaderImage v-model="form.avatar" />
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
        <VCusomButton
          :custom-class="['dark', 'avg']"
          :disabled="!isEqualDate || !isChanged"
          @click="save"
        >
          Сохранить
        </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'

import type { IUser } from '@/shared/config/types/slicer'
import { infoRules } from '@/shared/lib'
import UploaderImage from '@/shared/ui/UploaderImage.vue'
import VCusomButton from '@/shared/ui/VCusomButton.vue'
import VCustomInput from '@/shared/ui/VCustomInput.vue'

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
const emit = defineEmits(['update', 'update:dialog', 'update:avatar'])

const initialUser = ref({ ...props.user })
const formRef = ref(null)
const form = ref({ ...initialUser.value })

const dialogModel = computed({
  get: () => props.dialog,
  set: (val) => emit('update:dialog', val)
})

const isChanged = computed(() => JSON.stringify(form.value) !== JSON.stringify(initialUser.value))

const isEqualDate = computed(() => {
  if (!props.endDate) return true

  const target = new Date(props.endDate.replace(' ', 'T'))
  const now = new Date()

  const targetDateOnly = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // если дата с бэка больше текущей — кнопка заблокирована
  if (targetDateOnly.getTime() > nowDateOnly.getTime()) return false

  // если дата прошедшая или равна текущей — кнопка активна
  return true
})

watch(
  () => props.user,
  (newUser) => {
    initialUser.value = { ...newUser }
    resetForm()
  }
)

watch(
  () => form.value.avatar,
  (avatar) => {
    emit('update:avatar', avatar ?? '')
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
  emit('update:avatar', initialUser.value.avatar ?? '')
  resetForm()
  dialogModel.value = false
}
</script>

<style lang="scss" scoped>
.change-info {
  height: 44px;
  display: flex;
  align-items: center;
  background: rgb(var(--v-theme-chipBg));
  border-radius: 12px;
  padding: 0 12px;
  margin-bottom: 18px;

  &__text {
    font-size: 12px;
    margin-left: 10px;
    letter-spacing: 0;
    line-height: normal;
    color: rgb(var(--v-theme-primary));
  }

  @media (max-width: 767px) {
    padding: 12px;
    height: auto;
  }
}

:deep(.v-card-text) {
  padding-top: 0 !important;
}

.upload-image {
  span {
    color: rgba(143, 150, 165, 1);
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 12px;
    display: inline-block;
    letter-spacing: 0;
  }
}
</style>
