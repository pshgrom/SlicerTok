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
            <div class="profile-info-item__icon">
              <SvgIcon name="phone" />
            </div>
            <div class="profile-info-item__value">
              <a v-if="user.phone" :href="`tel:${user.phone}`">
                {{ user.phone }}
              </a>
              <span v-else>не указано</span>
            </div>
          </div>
          <div class="profile-info-item">
            <div class="profile-info-item__icon">
              <SvgIcon name="message" />
            </div>
            <div class="profile-info-item__value">
              <a v-if="user.email" :href="`mailto:${user.phone}`">
                {{ user.email }}
              </a>
              <span v-else>не указано</span>
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
            <div class="profile-info-item__icon">
              <SvgIcon name="key" />
            </div>
            <div class="profile-info-item__value">
              {{ user.key }}
            </div>
          </div>
          <div v-if="readonly" class="profile-info-item">
            <div class="profile-info-item__icon">
              <SvgIcon name="calendar" />
            </div>
            <div class="profile-info-item__value">{{ formatDate(user.created_at) }}</div>
          </div>
          <div class="profile-info-item">
            <div class="profile-info-item__icon">
              <SvgIcon name="telegram" />
            </div>
            <div class="profile-info-item__value">
              <template v-if="user.telegram">
                {{ user.telegram }}
              </template>
              <span v-else>не указано</span>
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
</script>

<style scoped lang="scss">
.profile {
  border: 4px solid rgba(255, 255, 255, 1);
  min-width: 474px;
  border-radius: 16px;
  width: 100%;
  position: relative;
  background: #fff;

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

  @media (max-width: 1024px) {
    min-width: 358px;
    height: auto;
  }

  @media (max-width: 767px) {
    margin-right: 0;
    margin-bottom: 12px;
  }

  &__wrapper {
    background: #fff;
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
    color: rgba(17, 17, 17, 1);
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
      align-items: center;
      flex-wrap: wrap;
    }

    &-item {
      background: rgba(229, 236, 253, 1);
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      margin: 2px;
      height: 32px;
      padding: 0 8px;

      &__value {
        color: rgba(17, 17, 17, 1);
        margin-left: 8px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 280px;

        span {
          color: rgba(143, 150, 165, 1);
        }
      }
    }
  }
}
</style>
