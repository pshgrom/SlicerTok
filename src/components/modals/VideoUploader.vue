<template>
  <v-file-input
    ref="fileInput"
    v-model="internalFile"
    accept="video/*"
    label="Выберите видео"
    class="d-none"
    prepend-icon="mdi-video"
    :show-size="true"
    clearable
    @change="handleFileChange"
  />

  <div class="upload-video" :class="{ 'upload-video_uploaded': videoUrl }">
    <template v-if="isUploading">
      <VProgressCircular indeterminate color="primary" size="40" />
    </template>

    <template v-else-if="!videoUrl">
      <div class="upload-video__label">{{ label }}</div>
      <div class="upload-video__text">Загрузите короткое видео с доказательством статистики</div>
      <VCusomButton :custom-class="['light']" @click="triggerFileSelect">
        Загрузить видео
      </VCusomButton>
    </template>

    <div v-else class="upload-video__uploaded">
      <div class="upload-video__value">{{ videoName }}</div>
      <SvgIcon name="delete" @click="removeVideo" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { VProgressCircular } from 'vuetify/components'

import VCusomButton from '@/components/base/VCusomButton.vue'

const props = defineProps({
  modelValue: File,
  label: {
    type: String,
    default: 'Загрузка видео для проверки *'
  }
})

const emit = defineEmits(['update:modelValue'])

const internalFile = ref(props.modelValue || null)
const fileInput = ref(null)
const videoUrl = ref(null)
const videoName = ref('')
const isUploading = ref(false)

watch(internalFile, (newFile) => {
  emit('update:modelValue', newFile)

  if (newFile) {
    isUploading.value = true
    setTimeout(() => {
      videoUrl.value = URL.createObjectURL(newFile)
      videoName.value = newFile.name ?? ''
      isUploading.value = false
    }, 500)
  } else {
    videoUrl.value = null
    isUploading.value = false
  }
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== internalFile.value) {
      internalFile.value = newVal
      videoUrl.value = newVal ? URL.createObjectURL(newVal) : null
    }
  }
)

const removeVideo = () => {
  videoUrl.value = null
  emit('update:modelValue', null)
}

const triggerFileSelect = () => {
  fileInput?.value?.click()
}

const handleFileChange = (file) => {
  // Валидация или доп. логика если нужно
}
</script>

<style lang="scss" scoped>
.upload-video {
  background: rgba(242, 246, 254, 1);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid rgba(211, 219, 237, 1);
  position: relative;

  &_uploaded {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  &__uploaded {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;

    :deep(svg) {
      cursor: pointer;
      stroke: #ff0200;
      transition: all 0.15s ease-in;

      :deep(path) {
        transition: all 0.15s ease-in;
      }

      &:hover {
        fill: rgba(229, 236, 253, 1);

        path:nth-child(2) {
          stroke: rgba(0, 212, 254, 1);
        }
      }
    }
  }

  &__label {
    position: absolute;
    left: 0;
    top: -20px;
    color: rgba(143, 150, 165, 1);
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0;
  }

  &__text {
    color: rgba(143, 150, 165, 1);
    font-size: 14px;
    margin-bottom: 16px;
    letter-spacing: 0;
  }

  &__value {
    line-height: 1;
  }
}
</style>
