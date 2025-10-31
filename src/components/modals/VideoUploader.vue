<template>
  <div
    class="upload-video"
    :class="{
      'upload-video_uploaded': videoUrl,
      'upload-video_dragover': isDragOver
    }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <template v-if="isUploading">
      <VProgressCircular indeterminate color="rgb(169, 55, 244)" size="40" />
    </template>

    <template v-else-if="!videoUrl">
      <div class="upload-video__label">{{ label }}</div>
      <div class="upload-video__text">Перетащите видео сюда или загрузите вручную</div>
      <VCusomButton :custom-class="['light']" @click="triggerFileSelect">
        Загрузить видео
      </VCusomButton>
      <v-file-input
        ref="fileInput"
        v-model="internalFile"
        accept="video/*"
        class="d-none"
        clearable
        @change="handleFileChange"
      />
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
  modelValue: {
    type: [File, Array, Object, null],
    default: null
  },
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
const isDragOver = ref(false)

watch(internalFile, (newFile) => {
  emit('update:modelValue', newFile)

  if (newFile) {
    const file = Array.isArray(newFile) ? newFile[0] : newFile

    if (file instanceof File) {
      isUploading.value = true
      setTimeout(() => {
        videoUrl.value = URL.createObjectURL(file)
        videoName.value = file.name ?? ''
        isUploading.value = false
      }, 500)
    }
  } else {
    videoUrl.value = null
    isUploading.value = false
  }
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== internalFile.value) {
      const file = Array.isArray(newVal) ? newVal[0] : newVal
      internalFile.value = file
      videoUrl.value = file instanceof File ? URL.createObjectURL(file) : null
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

const handleFileChange = (e) => {
  const file = Array.isArray(e) ? e[0] : e

  if (file instanceof File) {
    internalFile.value = file
  }
}

const onDragEnter = () => {
  isDragOver.value = true
}

const onDragOver = () => {
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

const onDrop = (e) => {
  isDragOver.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file instanceof File && file.type.startsWith('video/')) {
      internalFile.value = file
    }
  }
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
  border: 2px dashed rgba(211, 219, 237, 1);
  position: relative;
  transition: all 0.2s ease;

  &_uploaded {
    padding-top: 12px;
    padding-bottom: 12px;
    border: 1px solid rgba(211, 219, 237, 1);
  }

  &_dragover {
    background: rgba(229, 236, 253, 0.8);
    border-color: rgba(0, 212, 254, 1);
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
  }

  &__text {
    color: rgba(143, 150, 165, 1);
    font-size: 14px;
    margin-bottom: 16px;
  }

  &__value {
    max-width: 320px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
