<template>
  <v-navigation-drawer
    :width="180"
    style="min-width: 180px"
    permanent
    color="#0070BE"
  >
    <v-list-item height="64">
      <!--      <v-img-->
      <!--        src="/logo.svg"-->
      <!--        alt="Logo"-->
      <!--        class="d-flex cursor-pointer"-->
      <!--        max-height="40"-->
      <!--      />-->
      <SvgIcon name="logo" />
    </v-list-item>
    <v-divider></v-divider>
    <v-list nav v-model:selected="selected" @click:select="goToPage">
      <v-list-item
        v-if="role === ROLES.SLICER"
        value="/user-info"
        title="Информация"
      ></v-list-item>
      <v-list-item
        v-else-if="role === ROLES.ADMIN_FINANCE"
        value="/admin-payments-finance"
        title="Информация"
      ></v-list-item>
      <template v-else-if="role === ROLES.ADMIN">
        <v-list-item value="/admin-info" title="Информация"></v-list-item>
        <v-list-item
          value="/admin-info-checked"
          title="Проверенные"
        ></v-list-item>
      </template>
      <template v-else-if="role === ROLES.ADMIN_MAIN">
        <v-list-item value="/admin-main" title="Информация"></v-list-item>
        <v-list-item value="/admin-main-logs" title="Логи"></v-list-item>
      </template>
      <!--        <v-list-item value="/amount-list" link title="Кошелек Нарезчика"></v-list-item>-->
      <!--        <v-list-item value="/wallet-list" link title="Выплаты"></v-list-item>-->
      <!--        <v-list-item value="/payout-list" link title="Список выплат"></v-list-item>-->
    </v-list>
    <template v-slot:append>
      <div class="pa-2 d-flex justify-center">
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuth } from "@/stores/Auth";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { ROLES } from "@/constants/roles";
import SvgIcon from "@/components/base/SvgIcon.vue";

const authStore = useAuth();
const router = useRouter();

const selected = ref([]);

const role = computed(() => authStore.role);

const logout = () => {
  authStore.logout();
  router.push({ name: "Login" });
};

const goToPage = (e) => {
  router.push({ path: e.id });
};

onMounted(async () => {
  await router.isReady();
  selected.value = [router.currentRoute.value.path];
});
</script>
