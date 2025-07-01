<template>
  <header class="header">
    <div class="header__left">
      <div class="header__logo">
        <SvgIcon name="logo" />
      </div>
    </div>
    <div class="header__right">
      <ul class="menu">
        <li><span>Правила загрузки</span></li>
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
import { useAuth } from "@/stores/Auth";
import { useRouter } from "vue-router";
import SvgIcon from "@/components/base/SvgIcon.vue";

const authStore = useAuth();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push({ name: "Login" });
};
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

  &__right {
    display: flex;
    align-items: center;
  }

  .menu {
    margin-right: 30px;
    li {
      color: rgba(17, 17, 17, 1);
      font-family: "Inter Medium", sans-serif;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
    }
  }
}
</style>
