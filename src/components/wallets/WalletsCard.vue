<template>
  <div class="wallets">
    <div class="wallets__wrapper">
      <div class="wallets__top">
        <div class="wallets__label">
          Кошельки
          <span class="wallets__length">{{ wallets.length }}</span>
        </div>
        <VCusomButton :customClass="['dark']" :disabled="wallets.length >= 3" @click="openDialog"
          >Добавить
        </VCusomButton>
      </div>
      <div class="wallets__list">
        <CurrentWallet
          v-for="(wallet, index) in wallets"
          :key="wallet.id"
          v-model:openIndex="openIndex"
          :wallet="wallet"
          :wallets="wallets"
          :index="index"
          @set-as-main="setAsMain"
          @remove-wallet="removeWallet"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import VCusomButton from '@/components/base/VCusomButton.vue'
import CurrentWallet from '@/components/wallets/CurrentWallet.vue'
import { type PropType, ref } from 'vue'
import { type IWallet } from '@/interfaces/Slicer'

const props = defineProps({
  wallets: {
    type: Array as PropType<IWallet[]>,
    default: () => []
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
  padding: 17px 0 20px 20px;
  width: 100%;
  height: 100%;
  min-width: 474px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 1);
  min-height: 259px;
  max-height: 259px;

  @media (max-width: 1024px) {
    min-width: 358px;
    height: auto;
  }

  @media (max-width: 767px) {
    padding-bottom: 0;
  }

  &__label {
    font-weight: 500;
    color: rgba(17, 17, 17, 1);
    display: inline-flex;
    align-items: center;
    font-size: 18px;
  }

  &__length {
    border-radius: 50%;
    background: rgba(245, 245, 245, 1);
    border: 1px solid rgba(232, 232, 232, 1);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(17, 17, 17, 1);
    font-weight: 500;
    font-size: 12px;
    margin-left: 8px;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
  }

  &__list {
    overflow-x: scroll;
    padding-top: 14px;
    display: flex;
    align-items: center;
  }
}
</style>
