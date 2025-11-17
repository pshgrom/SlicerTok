<template>
  <v-dialog v-model="dialogModel" class="custom-modal" max-width="831px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ editMode ? 'Переподать завку' : 'Подать заявку' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="dialogModel = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <VCustomSelect
            v-model="videoFields.blogger"
            :rules="[videoRules.required]"
            :hide-details="false"
            label="Блоггер"
            class="mb-4"
            :items="streamerStore.streamerList"
          >
            <template #item="{ item, props: slotProps }">
              <v-list-item v-bind="slotProps">
                {{ item.text }}
              </v-list-item>
            </template>
          </VCustomSelect>
          <VCustomInput
            ref="videoInputRef"
            v-model.trim="videoFields.videoLink"
            label="Ссылка на видео *"
            :error-messages="videoError"
            :rules="[
              videoRules.required,
              videoRules.url,
              videoRules.noShare,
              videoRules.quantityLink
            ]"
            autofocus
            class="mb-4"
            @blur="checkVideoExists"
            @input="input"
          />
          <VCustomInput
            v-model="videoFields.number_views"
            label="Количество просмотров *"
            :rules="[videoRules.required, videoRules.quantityViews, videoRules.quantityViewsMin]"
            class="mb-4"
            required
            @input="onInput"
          />
          <div class="mb-4"></div>
          <VideoUploader v-model="videoFields.videoFile" />
          <v-checkbox
            v-model="videoFields.isBonus"
            label="Бонусное видео"
            color="rgb(169, 55, 244)"
          />
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
import { computed, type PropType, ref, watch } from 'vue'

import VCusomButton from '@/components/base/VCusomButton.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import VCustomSelect from '@/components/base/VCustomSelect.vue'
import VideoUploader from '@/components/modals/VideoUploader.vue'
import CurrentWallet from '@/components/wallets/CurrentWallet.vue'
import type { IUploadVideo, IWallet } from '@/interfaces/Slicer'
import { useError } from '@/stores/Errors'
import { useStreamers } from '@/stores/Streamers.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'
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
  },
  editMode: {
    type: Boolean,
    default: false
  },
  videoLink: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])
const userInfoStore = useUserInfo()

const videoFields = ref<IUploadVideo>({
  videoLink: '',
  blogger: '',
  videoFile: null,
  number_views: '',
  isBonus: false
})
const errorStore = useError()
const streamerStore = useStreamers()

const formRef = ref(null)
const videoInputRef = ref(null)
const videoError = ref('')

const onInput = (val) => {
  const digitsOnly = val.target.value.replace(/\D/g, '')
  videoFields.value.number_views = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const checkVideoExists = async () => {
  const isValid = await videoInputRef.value?.validate()
  if (isValid?.length) return

  const { data } = await userInfoStore.checkLinkPublication(videoFields.value.videoLink)
  const { available_add, message } = data ?? {}
  if (!available_add) videoError.value = message ?? ''
}

const input = () => {
  if (videoError.value) videoError.value = ''
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
  if (valid && videoFields.value.videoFile && !videoError.value) {
    emit('submit', videoFields.value)
  }
}

watch(
  () => props.videoLink,
  (newVal) => {
    if (newVal) {
      videoFields.value.videoLink = newVal
    }
  },
  { immediate: true }
)
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
      margin-bottom: 25px;
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

:deep(.v-card-title) {
  position: sticky;
  top: 0;
  background: #fff !important;
  z-index: 1;
  padding-bottom: 10px !important;
}

:deep(.v-card-actions) {
  justify-content: center !important;

  @media (max-width: 767px) {
    padding-top: 25px !important;
    justify-content: end !important;
    position: sticky;
    bottom: 0;
    background: #fff;
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
