<template>
  <ul class="menu">
    <li v-for="item in visibleMenuItems" :key="item.label">
      <SvgIcon v-if="item.icon" :name="item.icon" />
      <RouterLink v-if="item.to" :to="item.to" class="menu-link" active-class="active">
        {{ item.label }}
      </RouterLink>
      <span v-else class="menu-el" @click="item.onClick?.()">
        {{ item.label }}
        <span
          v-if="item.isChat && chatStore.unreadCount > 0 && !userInfoStore.showChat"
          class="chat-user__badge menu-el__badge"
        >
          {{ chatStore.unreadCount >= 9 ? '9+' : chatStore.unreadCount }}
        </span>
      </span>
    </li>
    <li>
      <v-btn icon size="sm" @click="themeStore.toggle()">
        <v-icon>
          {{ themeStore.current === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import SvgIcon from '@/components/base/SvgIcon.vue'
import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'
import { ROLES, type RoleType } from '@/constants/roles'
import { useAuth } from '@/stores/Auth.ts'
import { useThemeStore } from '@/stores/Theme.ts'
import { useChatStore } from '@/stores/UserChat.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

const emit = defineEmits(['updateOpenModal'])
const chatStore = useChatStore()
const themeStore = useThemeStore()

type MenuItem = {
  label: string
  to?: string
  icon?: string
  onClick?: () => void
  show?: () => boolean
  isChat?: () => boolean
}

const authStore = useAuth()
const { isMobile } = useDeviceDetection()

const userInfoStore = useUserInfo()
const { showChat, showRules } = storeToRefs(userInfoStore)

const menuItems: Partial<Record<RoleType, MenuItem[]>> = {
  [ROLES.ADMIN]: [
    { label: 'Заявки', to: '/admin-info' },
    { label: '2FA', onClick: () => emit('updateOpenModal', true), icon: '2fa' }
  ],
  [ROLES.SLICER]: [
    {
      label: 'Правила загрузки',
      onClick: () => (showRules.value = !showRules.value),
      icon: 'rules'
    },
    {
      label: 'Поддержка',
      icon: 'support',
      isChat: true,
      show: () => isMobile.value,
      onClick: () => (showChat.value = !showChat.value)
    },
    { label: '2FA', onClick: () => emit('updateOpenModal', true), icon: '2fa' }
  ],
  [ROLES.ADMIN_FINANCE]: [
    { label: '2FA', onClick: () => emit('updateOpenModal', true), icon: '2fa' }
  ],
  [ROLES.ADMIN_MAIN]: [
    { label: 'Общая информация', to: '/admin-main' },
    { label: '2FA', onClick: () => emit('updateOpenModal', true), icon: '2fa' }
  ],
  [ROLES.STREAMER]: [
    { label: 'Статистика', to: '/streamer-stats' },
    { label: 'Заявки', to: '/streamer' },
    { label: 'Коэффициенты', to: '/streamer-coefficients' },
    { label: 'Логи', to: '/streamer-logs' },
    { label: '2FA', onClick: () => emit('updateOpenModal', true), icon: '2fa' }
  ],
  [ROLES.SUPPORT]: [
    { label: 'Заявки', to: '/support' },
    { label: 'Пользователи', to: '/support-users' },
    { label: 'Чат', to: '/support-chat' },
    { label: '2FA', onClick: () => emit('updateOpenModal', true), icon: '2fa' }
  ]
}

const visibleMenuItems = computed(() =>
  (menuItems[authStore.role] || []).filter((item) => (item.show ? item.show() : true))
)
</script>

<style scoped lang="scss">
.menu {
  display: flex;
  align-items: center;
  margin-right: 12px;

  li {
    background: rgb(var(--v-theme-chipBg));
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(var(--v-theme-chipColor));
    font-size: 12px;
    font-weight: 600;
    border-radius: 8px;
    padding: 0 8px 0 10px;
    cursor: pointer;
    transition: opacity 0.15s ease-in;

    .svg-icon {
      margin-right: 8px;
    }

    & + li {
      margin-left: 4px;
    }

    :deep(svg path) {
      transition: all 0.2s ease-in;
      stroke: rgb(var(--v-theme-chipColor));
    }

    &:hover {
      :deep(svg path) {
        stroke: rgba(169, 55, 244, 1);
      }
    }
  }
}

.menu-link.active {
  color: rgba(169, 55, 244, 1);
  pointer-events: none !important;
}

.menu-el {
  position: relative;

  &__badge {
    top: -15px;
    right: -10px;
  }
}
</style>
