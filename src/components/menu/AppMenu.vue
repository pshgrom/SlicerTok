<template>
  <ul class="menu">
    <li v-for="item in visibleMenuItems" :key="item.label">
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
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'
import { ROLES, type RoleType } from '@/constants/roles'
import { useAuth } from '@/stores/Auth.ts'
import { useChatStore } from '@/stores/UserChat.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

const emit = defineEmits(['updateOpenModal'])
const chatStore = useChatStore()

type MenuItem = {
  label: string
  to?: string
  onClick?: () => void
  show?: () => boolean
  isChat?: () => boolean
}

const authStore = useAuth()
const { isMobile } = useDeviceDetection()

const userInfoStore = useUserInfo()
const { showChat, showRules } = storeToRefs(userInfoStore)

const menuItems: Partial<Record<RoleType, MenuItem[]>> = {
  [ROLES.SLICER]: [
    { label: 'Правила', onClick: () => (showRules.value = !showRules.value) },
    { label: '2FA', onClick: () => emit('updateOpenModal', true) },
    {
      label: 'Поддержка',
      isChat: true,
      show: () => isMobile.value,
      onClick: () => (showChat.value = !showChat.value)
    }
  ],
  [ROLES.ADMIN_MAIN]: [{ label: 'Общая информация', to: '/admin-main' }],
  [ROLES.STREAMER]: [
    { label: 'Заявки', to: '/streamer' },
    { label: 'Коэффициенты', to: '/streamer-coefficients' },
    { label: 'Статистика', to: '/streamer-stats' },
    // { label: 'Админы онлайн', to: '/admins-online' },
    { label: 'Логи', to: '/streamer-logs' }
  ],
  [ROLES.SUPPORT]: [
    { label: 'Заявки', to: '/support' },
    { label: 'Пользователи', to: '/support-users' },
    { label: 'Чат', to: '/support-chat' }
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
  margin-right: 40px;

  @media (max-width: 767px) {
    margin-right: 15px;
  }

  li {
    color: rgba(17, 17, 17, 1);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.15s ease-in;

    & + li {
      margin-left: 20px;

      @media (max-width: 767px) {
        margin-left: 15px;
      }
    }

    &:hover {
      color: rgba(169, 55, 244, 1);
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
