<template>
  <v-dialog v-model="dialogModel" class="custom-modal" max-width="831px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Подать заявку</span>
        <v-btn icon="mdi-close" variant="text" @click="dialogModel = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <VCustomInput
            v-model="videoFields.videoLink"
            label="Ссылка на видео *"
            :rules="[
              videoRules.required,
              videoRules.url,
              videoRules.noShare,
              videoRules.quantityLink
            ]"
            autofocus
            class="mb-4"
          />
          <VCustomInput
            v-model="videoFields.number_views"
            label="Количество просмотров *"
            :rules="[videoRules.required, videoRules.quantityViews]"
            class="mb-4"
            required
            @input="onInput"
          />
          <div class="mb-4"></div>
          <VideoUploader v-model="videoFields.videoFile" />
        </v-form>
        <div class="custom-modal-wallet">
          <span class="custom-modal__label">Вы получите деньги на кошелек:</span>
          <CurrentWallet :key="wallet.id" :wallet="wallet" :index="0" :only-read="true" />
        </div>
      </v-card-text>
      <v-card-actions>
        <VCusomButton :custom-class="['light', 'avg']" @click="closeDialog"> Отмена </VCusomButton>
        <VCusomButton :custom-class="['dark', 'avg']" :loading="loading" @click="submitVideo">
          Отправить заявку
        </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'

import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import VideoUploader from '@/components/modals/VideoUploader.vue'
import CurrentWallet from '@/components/wallets/CurrentWallet.vue'
import type { IUploadVideo, IWallet } from '@/interfaces/Slicer'
import { useError } from '@/stores/Errors'
import { videoRules } from '@/utils/validators'

const props = defineProps({
  modelValue: Boolean,
  wallet: {
    type: Object as PropType<IWallet>,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const videoFields = ref<IUploadVideo>({
  // https://www.instagram.com/reel/23DHlJ1NAIU6g/asdkasndjkasnfacmalcmlaksmc
  videoLink: '',
  videoFile: null,
  number_views: ''
})
const errorStore = useError()

const formRef = ref(null)

const onInput = (val) => {
  const digitsOnly = val.target.value.replace(/\D/g, '')
  videoFields.value.number_views = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const closeDialog = () => {
  emit('update:modelValue', false)
}

const submitVideo = async () => {
  const { valid } = (await formRef.value?.validate()) ?? {}
  if (!videoFields.value.videoFile) {
    errorStore.setErrors('Загрузите видео')
  }
  if (valid && videoFields.value.videoFile) {
    emit('submit', videoFields.value)
  }
}
</script>

<style scoped lang="scss">
:deep(.v-card-text) {
  display: flex;
}

.custom-modal {
  :deep(.v-overlay__content) {
    @media (max-width: 1024px) {
      max-width: 727px !important;
    }
    @media (max-width: 767px) {
      max-width: 480px !important;
    }
  }

  &-wallet {
    position: relative;
    @media (max-width: 767px) {
      order: -1;
      top: -26px;
    }
  }
}

:deep(.v-card-text) {
  display: flex;
  justify-content: space-between;

  @media (max-width: 767px) {
    flex-direction: column;
  }
}

:deep(.v-form) {
  position: relative;
  width: 420px;

  @media (max-width: 1024px) {
    max-width: 420px;
    width: 100%;
  }
  @media (max-width: 767px) {
    max-width: 100%;
  }
  &:after {
    content: '';
    position: absolute;
    right: -15px;
    top: 0;
    height: 100%;
    width: 1px;
    background: rgba(242, 246, 254, 1);

    @media (max-width: 767px) {
      display: none;
    }
  }
}

:deep(.v-card-actions) {
  justify-content: center !important;
  padding-top: 85px !important;

  @media (max-width: 767px) {
    padding-top: 25px !important;
    justify-content: end !important;
  }

  button {
    position: relative;
    left: -47px;

    @media (max-width: 767px) {
      left: -4px !important;
    }
  }
}
</style>
