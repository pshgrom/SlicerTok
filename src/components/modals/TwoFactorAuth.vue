<template>
  <v-dialog v-model="dialog" class="custom-modal" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Двухфакторная аутентификация</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <VCustomToggle
            v-model="enable2Fa"
            :density="'compact'"
            :hideDetails="true"
            label="Включение двухфакторной аутентификации"
            color="rgba(169, 55, 244, 1)"
            @change="onChange"
          />
        </v-form>
        <transition name="fade" mode="out-in">
          <div v-if="enable2Fa">
            <div class="instruction">
              <div class="instruction__title">Инструкция:</div>
              <ul class="instruction-list">
                <li class="instruction-list__item">
                  1. Скачайте Google Authenticator или другое приложение.
                </li>
                <li class="instruction-list__item">
                  2. Отсканируйте QR-код или введите вручную ключ.
                </li>
                <li class="instruction-list__item">3. Введите код ниже, чтобы подтвердить.</li>
              </ul>
            </div>
            <v-divider class="mt-8 mb-8" />
            <div class="get-code">
              <div class="get-code__description">
                Сканируйте QR-код в приложении Google Authenticator или другом совместимом.
              </div>
              <div class="get-code__code">
                <VueQrcode :value="qrCode" type="image/png" :width="225" />
              </div>
              <div class="get-code__text">или</div>
            </div>
          </div>
        </transition>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <VCusomButton :customClass="['light', 'avg']" @click="closeModal"> Отмена </VCusomButton>
        <VCusomButton :customClass="['dark', 'avg']" @click="submit"> Сохранить </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomToggle from '@/components/base/VCustomToggle.vue'
import VueQrcode from 'vue-qrcode'
import { useUserInfo } from '@/stores/UserInfo.ts'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'save'])

const formRef = ref(null)
const enable2Fa = ref(false)
const userInfo = useUserInfo()

const qrCode = computed(() => userInfo.qrCode)

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

const onChange = async (e: boolean) => {
  e ? await userInfo.enableTwoFactor() : await userInfo.disabledTwoFactor()
}

const submit = async () => {
  const isValid = await formRef?.value?.validate()
  if (isValid.valid) {
    //logic
    dialog.value = false
  }
}
</script>

<style lang="scss" scoped>
.instruction {
  background: rgba(229, 236, 253, 1);
  border-radius: 8px;
  padding: 16px;

  &__title {
    font-size: 14px;
    margin-bottom: 10px;
    color: rgba(17, 17, 17, 1);
  }

  &-list {
    padding-left: 5px;

    &__item {
      color: rgba(17, 17, 17, 1);
      font-size: 14px;
      letter-spacing: 0;

      & + .instruction-list__item {
        margin-top: 3px;
      }
    }
  }
}

:deep(.v-card-title) {
  padding-bottom: 10px !important;
}

.get-code {
  &__description {
    color: rgba(17, 17, 17, 1);
    font-size: 14px;
    line-height: 140%;
    letter-spacing: 0;
  }

  &__code {
    display: flex;
    justify-content: center;
  }

  &__text {
    font-size: 14px;
    text-align: center;
    position: relative;
    top: -13px;
  }
}
</style>
