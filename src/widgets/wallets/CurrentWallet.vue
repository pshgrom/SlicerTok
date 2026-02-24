<template>
  <div class="wallet" :class="{ wallet_read: onlyRead, wallet_active: openIndex === index }">
    <div class="wallet__wrapper">
      <div class="wallet__icon">
        <SvgIcon :name="`wallet-${index! + 1}`" />
      </div>
      <div class="wallet__value">
        {{ formatWallet(wallet.address) }}
      </div>
      <div class="wallet__copy" @click="copyContent(wallet.address)">
        <SvgIcon name="copy-second" />
      </div>
      <div v-if="wallet.is_main" class="wallet__main">Основной</div>
    </div>
    <div v-if="!onlyRead && !readonly" class="wallet-menu">
      <div class="wallet-menu-icon" @click="openDialog">
        <SvgIcon name="menu" :class="{ active: openIndex === index }" />
      </div>
      <ul v-show="openIndex === index" ref="menuRef" class="dropdown-menu">
        <li
          class="dropdown-menu-item"
          :class="{ 'dropdown-menu-item_disabled': wallet.is_main }"
          @click.prevent="setAsMain"
        >
          <SvgIcon name="main" :fill="wallet.is_main ? '#000' : '#fff'" />
          <span>Основной</span>
        </li>
        <li
          :class="{
            'dropdown-menu-item_disabled': wallets.length === 1 || wallet.is_main
          }"
          class="dropdown-menu-item dropdown-menu-item_remove"
          @click.prevent="removeWallet"
        >
          <SvgIcon name="remove" />
          <span>Удалить</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import type { IWallet } from '@/shared/config/types/slicer'
import { copyContent } from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'

const props = defineProps({
  wallet: {
    type: Object as PropType<IWallet>,
    default: () => ({})
  },
  wallets: {
    type: Array as PropType<IWallet[]>,
    default: () => []
  },
  index: {
    type: [Number, null],
    default: 0
  },
  openIndex: {
    type: [Number, null],
    default: null
  },
  onlyRead: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:openIndex', 'setAsMain', 'removeWallet'])

const menuRef = ref<HTMLElement | null>(null)

const openIndex = computed({
  get() {
    return props.openIndex
  },
  set(value) {
    emit('update:openIndex', value)
  }
})

function handleClickOutside(event: MouseEvent) {
  if (
    openIndex.value === props.index &&
    menuRef.value &&
    !menuRef.value.contains(event.target as Node)
  ) {
    openIndex.value = null
  }
}

const formatWallet = (wallet: string) => {
  if (!wallet) return ''
  const firstPart = wallet.slice(0, 4)
  const lastPart = wallet.slice(wallet.length - 4)
  return `${firstPart}...${lastPart}`
}

const setAsMain = () => {
  if (!props.wallet.is_main) {
    emit('setAsMain', props.wallet.id)
    closeDialog()
  }
}

const removeWallet = () => {
  emit('removeWallet', props.index, props.wallet.id, props.wallet.is_main)
  closeDialog()
}

const openDialog = () => {
  openIndex.value = openIndex.value === props.index ? null : props.index
}

const closeDialog = () => {
  openIndex.value = null
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && openIndex.value === props.index) {
    openIndex.value = null
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style lang="scss" scoped>
.wallet {
  height: 66px;
  border-radius: 16px;
  padding: 12px;
  position: relative;
  z-index: 1;
  background: rgb(var(--v-theme-chipBg));

  &_active {
    z-index: 100;
  }

  &__wrapper {
    display: flex;
    align-items: center;
  }

  &__icon {
    margin-right: 12px;

    :deep(svg path) {
      stroke: rgb(var(--v-theme-inversionPrimary));
    }
  }

  & + .wallet {
    margin-top: 4px;
  }

  &-menu {
    position: absolute;
    right: 16px;
    top: 50%;

    &-icon {
      cursor: pointer;

      :deep(.svg-icon) {
        transition: all 0.15s ease-in;
      }

      & .active {
        :deep(> svg) {
          stroke: rgba(0, 212, 254, 1);
        }
      }

      &:hover {
        :deep(.svg-icon) {
          stroke: rgba(0, 212, 254, 1);
        }
      }
    }
  }

  &__main {
    padding: 0 8px;
    display: inline-flex;
    align-items: center;
    height: 24px;
    border-radius: 16px;
    font-weight: 600;
    font-size: 12px;
    margin-left: 7px;
    background: rgb(var(--v-theme-chipBg));
    color: rgb(var(--v-theme-chipColor));
  }

  &__value {
    font-weight: 500;
    color: rgb(var(--v-theme-primary));
    font-size: 14px;
    position: relative;
    margin-right: 8px;
  }

  &__copy {
    cursor: pointer;
  }
}

.dropdown-menu {
  background: rgb(var(--v-theme-chipBg));
  position: absolute;
  bottom: -110px;
  left: -114px;
  width: 146px;
  border-radius: 12px;
  padding: 4px;
  user-select: none;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  z-index: 50;

  &-item {
    transition: background-color 0.15s ease-in;
    height: 41px;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    padding-left: 12px;
    color: rgb(var(--v-theme-primary));

    &_disabled {
      pointer-events: none;
      opacity: 0.26;
    }

    :deep(svg) {
      margin-right: 10px;
    }

    & + .dropdown-menu-item {
      margin-top: 2px;
    }

    &:hover {
      background: rgba(229, 236, 253, 1);
    }

    &_remove {
      color: rgba(255, 0, 0, 1);
    }
  }
}

.wallet {
  &_read {
    width: 299px;
    height: 110px;
    margin: 0;
    border: 1px solid rgb(211, 219, 237) !important;

    @media (max-width: 1024px) {
      width: 237px;
    }

    @media (max-width: 767px) {
      width: 100%;
      height: 80px;
    }
  }
}
</style>
