<template>
  <v-app>
    <ErrorAlert />
    <v-main class="main">
      <v-container
        class="custom-container"
        :class="{ 'custom-container_none': isAdmin }"
        fluid
        style="max-width: 1000px"
      >
        <HeaderMain v-if="showContent || showForSlicer" />
        <div v-if="showMainChat || showForSlicer">
          <VCusomButton @click="showChat = !showChat">Чат с поддержкой</VCusomButton>
          <UserChat v-if="showChat" />
        </div>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ErrorAlert from '@/components/base/ErrorAlert.vue'
import HeaderMain from '@/components/layout/HeaderMain.vue'
import { useAuth } from '@/stores/Auth.ts'
import UserChat from '@/components/base/UserChat.vue'
import VCusomButton from '@/components/base/VCusomButton.vue'

const router = useRouter()
const authStore = useAuth()
const showChat = ref(false)

const page = computed(() => router.currentRoute.value.name)
const showContent = computed(
  () => page.value !== 'Login' && page.value !== 'LoginAdmin' && page.value !== 'NotFound'
)

const showMainChat = computed(
  () =>
    page.value !== 'Login' &&
    page.value !== 'LoginAdmin' &&
    page.value !== 'NotFound' &&
    page.value !== 'AdminMain' &&
    page.value !== 'Support'
)

const isAdmin = computed(() => authStore.role !== 'slicer')

const showForSlicer = computed(() => page.value === 'UserInfo')
</script>

<style lang="scss">
@import './assets/sass/style.scss';

.main {
  background: rgba(226, 238, 243, 1);
}
</style>
