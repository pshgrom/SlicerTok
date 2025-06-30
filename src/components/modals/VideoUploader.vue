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
  <div class="wavy-button" style="max-width: 260px" @click="triggerFileSelect">
    <v-icon size="28" class="me-2">mdi-camera</v-icon>
    <span>Загрузить видео</span>
  </div>

  <div v-if="videoUrl" class="mt-4">
    <video
      controls
      :src="videoUrl"
      class="w-100"
      style="max-width: 200px; max-height: 200px"
    ></video>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: File
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
