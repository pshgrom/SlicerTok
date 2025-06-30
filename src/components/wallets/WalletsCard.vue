<template>
  <div class="wallets">
    <div class="wallets__wrapper">
      <div class="wallets__top">
        <div class="wallets__label">
          Кошельки
          <span class="wallets__length">{{ wallets.length }}</span>
        </div>
        <VCusomButton :customClass="['dark']" @click="openDialog" :disabled="wallets.length >= 3"
          >Добавить
        </VCusomButton>
      </div>
      <div class="wallets__list">
        <CurrentWallet
          v-for="(wallet, index) in wallets"
          :key="wallet.id"
          :wallet="wallet"
          :wallets="wallets"
          :index="index"
          v-model:openIndex="openIndex"
          @setAsMain="setAsMain"
          @removeWallet="removeWallet"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import VCusomButton from '@/components/base/VCusomButton.vue'
import CurrentWallet from '@/components/wallets/CurrentWallet.vue'
import { PropType, ref } from 'vue'
import { IWallet } from '@/interfaces/Slicer'

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

  &__label {
    font-family: 'Inter Medium', sans-serif;
    color: rgba(17, 17, 17, 1);
    display: inline-flex;
    align-items: center;
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
    font-family: 'Inter Medium', sans-serif;
    font-size: 12px;
    margin-left: 8px;
  }

  min-width: 474px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 1);
  height: 259px;

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
