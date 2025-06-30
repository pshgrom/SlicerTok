<template>
  <v-file-input
    label="Загрузить изображение"
    accept="image/*"
    ref="fileInput"
    prepend-icon="mdi-image"
    show-size
    :multiple="false"
    :model-value="internalFile"
    @update:model-value="handleFileChange"
    class="mb-4 d-none"
  ></v-file-input>
  <v-btn class="wavy-button" @click="triggerFileSelect" disabled>
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

<style lang="scss">
.wavy-button {
  background: linear-gradient(135deg, #ff90b3, #0070be);
  border: none;
  color: white;
  font-weight: bold;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.wavy-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}

.wavy-button::after {
  content: '';
  position: absolute;
  top: -20%;
  left: -10%;
  width: 120%;
  height: 140%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3), transparent 70%);
  transform: rotate(-20deg);
  animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) rotate(-20deg);
  }
  100% {
    transform: translateX(100%) rotate(-20deg);
  }
}
</style>
