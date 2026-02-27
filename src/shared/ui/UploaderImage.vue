<template>
  <div class="avatar-upload">
    <div class="avatar-preview">
      <img :src="avatarUrl || defaultAvatar" alt="Аватар" />
      <div v-if="isUploading" class="overlay">
        <v-progress-circular indeterminate color="rgba(169, 55, 244, 1)" size="24" />
      </div>
    </div>

    <div class="avatar-actions">
      <input ref="inputFile" type="file" accept="image/*" hidden @change="onFileChange" />
      <VCusomButton
        :custom-class="['dark', 'with-icon']"
        :disabled="isUploading"
        @click="$refs.inputFile.click()"
      >
        <SvgIcon name="upload" />
        Загрузить
      </VCusomButton>
      <VCusomButton
        v-if="avatarUrl"
        :custom-class="['dark', 'with-icon', 'black']"
        outlined
        small
        color="red"
        :disabled="isUploading"
        @click="onRemoveAvatar"
      >
        <SvgIcon name="remove" />
        Удалить
      </VCusomButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { useError } from '@/app/stores'
import { useUserInfo } from '@/entities'
import defaultAvatarImg from '@/shared/assets/images/avatar.png'
import SvgIcon from '@/shared/ui/SvgIcon.vue'
import VCusomButton from '@/shared/ui/VCusomButton.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  defaultAvatar: {
    type: String,
    default: defaultAvatarImg
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const userInfoStore = useUserInfo()

const avatarUrl = ref(props.modelValue)
const isUploading = ref(false)
const errorStore = useError()

watch(
  () => props.modelValue,
  (val) => (avatarUrl.value = val)
)

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })

const onFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const base64 = await fileToBase64(file)
  const oldAvatar = avatarUrl.value

  avatarUrl.value = base64
  emit('update:modelValue', base64)

  isUploading.value = true
  try {
    await userInfoStore.updateAvatar(base64)
  } catch (err) {
    errorStore.setErrors(err)
    avatarUrl.value = oldAvatar
    emit('update:modelValue', oldAvatar)
  } finally {
    isUploading.value = false
  }
}

const onRemoveAvatar = async () => {
  const oldAvatar = avatarUrl.value
  avatarUrl.value = ''
  emit('update:modelValue', '')

  isUploading.value = true
  try {
    await userInfoStore.deleteAvatar()
  } catch (err) {
    avatarUrl.value = oldAvatar
    emit('update:modelValue', oldAvatar)
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped lang="scss">
.avatar-upload {
  display: flex;
  align-items: center;
  margin-bottom: 40px;

  .avatar-preview {
    position: relative;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.6);
    }
  }

  .avatar-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
