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
          <SvgIcon
            v-if="!isMobile"
            name="chat"
            class="chat-open"
            @click="userInfoStore.showChat = !userInfoStore.showChat"
          />
          <transition name="fade" mode="out-in">
            <UserChat v-if="userInfoStore.showChat" v-model:showChat="userInfoStore.showChat" />
          </transition>
        </div>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ErrorAlert from '@/components/base/ErrorAlert.vue'
import HeaderMain from '@/components/layout/HeaderMain.vue'
import { useAuth } from '@/stores/Auth.ts'
import UserChat from '@/components/base/UserChat.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'
import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

const router = useRouter()
const authStore = useAuth()
const userInfoStore = useUserInfo()

const page = computed(() => router.currentRoute.value.name)
const showContent = computed(
  () => page.value !== 'Login' && page.value !== 'LoginAdmin' && page.value !== 'NotFound'
)
const { isMobile } = useDeviceDetection()

const showMainChat = computed(
  () =>
    page.value !== 'Login' &&
    page.value !== 'LoginAdmin' &&
    page.value !== 'NotFound' &&
    page.value !== 'AdminMain' &&
    page.value !== 'Support' &&
    page.value !== 'SupportChat'
)

const isAdmin = computed(() => authStore.role !== 'slicer')

const showForSlicer = computed(() => page.value === 'UserInfo')

console.log('app page')
</script>

<style lang="scss">
@use './assets/sass/style.scss' as *;

.main {
  background: rgba(226, 238, 243, 1);
}
</style>
