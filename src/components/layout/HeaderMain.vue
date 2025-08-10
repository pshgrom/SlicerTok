<template>
  <header class="header">
    <div class="header__left">
      <div class="header__logo" @click="goHome()">
        <SvgIcon name="logo" />
      </div>
    </div>
    <div class="header__right">
      <ul class="menu">
        <li v-if="role === ROLES.SLICER"><span>Правила</span></li>
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
</template>
<script setup lang="ts">
import { useAuth } from '@/stores/Auth'
import { useRouter } from 'vue-router'
import { ROLES } from '@/constants/roles.ts'
import { computed, onMounted } from 'vue'
import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

const authStore = useAuth()
const router = useRouter()
const userInfoStore = useUserInfo()

const role = computed(() => authStore.role)
const { isMobile } = useDeviceDetection()

const logout = () => {
  authStore.logout()
  authStore.role === ROLES.SLICER
    ? router.push({ name: 'Login' })
    : router.push({ name: 'LoginAdmin' })
}

const goHome = () => {
  switch (authStore.role) {
    case ROLES.SLICER:
      router.push({ name: 'UserInfo' })
  }
}

const goToPage = (path: string) => {
  router.push({ path })
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
