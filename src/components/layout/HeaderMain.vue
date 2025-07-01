<template>
  <header class="header">
    <div class="header__left">
      <div class="header__logo">
        <SvgIcon name="logo" />
      </div>
    </div>
    <div class="header__right">
      <ul class="menu">
        <li v-if="role === ROLES.SLICER"><span>Правила загрузки</span></li>
        <template v-else-if="role === ROLES.ADMIN">
          <li @click="goToPage('/admin-info')"><span>Информация</span></li>
          <li @click="goToPage('/admin-info-checked')"><span>Проверенные</span></li>
        </template>
        <template v-else-if="role === ROLES.ADMIN_MAIN">
          <li @click="goToPage('/admin-main')"><span>Информация</span></li>
          <li @click="goToPage('/admin-main-logs')"><span>Логи</span></li>
        </template>
      </ul>
      <div class="header__logout">
        <v-btn icon @click="logout" size="small">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useAuth } from '@/stores/Auth'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/base/SvgIcon.vue'
import { ROLES } from '@/constants/roles.ts'
import { computed, onMounted } from 'vue'

const authStore = useAuth()
const router = useRouter()

const role = computed(() => authStore.role)

const logout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
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
  z-index: 50;

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
      font-family: 'Inter Medium', sans-serif;
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
