<template>
  <div class="wallets">
    <div class="wallets__wrapper">
      <div class="wallets__top">
        <div class="wallets__label">Кошельки</div>
        <button
          v-if="!readonly"
          class="button-action"
          :disabled="wallets.length >= 3"
          :class="{ 'button-action_disabled': wallets.length >= 3 }"
          @click="openDialog"
        >
          <SvgIcon name="plus" scale=".9" />
        </button>
      </div>
      <div v-if="wallets.length" class="wallets__list">
        <CurrentWallet
          v-for="(wallet, index) in wallets"
          :key="wallet.id"
          v-model:open-index="openIndex"
          :wallet="wallet"
          :wallets="wallets"
          :index="index"
          :readonly="readonly"
          @set-as-main="setAsMain"
          @remove-wallet="removeWallet"
        />
      </div>
      <div v-else class="wallets-empty">
        <div class="wallets-empty__img">
          <SvgIcon name="wallet-empty" />
        </div>
        <div class="wallets-empty__text">
          У вас пока нет кошельков.<br />
          Добавьте свой первый кошелек
        </div>
      </div>
    </div>
    <SmallLoader v-if="isLoading" />
  </div>
</template>
<script setup lang="ts">
import { type PropType, ref } from 'vue'

import type { IWallet } from '@/shared/config/types/slicer'
import SmallLoader from '@/shared/ui/SmallLoader.vue'
import SvgIcon from '@/shared/ui/SvgIcon.vue'
import CurrentWallet from '@/widgets/wallets/CurrentWallet.vue'

const props = defineProps({
  wallets: {
    type: Array as PropType<IWallet[]>,
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['openModalWallet', 'setAsMain', 'removeWallet'])
const openIndex = ref(null)

const openDialog = () => {
  if (props.wallets.length <= 3) {
    emit('openModalWallet')
  }
}

const setAsMain = (id: number) => {
  emit('setAsMain', id)
}

const removeWallet = (index: number, id: number, is_main: boolean) => {
  emit('removeWallet', index, id, is_main)
}
</script>

<style scoped lang="scss">
.wallets {
  width: 100%;
  border-radius: 16px;
  position: relative;
  background: rgb(var(--v-theme-background));
  padding: 16px 16px 21px 16px;

  @media (max-width: 1440px) {
    max-width: 400px;
    width: 100%;
  }

  @media (max-width: 767px) {
    max-width: 100%;
  }

  &__add {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 12px;
    background: rgb(var(--v-theme-chipBg));
    color: rgb(var(--v-theme-chipColor));

    :deep(svg path) {
      stroke: rgba(169, 55, 244, 1);
    }

    &_disabled {
      background: gray;
    }
  }

  &__label {
    font-family: 'Unbounded', sans-serif;
    font-weight: 500;
    letter-spacing: 2%;
    display: inline-flex;
    align-items: center;
    font-size: 16px;
    color: rgb(var(--v-theme-primary));
  }

  &__wrapper {
    height: 100%;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__list {
    display: flex;
    flex-direction: column;
  }

  &-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: center;
    position: relative;
    top: -7px;
    margin-left: -20px;

    @media (max-width: 767px) {
      margin-top: 15px;
    }

    &__text {
      margin-top: 12px;
      color: rgba(143, 150, 165, 1);
      font-size: 14px;
      line-height: 140%;
      text-align: center;
    }
  }
}
</style>
