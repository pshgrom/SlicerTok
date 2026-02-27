<template>
  <ul class="menu">
    <li v-for="item in visibleMenuItems" :key="item.label">
      <RouterLink
        v-if="item.to"
        :to="item.to"
        class="menu-item"
        :class="{ active: isLinkActive(item.to) }"
      >
        <SvgIcon v-if="item.icon" :name="item.icon" />
        {{ item.label }}
      </RouterLink>
      <span v-else class="menu-item menu-el" @click="item.onClick?.()">
        <SvgIcon v-if="item.icon" :name="item.icon" />
        {{ item.label }}
        <span
          v-if="item.isChat && chatStore.unreadCount > 0 && !userInfoStore.showChat"
          class="chat-user__badge menu-el__badge"
        >
          {{ chatStore.unreadCount >= 9 ? '9+' : chatStore.unreadCount }}
        </span>
      </span>
    </li>
    <li class="change-mode" @click="themeStore.toggle()">
      <div class="menu-item">
        <SvgIcon :name="themeStore.current === 'dark' ? 'dark-mode' : 'light-mode'" />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useThemeStore } from '@/app/stores'
import { useAuth, useUserInfo } from '@/entities'
import { useChatStore } from '@/entities/chat'
import { ROLES, type RoleType } from '@/shared/config'
import { useDeviceDetection } from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'

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

const route = useRoute()
const authStore = useAuth()
const { isMobile } = useDeviceDetection()

const isLinkActive = (to: string) => {
  const path = route.path
  return path === to || path.startsWith(to + '/')
}

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
  user-select: none;

  li {
    display: flex;
    list-style: none;

    & + li {
      margin-left: 4px;
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    padding: 0 8px 0 10px;
    color: rgb(var(--v-theme-chipColor));
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    background: rgb(var(--v-theme-chipBg));
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    .svg-icon {
      margin-right: 8px;
    }

    :deep(svg path) {
      transition: all 0.2s ease-in;
    }

    &:hover {
      background: rgb(var(--v-theme-actionBg));
    }

    &.active {
      background: rgb(var(--v-theme-actionBg));
      pointer-events: none !important;
    }
  }
}

.menu-el {
  position: relative;

  &__badge {
    top: -15px;
    right: -10px;
  }
}

.change-mode {
  padding: 0 !important;
  min-width: 30px;
  max-width: 30px;

  .svg-icon {
    margin-right: 0 !important;
  }
}

@media (max-width: 767px) {
  .menu {
    flex-direction: column;
    align-items: stretch;
    margin-right: 0;
    background: rgb(var(--v-theme-background));

    li {
      width: 100%;
      margin-left: 0;

      & + li {
        margin-left: 0;
      }
    }

    .menu-item {
      width: 100%;
      justify-content: flex-start;
      height: 52px;
      border-radius: 0;
      border-bottom: 1px solid rgba(var(--v-theme-borderColor));
      padding-left: 16px;
    }

    .menu-item.menu-el {
      color: #fff;
      font-size: 16px;
      letter-spacing: 0;
      font-weight: 400;
    }

    .menu-item .svg-icon {
      margin-right: 12px;
      transform: scale(1.2) !important;
    }

    .menu-item.active {
      color: rgba(169, 55, 244, 1);
      background: rgba(169, 55, 244, 0.08);
    }
  }
  .change-mode {
    height: 52px;
    border-radius: 0;
    border-bottom: 1px solid rgba(var(--v-theme-borderColor));
    padding-left: 16px !important;
    width: 100% !important;
    max-width: none;
    min-width: auto;
    color: rgb(var(--v-theme-chipColor));
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    background: rgb(var(--v-theme-chipBg));
  }
}
</style>
