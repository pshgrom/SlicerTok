<template>
  <div class="profile">
    <div class="profile__bg"></div>
    <div class="profile__wrapper">
      <div class="profile__top">
        <div class="profile__avatar">
          <img :src="user.avatar" alt="аватарка" />
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
        <button v-if="!readonly" class="button-action" @click="showDialog(true)">
          <SvgIcon name="edit" />
        </button>
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

import { useSupportUsers } from '@/entities/support'
import type { IUser } from '@/shared/config/types/slicer'
import { copyContent, formatDate, formatNumber } from '@/shared/lib'
import SmallLoader from '@/shared/ui/SmallLoader.vue'
import SvgIcon from '@/shared/ui/SvgIcon.vue'
import VCusomButton from '@/shared/ui/VCusomButton.vue'

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
  border-radius: 16px;
  width: 325px;
  position: relative;
  background: rgb(var(--v-theme-background));

  @media (max-width: 1440px) {
    max-width: 872px;
    width: 100%;
  }

  @media (max-width: 767px) {
    margin-right: 0;
    margin-bottom: 0;
  }

  &__wrapper {
    padding: 16px;
    border-radius: 16px;
    padding-bottom: 12px;
    position: relative;
    z-index: 50;

    @media (max-width: 1024px) {
      border-radius: 0;
      border-top-right-radius: 16px;
    }
  }

  &__bg {
    height: 74px;
    width: 100%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    background: linear-gradient(
      150deg,
      rgba(169, 55, 244, 1),
      rgba(200, 118, 255, 1),
      rgba(64, 0, 107, 1)
    );
    background-size: contain;
    position: relative;

    &:after {
      content: '';
      background-image: url('@/shared/assets/images/profile-bg.png');
      background-size: contain;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
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
    min-width: 82px;
    max-width: 82px;
    max-height: 82px;
    min-height: 82px;
    margin-top: -60px;
    border-radius: 50%;
    border: 2px solid rgb(var(--v-theme-inversionPrimary));
  }

  &__verify {
    margin-left: 5px;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    @media (max-width: 1440px) {
      margin-top: -43px;
      margin-bottom: 6px;
    }
  }

  &__name {
    font-size: 16px;
    font-family: 'Unbounded', sans-serif;
    font-weight: 500;
    color: rgb(var(--v-theme-primary));
    letter-spacing: 2%;

    @media (max-width: 1440px) {
      position: relative;
      left: 84px;
    }

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

      @media (max-width: 1440px) {
        flex-direction: row;
        flex-wrap: wrap;
      }
    }

    &-item {
      background: rgb(var(--v-theme-chipBg));
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      margin: 2px;
      padding: 12px;
      max-height: 69px;
      min-height: 69px;

      @media (max-width: 1440px) {
        width: calc(50% - 4px);
      }

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

        :deep(svg path) {
          stroke: rgb(var(--v-theme-chipColor));
        }
      }
    }
  }
}
</style>
