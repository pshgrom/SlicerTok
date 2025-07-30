<template>
  <v-app>
    <ErrorAlert />
    <GlobalLoader v-if="loader.isLoading" />
    <v-main class="main">
      <v-container
        class="custom-container"
        :class="{ 'custom-container_none': isAdmin }"
        fluid
        style="max-width: 1000px"
      >
        <HeaderMain v-if="showContent || showForSlicer" />
        <div v-if="showMainChat || showForSlicer" class="chat-user">
          <SvgIcon v-if="!isMobile" name="chat" class="chat-open" @click="toggleChat" />
          <span
            v-if="userInfoStore.unreadCount > 0 && !userInfoStore.showChat"
            class="chat-user__badge"
          >
            {{ userInfoStore.unreadCount }}
          </span>
        </div>
        <transition name="fade" mode="out-in">
          <div v-if="showContent">
            <UserChat v-show="userInfoStore.showChat" v-model:showChat="userInfoStore.showChat" />
          </div>
        </transition>
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
import { useUserInfo } from '@/stores/UserInfo.ts'
import GlobalLoader from '@/components/GlobalLoader.vue'
import { useLoader } from '@/stores/GlobalLoader.ts'
import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'

const loader = useLoader()

const router = useRouter()
const authStore = useAuth()
const userInfoStore = useUserInfo()
const { isMobile } = useDeviceDetection()

const page = computed(() => router.currentRoute.value.name)

const hideChatPages = ['Login', 'LoginAdmin', 'NotFound']
const noChatPages = [
  'Login',
  'LoginAdmin',
  'NotFound',
  'AdminMainLogs',
  'AdminMain',
  'Support',
  'SupportChat',
  'SupportUsers'
]

const showContent = computed(() =>
  page.value ? !hideChatPages.includes(page.value as string) : false
)
const showMainChat = computed(() =>
  page.value ? !noChatPages.includes(page.value as string) : false
)

const toggleChat = () => {
  userInfoStore.showChat = !userInfoStore.showChat
  if (userInfoStore.showChat) {
    userInfoStore.unreadCount = 0
  }
}

const isAdmin = computed(() => authStore.role !== 'slicer')

const showForSlicer = computed(() => page.value === 'UserInfo')
</script>

<style lang="scss">
@use './assets/sass/style.scss' as *;

.main {
  background: rgba(226, 238, 243, 1);
}
</style>
