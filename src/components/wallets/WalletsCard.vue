<template>
  <div class="wallets">
    <div class="wallets__wrapper">
      <div class="wallets__top">
        <div class="wallets__label">Кошельки</div>
        <VCusomButton
          v-if="!readonly"
          :custom-class="['light']"
          :disabled="wallets.length >= 3"
          @click="openDialog"
          >Добавить
        </VCusomButton>
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

import SvgIcon from '@/components/base/SvgIcon.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'
import SmallLoader from '@/components/SmallLoader.vue'
import CurrentWallet from '@/components/wallets/CurrentWallet.vue'
import { type IWallet } from '@/interfaces/Slicer'

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
  padding: 17px 0 0 20px;
  width: 100%;
  border-radius: 16px;
  position: relative;
  background: rgb(var(--v-theme-background));

  @media (max-width: 767px) {
    padding-bottom: 0;
  }

  &__label {
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    font-size: 18px;
    color: rgb(var(--v-theme-primary));
  }

  &__wrapper {
    height: 100%;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
  }

  &__list {
    padding-top: 14px;
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
