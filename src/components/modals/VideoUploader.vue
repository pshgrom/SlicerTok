<template>
  <v-file-input
    v-model="internalFile"
    accept="video/*"
    ref="fileInput"
    label="Выберите видео"
    class="d-none"
    prepend-icon="mdi-video"
    @change="handleFileChange"
    :show-size="true"
    clearable
  ></v-file-input>
  <div class="upload-video" :class="{ 'upload-video_uploaded': videoUrl }">
    <template v-if="!videoUrl">
      <div class="upload-video__label">{{ label }}</div>
      <div class="upload-video__text">Загрузите короткое видео с доказательством статистики</div>
      <VCusomButton :customClass="['light']" @click="triggerFileSelect"
        >Загрузить видео</VCusomButton
      >
    </template>
    <div class="upload-video__uploaded" v-else>
      <div class="upload-video__value">Uploaded</div>
      <SvgIcon name="delete" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'

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

watch(internalFile, (newFile) => {
  emit('update:modelValue', newFile)
  if (newFile) {
    videoUrl.value = URL.createObjectURL(newFile)
  } else {
    videoUrl.value = null
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

function triggerFileSelect() {
  fileInput?.value?.click()
}

function handleFileChange(file) {
  console.error(file)
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
    font-family: 'Inter Medium', sans-serif;
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
