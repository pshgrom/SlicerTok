<template>
  <header class="header">
    <div class="header__left">
      <div class="header__logo" @click="goHome()">
        <SvgIcon name="logo" />
      </div>
    </div>
    <div class="header__right">
      <AppMenu v-if="!hideMenu" @update-open-modal="updateOpenModal" />
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

import AppMenu from '@/components/menu/AppMenu.vue'
import TwoFactorAuth from '@/components/modals/TwoFactorAuth.vue'
import { ROLES } from '@/constants/roles.ts'
import { useAuth } from '@/stores/Auth'
import { useUserInfo } from '@/stores/UserInfo.ts'

const authStore = useAuth()
const router = useRouter()
const userInfoStore = useUserInfo()

const isModalOpen = ref(false)
const role = computed(() => authStore.role)
const page = computed(() => router.currentRoute.value.name)

const hideMenu = computed(() => page.value === 'NotFound')

const updateOpenModal = (value: boolean) => {
  isModalOpen.value = value
}

const logout = () => {
  authStore.logout()
  if (authStore.role === ROLES.SLICER) {
    router.push({ name: 'Login' })
  } else {
    router.push({ name: 'LoginAdmin' })
  }
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
    case ROLES.SUPPORT:
      router.push({ name: 'Support' })
      break
  }
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
}
</style>
