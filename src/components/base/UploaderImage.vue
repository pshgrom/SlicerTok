<template>
  <div class="avatar-upload">
    <div class="avatar-preview">
      <img :src="avatarUrl || defaultAvatar" alt="Аватар" />
    </div>
    <div class="avatar-actions">
      <input ref="inputFile" type="file" accept="image/*" hidden @change="onFileChange" />
      <v-btn outlined small @click="$refs.inputFile.click()">Выбрать фото</v-btn>
      <v-btn v-if="avatarUrl" outlined small color="red" @click="removeAvatar">Удалить</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  defaultAvatar: {
    type: String,
    default: '@/static/img/avatar.png'
  }
})

const emit = defineEmits(['update:modelValue'])

const avatarUrl = ref(props.modelValue)
const inputFile = ref<HTMLInputElement | null>(null)

watch(
  () => props.modelValue,
  (newVal) => {
    avatarUrl.value = newVal
  }
)

const onFileChange = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || !files.length) return

  const file = files[0]

  // временный preview
  avatarUrl.value = URL.createObjectURL(file)

  // мок загрузки на сервер
  await mockUpload(file)

  // отдаём результат родителю
  emit('update:modelValue', avatarUrl.value)
}

const removeAvatar = () => {
  avatarUrl.value = ''
  emit('update:modelValue', '')
}

// мок функция загрузки
const mockUpload = async (file: File) => {
  console.log('Загрузка аватара на сервер...', file.name)
  return new Promise((resolve) => setTimeout(resolve, 1000))
}
</script>

<style scoped lang="scss">
.avatar-upload {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .avatar-preview {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
    border: 1px solid rgb(var(--v-theme-primary));

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .avatar-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
