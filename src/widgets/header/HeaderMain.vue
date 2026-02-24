<template>
  <v-sheet class="header" color="header">
    <div class="header__left">
      <div class="header__logo" @click="goHome()">
        <SvgIcon :name="themeStore.current === 'dark' ? 'logo-dark' : 'logo'" />
      </div>
    </div>
    <div class="header__right">
      <AppMenu v-if="!hideMenu" @update-open-modal="headerMainStore.updateOpenModal" />
      <button class="header__logout" @click="logout">
        <SvgIcon name="logout" />
      </button>
    </div>
  </v-sheet>
  <TwoFactorAuth
    v-if="headerMainStore.isModalOpen"
    v-model="headerMainStore.isModalOpen"
    :role="role"
    @submit="checkCode"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useHeaderMain, useThemeStore } from '@/app/stores'
import { useAuth } from '@/entities/auth'
import { ROLES } from '@/shared/config'
import { useTwoFactor } from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'
import AppMenu from '@/widgets/menu'
import TwoFactorAuth from '@/widgets/modals/TwoFactorAuth.vue'

const authStore = useAuth()
const router = useRouter()
const headerMainStore = useHeaderMain()
const themeStore = useThemeStore()

const role = computed(() => authStore.role)

const { checkCode } = useTwoFactor(role.value)

const page = computed(() => router.currentRoute.value.name)

const hideMenu = computed(() => page.value === 'NotFound')

const logout = () => {
  authStore.logout()
  if (authStore.role === ROLES.SLICER) {
    router.push({ name: 'Login' })
  } else {
    router.push({ name: 'LoginAdmin' })
  }
  authStore.role = null
  authStore.isEnableGoogle2fa = false
}

const goHome = () => {
  switch (role.value) {
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
    case ROLES.STREAMER:
      router.push({ name: 'Streamer' })
      break
    case ROLES.SUPPORT:
      router.push({ name: 'Support' })
      break
  }
}

onMounted(async () => {
  await router.isReady()
})
</script>

<style scoped lang="scss">
.header {
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 150;
  width: 100%;
  padding: 0 32px;
  margin-bottom: 22px;

  &__logo {
    cursor: pointer;
  }

  &__logout {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 8px;
    background: rgb(var(--v-theme-chipBg));
    color: rgb(var(--v-theme-chipColor));

    :deep(svg path) {
      transition: all 0.2s ease-in;
    }

    &:hover {
      :deep(svg path) {
        stroke: rgba(169, 55, 244, 1);
      }
    }
  }

  &__right {
    display: flex;
    align-items: center;
  }
}
</style>
