<template>
  <v-dialog class="custom-modal" v-model="dialogModel" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">Изменить профиль</span>
        <v-btn icon="mdi-close" variant="text" @click="dialogModel = false" />
      </v-card-title>
      <v-card-text>
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
            :rules="[infoRules.required, infoRules.email]"
          />
          <VCustomInput
            v-model.trim="form.telegram"
            label="Никнейм в Telegram"
            :rules="[infoRules.required, infoRules.telegram]"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <VCusomButton :customClass="['light', 'avg']" @click="cancel"> Отмена </VCusomButton>
        <VCusomButton :customClass="['dark', 'avg']" @click="save"> Сохранить </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import type { IUser } from '@/interfaces/Slicer'
import { infoRules } from '@/utils/validators'
import VCusomButton from '@/components/base/VCusomButton.vue'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false
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

<style lang="scss" scoped></style>
