<template>
  <v-dialog class="custom-modal" v-model="dialogModel" max-width="831px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Подать заявку</span>
        <v-btn icon="mdi-close" variant="text" @click="dialogModel = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-card class="pa-4 mb-4 d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-1">Твой секретный ключ(добавь в описание видео):</div>
              <v-chip color="#0070BE" dark>{{ preloadKey }}</v-chip>
            </div>
            <v-btn icon @click="copyToClipboard">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-card>
          <VCustomInput
            v-model="videoFields.videoLink"
            label="Ссылка на видео *"
            :rules="[videoRules.required, videoRules.url, videoRules.noShare]"
            class="mb-4"
          />
          <VCustomInput
            v-model="videoFields.number_views"
            label="Количество просмотров *"
            :rules="[videoRules.required]"
            class="mb-4"
            required
          />
          <!--          @input="onInput"-->
          <div class="mb-4"></div>
          <VideoUploader v-model="videoFields.videoFile" />
        </v-form>
        <div>
          <span class="custom-modal__label">Вы получите деньги на кошелек:</span>
          <CurrentWallet :key="wallet.id" :wallet="wallet" :index="0" :onlyRead="true" />
        </div>
      </v-card-text>
      <v-card-actions>
        <VCusomButton :customClass="['light', 'avg']" @click="closeDialog"> Отмена </VCusomButton>
        <VCusomButton :customClass="['dark', 'avg']" @click="submitVideo">
          Отправить заявку
        </VCusomButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import VideoUploader from '@/components/modals/VideoUploader.vue'
import { useError } from '@/stores/Errors'
import type { IUploadVideo, IWallet } from '@/interfaces/Slicer'
import { videoRules } from '@/utils/validators'
import VCusomButton from '@/components/base/VCusomButton.vue'
import CurrentWallet from '@/components/wallets/CurrentWallet.vue'

const props = defineProps({
  modelValue: Boolean,
  preloadKey: {
    type: String,
    default: ''
  },
  wallet: {
    type: Object as PropType<IWallet>,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const videoFields = ref<IUploadVideo>({
  videoLink: 'https://www.instagram.com/reel/23DHlJ1NAIU6g/asdkasndjkasnfacmalcmlaksmc',
  videoFile: null,
  number_views: ''
})
const errorStore = useError()

const formRef = ref(null)

// function onInput(val) {
//   const digitsOnly = val.target.value.replace(/\D/g, '')
//   videoFields.value.number_views = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
// }

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.preloadKey || '')
  } catch (e) {
    console.error('Ошибка при копировании', e)
  }
}

const closeDialog = () => {
  emit('update:modelValue', false)
}

const submitVideo = async () => {
  const { valid } = await formRef.value?.validate()
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

:deep(.v-card-text) {
  display: flex;
  justify-content: space-between;
}

:deep(.v-form) {
  position: relative;
  &:after {
    content: '';
    position: absolute;
    right: -15px;
    top: 0;
    height: 100%;
    width: 1px;
    background: rgba(242, 246, 254, 1);
  }
}

:deep(.v-card-actions) {
  justify-content: center !important;
  padding-top: 85px !important;

  button {
    position: relative;
    left: -60px;
  }
}
</style>
