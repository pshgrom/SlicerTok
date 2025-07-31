<template>
  <div class="profile">
    <div class="profile__wrapper">
      <div class="profile__top">
        <div class="profile__avatar">
          <!--          <ImageUploader v-model="imageFile" />-->
          <img src="@/static/img/avatar.png" alt="аватарка" />
        </div>
        <VCusomButton v-if="!readonly" :customClass="['light']" @click="showDialog(true)"
          >Изменить
        </VCusomButton>
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
          <template v-if="readonly">
            <div class="profile-info-item">
              <div class="profile-info-item__value">
                <div class="custom-table-views">
                  <SvgIcon name="show" />
                  <div>{{ formatNumber(user.total_views ?? 0) }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="profile-info__wrap">
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
          <div class="profile-info-item">
            <div class="profile-info-item__value">
              <template v-if="user.key">
                {{ user.key }}
              </template>
              <span v-else>не указано</span>
            </div>
          </div>
          <template v-if="readonly">
            <div class="profile-info-item">
              <div class="profile-info-item__value">
                {{ user.is_verified ? 'Верифицирован' : 'Не верифицирован' }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import VCusomButton from '@/components/base/VCusomButton.vue'
import { type PropType } from 'vue'
import type { IUser } from '@/interfaces/Slicer'
import SvgIcon from '@/components/base/SvgIcon.vue'
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
  min-height: 259px;
  border-radius: 16px;
  margin-right: 12px;
  width: 100%;
  height: 100%;
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
    margin-bottom: 10px;

    span {
      color: rgba(143, 150, 165, 1);
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
      margin: 4px;
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
