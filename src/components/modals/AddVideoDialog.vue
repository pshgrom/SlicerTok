<template>
  <v-dialog v-model="dialogModel" max-width="600px" max-height="526px" persistent>
    <v-card>
      <v-card-title>Добавление видео</v-card-title>
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
            label="Ссылка на видео"
            :rules="[videoRules.required, videoRules.url, videoRules.noShare]"
          />
          <VCustomInput
            v-model="videoFields.number_views"
            label="Количество просмотров"
            :rules="[videoRules.required]"
            required
          />
          <!--          @input="onInput"-->
          <div class="mb-4">Загрузка видео для проверки</div>
          <VideoUploader v-model="videoFields.videoFile" />
        </v-form>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeDialog">Отмена</v-btn>
        <v-btn color="primary" @click="submitVideo">Добавить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import VideoUploader from '@/components/modals/VideoUploader.vue'
import { useError } from '@/stores/Errors'
import { IUploadVideo } from '@/interfaces/Slicer'
import { videoRules } from '@/utils/validators'

const props = defineProps({
  modelValue: Boolean,
  preloadKey: {
    type: String,
    default: ''
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

<style scoped></style>
