<template>
  <header class="header">
    <div class="header__left">
      <div class="header__logo" @click="goHome()">
        <SvgIcon name="logo" />
      </div>
    </div>
    <div class="header__right">
      <AppMenu v-if="!hideMenu" @update-open-modal="headerMainStore.updateOpenModal" />
      <div class="header__logout">
        <v-btn icon size="small" @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
    </div>
  </header>
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

import AppMenu from '@/components/menu/AppMenu.vue'
import TwoFactorAuth from '@/components/modals/TwoFactorAuth.vue'
import { useTwoFactor } from '@/composables/useTwoFactor.ts'
import { ROLES } from '@/constants/roles.ts'
import { useAuth } from '@/stores/Auth'
import { useHeaderMain } from '@/stores/HeaderMain.ts'

const authStore = useAuth()
const router = useRouter()
const headerMainStore = useHeaderMain()

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
}
</style>
