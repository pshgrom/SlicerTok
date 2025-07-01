<template>
  <div class="wallet" :class="{ wallet_read: onlyRead }" :style="{ backgroundColor: getBgColor() }">
    <div class="wallet__wrapper">
      <div v-if="wallet.is_main" class="wallet__main">Основной</div>
      <div class="wallet__value" :class="{ wallet__value_offset: !wallet.is_main }">
        {{ formatWallet(wallet.address) }}
      </div>
    </div>
    <div v-if="!onlyRead" class="wallet-menu">
      <div class="wallet-menu-icon" @click="openDialog">
        <SvgIcon name="menu" :class="{ active: openIndex === index }" />
      </div>
      <ul v-show="openIndex === index" ref="menuRef" class="dropdown-menu">
        <li
          @click.prevent="setAsMain"
          class="dropdown-menu-item"
          :class="{ 'dropdown-menu-item_disabled': wallet.is_main }"
        >
          <SvgIcon name="main" :fill="wallet.is_main ? '#000' : '#fff'" />
          <span>Основной</span>
        </li>
        <li @click="copyWallet(wallet.address)" class="dropdown-menu-item">
          <SvgIcon name="copy" />
          <span>Скопировать</span>
        </li>
        <li
          @click.prevent="removeWallet"
          :class="{
            'dropdown-menu-item_disabled': wallets.length === 1 || wallet.is_main
          }"
          class="dropdown-menu-item dropdown-menu-item_remove"
        >
          <SvgIcon name="remove" />
          <span>Удалить</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import type { IWallet } from '@/interfaces/Slicer'
import { useError } from '@/stores/Errors'
import SvgIcon from '@/components/base/SvgIcon.vue'

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
    default: null
  },
  openIndex: {
    type: [Number, null],
    default: null
  },
  onlyRead: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:openIndex', 'setAsMain', 'removeWallet'])
const errorStore = useError()

const menuRef = ref<HTMLElement | null>(null)

const getBgColor = () => {
  if (props.index) {
    switch (props.index) {
      case 0:
        return 'rgba(179, 246, 255, 1)'
      case 1:
        return 'rgba(241, 229, 255, 1)'
      case 2:
        return 'rgba(254, 243, 197, 1)'
      default:
        return 'rgba(179, 246, 255, 1)'
    }
  }
  return 'rgba(179, 246, 255, 1)'
}

const openIndex = computed({
  get() {
    return props.openIndex
  },
  set(value) {
    emit('update:openIndex', value)
  }
})

const copyWallet = async (wallet: string) => {
  if (!wallet) return

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(wallet)
      errorStore.setErrors('Адрес успешно скопирован', 'success')
    } catch (err) {
      console.error('Clipboard API error:', err)
      // Попытка fallback
      fallbackCopyTextToClipboard(wallet)
    }
  } else {
    fallbackCopyTextToClipboard(wallet)
  }

  closeDialog()
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
      errorStore.setErrors('Адрес успешно скопирован', 'success')
    } else {
      throw new Error('execCommand failed')
    }
  } catch (err) {
    console.error('Fallback copy failed:', err)
    errorStore.setErrors('Не удалось скопировать текст.')
  }

  document.body.removeChild(textArea)
}

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

<style scoped lang="scss">
.wallet {
  min-width: 214px;
  height: 176px;
  border-radius: 16px;
  background: rgba(179, 246, 255, 1);
  margin-right: 8px;
  padding: 16px;
  position: relative;
  background-image: url('@/static/img/pattern.png');
  z-index: 1;
  margin-bottom: 20px;

  @media (max-width: 767px) {
    height: 140px;
    margin-bottom: 60px;
  }

  &-menu {
    position: absolute;
    right: 16px;
    top: 16px;

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
    background: rgba(17, 17, 17, 1);
    padding: 0 8px;
    display: inline-flex;
    align-items: center;
    height: 23px;
    border-radius: 16px;
    color: rgba(255, 255, 255, 1);
    font-family: 'Inter Medium', sans-serif;
    font-size: 12px;
    margin-bottom: 8px;
  }

  &__value {
    font-family: 'Inter Medium', sans-serif;
    color: rgba(17, 17, 17, 1);
    font-size: 14px;
    position: relative;

    &_offset {
      top: 8px;
    }
  }
}

.dropdown-menu {
  background: rgba(255, 255, 255, 1);
  position: absolute;
  bottom: -140px;
  left: -114px;
  width: 146px;
  border-radius: 12px;
  padding: 4px;
  user-select: none;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);

  &-item {
    transition: background-color 0.15s ease-in;
    height: 41px;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: rgba(17, 17, 17, 1);
    padding-left: 12px;

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
  }
}
</style>
