<template>
  <div class="profile">
    <div class="profile__wrapper">
      <div class="profile__top">
        <div class="profile__avatar">
          <!--          <ImageUploader v-model="imageFile" />-->
          <img src="@/static/img/avatar.png" alt="аватарка" />
        </div>
        <div v-if="readonly" class="profile__actions">
          <VCusomButton
            v-if="!user.is_verified"
            :custom-class="['light']"
            @click="verifyUser(true)"
          >
            <SvgIcon name="check-second" /> Верифицировать
          </VCusomButton>
          <VCusomButton v-else :custom-class="['light']" @click="verifyUser(false)">
            <SvgIcon name="cross" /> Снять верификацию
          </VCusomButton>
          <VCusomButton
            :custom-class="['dark']"
            style="margin-left: 4px"
            @click="goToChat(user.id)"
          >
            <SvgIcon name="msg" /> Чат
          </VCusomButton>
        </div>
        <VCusomButton v-if="!readonly" :custom-class="['light']" @click="showDialog(true)"
          >Изменить
        </VCusomButton>
      </div>
      <div class="profile__content">
        <div class="profile__name" :class="{ profile__name_readonly: readonly }">
          <template v-if="user.name">
            {{ user.name }}
            <div v-if="readonly" class="profile__verify">
              <SvgIcon :name="user.is_verified ? 'verify' : 'noverify'" />
            </div>
          </template>
          <span v-else>Ваше имя</span>
        </div>
      </div>
      <div class="profile-info">
        <div class="profile-info__wrap">
          <div class="profile-info-item">
            <div class="profile-info-item__label">Телефон</div>
            <div class="d-flex">
              <div class="profile-info-item__value">
                <a v-if="user.phone" :href="`tel:${user.phone}`">
                  {{ user.phone }}
                </a>
                <span v-else>не указано</span>
              </div>
              <div class="profile-info-item__icon" @click="copyContent(user.phone)">
                <SvgIcon name="copy-second" />
              </div>
            </div>
          </div>
          <div class="profile-info-item">
            <div class="profile-info-item__label">Email</div>
            <div class="d-flex">
              <div class="profile-info-item__value">
                <a v-if="user.email" :href="`mailto:${user.phone}`">
                  {{ user.email }}
                </a>
                <span v-else>не указано</span>
              </div>
              <div class="profile-info-item__icon" @click="copyContent(user.email)">
                <SvgIcon name="copy-second" />
              </div>
            </div>
          </div>
          <div v-if="readonly" class="profile-info-item">
            <div class="profile-info-item__icon">
              <SvgIcon name="show" />
            </div>
            <div class="profile-info-item__value">
              <div>{{ formatNumber(user.total_views ?? 0) }}</div>
            </div>
          </div>
          <div class="profile-info-item">
            <div class="profile-info-item__label">Ключ</div>
            <div class="d-flex">
              <div class="profile-info-item__value">
                {{ user.key }}
              </div>
              <div class="profile-info-item__icon" @click="copyContent(user.key)">
                <SvgIcon name="copy-second" />
              </div>
            </div>
          </div>
          <div v-if="readonly" class="profile-info-item">
            <div class="profile-info-item__icon">
              <SvgIcon name="calendar" />
            </div>
            <div class="profile-info-item__value">{{ formatDate(user.created_at) }}</div>
          </div>
          <div class="profile-info-item">
            <div class="profile-info-item__label">Telagram</div>
            <div class="d-flex">
              <div class="profile-info-item__value">
                <template v-if="user.telegram">
                  {{ user.telegram }}
                </template>
                <span v-else>не указано</span>
              </div>
              <div class="profile-info-item__icon" @click="copyContent(user.telegram)">
                <SvgIcon name="copy-second" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SmallLoader v-if="isLoading" />
  </div>
</template>
<script setup lang="ts">
import { type PropType } from 'vue'
import { useRouter } from 'vue-router'

import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import SmallLoader from '@/components/SmallLoader.vue'
import type { IUser } from '@/interfaces/Slicer'
import { useError } from '@/stores/Errors.ts'
import { useSupportUsers } from '@/stores/SupportUsers.ts'
import { formatDate } from '@/utils/formatDate.ts'
import { formatNumber } from '@/utils/formatNumbers.ts'
// import ImageUploader from '@/components/base/ImageUploader.vue'

defineProps({
  dialog: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object as PropType<IUser>,
    default: () => ({})
  }
})
const emit = defineEmits(['update:dialog', 'verifyUser'])
const router = useRouter()
const errorStore = useError()
const supportUsersStore = useSupportUsers()

const showDialog = (val: boolean) => {
  emit('update:dialog', val)
}

const verifyUser = (val: boolean) => {
  emit('verifyUser', val)
}

const goToChat = async (id: string | number) => {
  const resp = await supportUsersStore.getChatByUser(id)
  const { chat_room_id } = resp
  if (chat_room_id) await router.push({ name: 'SupportChat', params: { id: chat_room_id } })
}

const copyContent = async (value: string) => {
  if (!value) return

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      errorStore.setErrors('Успешно скопировано', 'success')
    } catch (err) {
      console.error('Clipboard API error:', err)
      fallbackCopyTextToClipboard(value)
    }
  } else {
    fallbackCopyTextToClipboard(value)
  }
}

const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    const successful = document.execCommand('copy')
    if (successful) {
      errorStore.setErrors('Успешно скопировано', 'success')
    } else {
      throw new Error('execCommand failed')
    }
  } catch (err) {
    console.error('Fallback copy failed:', err)
    errorStore.setErrors('Не удалось скопировать текст.')
  }
  document.body.removeChild(textArea)
}
</script>

<style scoped lang="scss">
.profile {
  border-radius: 16px;
  width: 297px;
  position: relative;
  background: rgb(var(--v-theme-background));

  &:after {
    content: '';
    width: 100%;
    height: 100px;
    position: absolute;
    background: rgba(0, 212, 254, 1);
    background-image: url('@/static/img/profile-bg.png');
    left: 0;
    top: 0;
    border-radius: 16px;
  }

  @media (max-width: 767px) {
    margin-right: 0;
    margin-bottom: 12px;
  }

  &__wrapper {
    //background: #fff;
    padding: 16px;
    margin-top: 60px;
    border-radius: 16px;
    padding-bottom: 12px;
    position: relative;
    z-index: 50;

    @media (max-width: 1024px) {
      border-radius: 0;
      border-top-right-radius: 16px;
    }
  }

  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 17px;
  }

  &__actions {
    position: relative;
    top: 5px;
  }

  &__avatar {
    max-width: 99px;
    margin-top: -61px;
    border-radius: 50%;

    img {
      border-radius: 50%;
      border: 4px solid rgba(255, 255, 255, 1);
    }
  }

  &__verify {
    margin-left: 5px;
  }

  &__name {
    color: rgb(var(--v-theme-primary));
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 10px;

    span {
      color: rgba(143, 150, 165, 1);
    }

    &_readonly {
      display: inline-flex;
    }
  }

  &-info {
    margin: 0 -4px;

    &__wrap {
      display: flex;
      flex-direction: column;
    }

    &-item {
      background: rgb(var(--v-theme-chipBg));
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      margin: 2px;
      padding: 12px;
      max-height: 69px;
      min-height: 69px;

      &__label {
        color: rgb(var(--v-theme-chipColor));
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      &__value {
        color: rgb(var(--v-theme-primary));
        font-weight: 500;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 280px;

        span {
          color: rgba(143, 150, 165, 1);
        }
      }

      &__icon {
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
}
</style>
