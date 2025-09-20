<template>
  <ul class="menu">
    <li v-for="item in visibleMenuItems" :key="item.label">
      <RouterLink v-if="item.to" :to="item.to" class="menu-link" active-class="active">
        {{ item.label }}
      </RouterLink>
      <span v-else @click="item.onClick?.()">{{ item.label }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'
import { ROLES } from '@/constants/roles'
import { useAuth } from '@/stores/Auth.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

const emit = defineEmits(['updateOpenModal'])

const authStore = useAuth()
const { isMobile } = useDeviceDetection()

const userInfoStore = useUserInfo()
const { showChat } = storeToRefs(userInfoStore)

const menuItems: Record<string, any[]> = {
  [ROLES.SLICER]: [
    { label: 'Правила' },
    { label: '2FA', onClick: () => emit('updateOpenModal', true) },
    {
      label: 'Поддержка',
      show: () => isMobile,
      onClick: () => (showChat.value = !showChat.value)
    }
  ],
  [ROLES.ADMIN_MAIN]: [
    { label: 'Заявки', to: '/admin-main' },
    { label: 'Коэффициенты', to: '/coefficients' },
    { label: 'Логи', to: '/admin-main-logs' }
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

  li {
    color: rgba(17, 17, 17, 1);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.15s ease-in;

    & + li {
      margin-left: 20px;
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
</style>
