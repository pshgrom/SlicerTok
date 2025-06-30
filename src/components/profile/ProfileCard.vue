<template>
  <div class="profile">
    <div class="profile__wrapper">
      <div class="profile__top">
        <div class="profile__avatar">
          <!--          <ImageUploader v-model="imageFile" />-->
          <img src="@/static/img/avatar.png" alt="аватарка" />
        </div>
        <VCusomButton :customClass="['light']" @click="showDialog(true)">Изменить </VCusomButton>
      </div>
      <div class="profile__content">
        <div class="profile__name">
          <template v-if="user.name">
            {{ user.name }}
          </template>
          <span v-else>Ваше имя</span>
        </div>
      </div>
      <div class="profile-info">
        <div>
          <div class="profile-info-item">
            <div class="profile-info-item__icon">
              <img src="@/static/icons/phone.svg" alt="phone" />
            </div>
            <div class="profile-info-item__value">
              <template v-if="user.phone">
                {{ user.phone }}
              </template>
              <span v-else>не указано</span>
            </div>
          </div>
          <div class="profile-info-item">
            <div class="profile-info-item__icon">
              <img src="@/static/icons/message.svg" alt="message" />
            </div>
            <div class="profile-info-item__value">
              <template v-if="user.email">
                {{ user.email }}
              </template>
              <span v-else>не указано</span>
            </div>
          </div>
        </div>
        <div class="profile-info-item">
          <div class="profile-info-item__icon">
            <img src="@/static/icons/telegram.svg" alt="telegram" />
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
</template>
<script setup lang="ts">
import VCusomButton from '@/components/base/VCusomButton.vue'
import { PropType } from 'vue'
import { IUser } from '@/interfaces/Slicer'
// import ImageUploader from '@/components/base/ImageUploader.vue'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object as PropType<IUser>,
    default: () => ({})
  }
})
const emit = defineEmits(['update:dialog'])

const showDialog = (val: boolean) => {
  emit('update:dialog', val)
}
</script>

<style scoped lang="scss">
.profile {
  border: 4px solid rgba(255, 255, 255, 1);
  min-width: 474px;
  height: 259px;
  border-radius: 16px;
  background: rgba(0, 212, 254, 1);
  background-image: url('@/static/img/profile-bg.png');
  margin-right: 12px;

  &__wrapper {
    background: #fff;
    padding: 16px;
    margin-top: 60px;
    border-radius: 16px;
    padding-bottom: 12px;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 17px;
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

  &__name {
    color: rgba(17, 17, 17, 1);
    font-size: 18px;
    font-weight: 500;
    font-family: 'Inter Medium', sans-serif;
    margin-bottom: 10px;

    span {
      color: rgba(143, 150, 165, 1);
    }
  }

  &-info {
    margin: 0 -4px;

    &-item {
      background: rgba(229, 236, 253, 1);
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      margin: 4px;
      height: 32px;
      padding: 0 8px;

      &__value {
        color: rgba(17, 17, 17, 1);
        font-weight: 500;
        margin-left: 8px;
        font-family: 'Inter Medium', sans-serif;

        span {
          color: rgba(143, 150, 165, 1);
        }
      }
    }
  }
}
</style>
