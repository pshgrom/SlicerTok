<template>
  <v-sheet class="header" color="header">
    <div class="header__left">
      <div class="header__logo" @click="goHome()">
        <SvgIcon :name="themeStore.current === 'dark' ? 'logo-dark' : 'logo'" />
      </div>
    </div>
    <div class="header__right">
      <AppMenu v-if="!hideMenu && !isMobile" @update-open-modal="headerMainStore.updateOpenModal" />
      <button
        v-if="!hideMenu && isMobile"
        class="button-action button-action_default-stroke"
        type="button"
        @click="toggleMobileMenu"
      >
        <SvgIcon :name="!isMobileMenuOpen ? 'burger' : 'cross'" />
      </button>
      <button v-if="!isMobile" class="header__logout" type="button" @click="logout">
        <SvgIcon name="logout" />
      </button>
    </div>
  </v-sheet>
  <Teleport to="body">
    <div
      v-if="!hideMenu && isMobile"
      v-show="isMobileMenuOpen"
      class="header__mobile-menu"
      @click="isMobileMenuOpen = false"
    >
      <nav class="header__mobile-menu-content">
        <AppMenu @update-open-modal="onMobileMenuAction" />
        <button type="button" class="header__mobile-logout" @click="logout">
          <SvgIcon name="logout" />
          <span>Выйти</span>
        </button>
      </nav>
    </div>
  </Teleport>
  <TwoFactorAuth
    v-if="headerMainStore.isModalOpen"
    v-model="headerMainStore.isModalOpen"
    :role="role"
    @submit="checkCode"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useHeaderMain, useThemeStore } from '@/app/stores'
import { useAuth } from '@/entities/auth'
import { ROLES } from '@/shared/config'
import { useDeviceDetection, useTwoFactor } from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'
import AppMenu from '@/widgets/menu'
import TwoFactorAuth from '@/widgets/modals/TwoFactorAuth.vue'

const authStore = useAuth()
const router = useRouter()
const headerMainStore = useHeaderMain()
const themeStore = useThemeStore()
const { isMobile } = useDeviceDetection()

const isMobileMenuOpen = ref(false)

const role = computed(() => authStore.role)

const { checkCode } = useTwoFactor(role.value)

const page = computed(() => router.currentRoute.value.name)

const hideMenu = computed(() => page.value === 'NotFound')

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const onMobileMenuAction = (open: boolean) => {
  headerMainStore.updateOpenModal(open)
  isMobileMenuOpen.value = false
}

const logout = () => {
  isMobileMenuOpen.value = false
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
    transition: all 0.2s ease;

    &:hover {
      background: rgb(var(--v-theme-actionBg));
    }
  }

  &__burger {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 8px;
    background: rgb(var(--v-theme-chipBg));
    color: rgb(var(--v-theme-chipColor));
    transition: all 0.2s ease;
    margin-right: 8px;

    &:hover {
      background: rgb(var(--v-theme-actionBg));
    }
  }

  &__right {
    display: flex;
    align-items: center;
  }
}

.header__mobile-menu {
  display: none;
}

@media (max-width: 767px) {
  .header {
    padding: 0 16px;
  }

  .header__mobile-menu {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 140;
    background: rgb(var(--v-theme-main));
    overflow-y: auto;
    top: 54px;
    width: 100%;
  }

  .header__mobile-menu-content {
    background: rgb(var(--v-theme-background));
    margin: 0 auto;
  }

  .header__mobile-logout {
    width: 100%;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 44px;
    border-radius: 8px;
    background: rgb(var(--v-theme-chipBg));
    color: rgb(var(--v-theme-chipColor));
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    @media (max-width: 767px) {
      height: 52px;
      border-radius: 0;
      border-bottom: 1px solid rgba(var(--v-theme-borderColor));
      width: 100% !important;
      margin: 0;
      border-top: none;
      padding-top: 0;
      padding-left: 16px;
      justify-content: flex-start;
      color: #fff;
      font-size: 16px;
      font-weight: 400;
      gap: 0;

      .svg-icon {
        margin-right: 12px;
        transform: scale(1.2) !important;
      }
    }

    &:hover {
      background: rgb(var(--v-theme-actionBg));
    }
  }
}
</style>
