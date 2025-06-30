<template>
  <header class="header">
    <div class="header__left">
      <div class="header__logo">
        <img src="@/static/icons/logo.svg" alt="logo" />
      </div>
    </div>
    <div class="header__right">
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

const authStore = useAuth()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped lang="scss">
.header {
  background: rgba(226, 238, 243, 1);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__logo {
    cursor: pointer;
  }

  &__logout {
    :deep(button) {
      box-shadow: none;
    }
  }
}
</style>
