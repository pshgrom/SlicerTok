<template>
  <v-file-input
    ref="fileInput"
    label="Загрузить изображение"
    accept="image/*"
    prepend-icon="mdi-image"
    show-size
    :multiple="false"
    :model-value="internalFile"
    class="mb-4 d-none"
    @update:model-value="handleFileChange"
  ></v-file-input>
  <v-btn class="wavy-button" disabled @click="triggerFileSelect">
    <v-icon size="28" class="me-2">mdi-camera</v-icon>
    <span>Загрузить фото</span>
  </v-btn>

  <div v-if="previewUrl" class="mt-2">
    <v-img :src="previewUrl" max-width="300" class="rounded elevation-3" cover></v-img>
    <v-btn color="error" class="mt-2" @click="clearImage">
      <v-icon left>mdi-delete</v-icon> Удалить
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: File | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void
}>()

const internalFile = ref<File | null>(props.modelValue ?? null)
const previewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Очистка предыдущего URL
function revokePreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

// Следим за изменениями файла
watch(
  () => internalFile.value,
  (newVal) => {
    revokePreview()
    if (newVal instanceof File) {
      previewUrl.value = URL.createObjectURL(newVal)
      emit('update:modelValue', newVal)
    } else {
      emit('update:modelValue', null)
    }
  }
)

watch(
  () => props.modelValue,
  (val) => {
    internalFile.value = val
  }
)

onBeforeUnmount(() => {
  revokePreview()
})

function triggerFileSelect() {
  fileInput.value?.click()
}

function handleFileChange(file: File | File[] | null) {
  if (Array.isArray(file)) {
    internalFile.value = file[0] ?? null
  } else {
    internalFile.value = file
  }
}

function clearImage() {
  internalFile.value = null
}
</script>

<style lang="scss"></style>
