<template>
  <header class="header">
    <div class="header__left">
      <div class="header__logo" @click="goHome()">
        <SvgIcon name="logo" />
      </div>
    </div>
    <div class="header__right">
      <ul v-if="!hideMenu" class="menu">
        <template v-if="role === ROLES.SLICER">
          <li><span>Правила</span></li>
          <li @click="isModalOpen = true"><span>2FA</span></li>
        </template>
        <li
          v-if="role === ROLES.SLICER && isMobile"
          @click="userInfoStore.showChat = !userInfoStore.showChat"
        >
          <span>Поддержка</span>
        </li>
        <template v-else-if="role === ROLES.ADMIN">
          <li @click="goToPage('/admin-info')"><span>Информация</span></li>
          <li @click="goToPage('/admin-info-checked')"><span>Проверенные</span></li>
        </template>
        <template v-else-if="role === ROLES.ADMIN_MAIN">
          <li @click="goToPage('/admin-main')"><span>Информация</span></li>
          <li @click="goToPage('/admin-main-logs')"><span>Логи</span></li>
        </template>
        <template v-else-if="role === ROLES.SUPPORT">
          <li @click="goToPage('/support')"><span>Информация</span></li>
          <li @click="goToPage('/support-users')"><span>Пользователи</span></li>
          <li @click="goToPage('/support-chat')"><span>Поддержка</span></li>
        </template>
      </ul>
      <div class="header__logout">
        <v-btn icon size="small" @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
    </div>
  </header>
  <TwoFactorAuth v-if="isModalOpen" v-model="isModalOpen" @submit="checkCode" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import TwoFactorAuth from '@/components/modals/TwoFactorAuth.vue'
import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'
import { ROLES } from '@/constants/roles.ts'
import { useAuth } from '@/stores/Auth'
import { useUserInfo } from '@/stores/UserInfo.ts'

const authStore = useAuth()
const router = useRouter()
const userInfoStore = useUserInfo()

const isModalOpen = ref(false)
const role = computed(() => authStore.role)
const { isMobile } = useDeviceDetection()
const page = computed(() => router.currentRoute.value.name)

const hideMenu = computed(() => page.value === 'NotFound')

const logout = () => {
  authStore.logout()
  authStore.role === ROLES.SLICER
    ? router.push({ name: 'Login' })
    : router.push({ name: 'LoginAdmin' })
}

const goHome = () => {
  switch (authStore.role) {
    case ROLES.ADMIN:
      router.push({ name: 'AdminInfo' })
      break
    case ROLES.ADMIN_FINANCE:
      router.push({ name: 'AdminPaymentsFinance' })
      break
    case ROLES.SLICER:
      router.push({ name: 'UserInfo' })
      break
    case ROLES.ADMIN_MAIN:
      router.push({ name: 'AdminMain' })
      break
    case ROLES.SUPPORT:
      router.push({ name: 'Support' })
      break
  }
}

const goToPage = (path: string) => {
  router.push({ path })
}

const checkCode = (code: string) => {
  userInfoStore.checkCode(code)
}

onMounted(async () => {
  await router.isReady()
})
</script>

<style scoped lang="scss">
.header {
  background: rgba(226, 238, 243, 1);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 150;

  &__logo {
    cursor: pointer;
  }

  &__logout {
    :deep(button) {
      box-shadow: none;
    }
  }

  &__right {
    display: flex;
    align-items: center;
  }

  .menu {
    display: flex;
    align-items: center;
    margin-right: 30px;

    li {
      color: rgba(17, 17, 17, 1);
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      transition: opacity 0.15s ease-in;

      & + li {
        margin-left: 15px;
      }

      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
