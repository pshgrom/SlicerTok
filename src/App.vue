<template>
  <v-app>
    <ErrorAlert />
    <GlobalLoader v-if="loader.isLoading" />
    <v-main class="main">
      <v-container
        class="custom-container"
        fluid
        :class="{
          'custom-container_slicer': isSlicer || insideSlicer,
          'custom-container_none': landing || terms || privacyPolicy
        }"
      >
        <HeaderMain v-if="showContent || showForSlicer" />
        <div v-if="showChat && !isMobile" class="chat-user" @click="toggleChat">
          <SvgIcon :disabled="isSlicer && !userName" name="chat" class="chat-open" />
          <span
            v-if="chatStore.unreadCount > 0 && !userInfoStore.showChat"
            class="chat-user__badge"
          >
            {{ chatStore.unreadCount >= 9 ? '9+' : chatStore.unreadCount }}
          </span>
        </div>
        <router-view />
      </v-container>
    </v-main>
    <teleport to="body">
      <transition name="fade" mode="out-in">
        <template v-if="showChat">
          <UserChat v-show="userInfoStore.showChat" v-model:show-chat="userInfoStore.showChat" />
        </template>
      </transition>
    </teleport>
  </v-app>
</template>

<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

import ErrorAlert from '@/components/base/ErrorAlert.vue'
import SvgIcon from '@/components/base/SvgIcon.vue'
import UserChat from '@/components/base/UserChat.vue'
import GlobalLoader from '@/components/GlobalLoader.vue'
import HeaderMain from '@/components/layout/HeaderMain.vue'
import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'
import { useAuth } from '@/stores/Auth.ts'
import { useError } from '@/stores/Errors.ts'
import { useLoader } from '@/stores/GlobalLoader.ts'
import { useChatStore } from '@/stores/UserChat.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

const loader = useLoader()
const errorStore = useError()

const router = useRouter()
const authStore = useAuth()
const userInfoStore = useUserInfo()
const chatStore = useChatStore()
const { isMobile } = useDeviceDetection()

const page = computed(() => router.currentRoute.value.name)

const hideChatPages = ['Login', 'LoginAdmin', 'Landing', 'Terms', 'PrivacyPolicy']

const showContent = computed(() =>
  page.value ? !hideChatPages.includes(page.value as string) : false
)

const showChat = computed(() => router.currentRoute.value?.meta?.showChat)

const toggleChat = async () => {
  if (isSlicer.value && !userName.value) {
    errorStore.setErrors('Введите имя пользователя', 'error')
    return
  }
  userInfoStore.showChat = !userInfoStore.showChat
  // if (userInfoStore.showChat) {
  //   await chatStore.markAllAsRead()
  // }
}

watch(
  () => [isMobile.value, userInfoStore.showChat],
  (val) => {
    if (val[0] && val[1]) {
      document.querySelector('html').style.overflow = 'hidden'
    } else {
      document.querySelector('html').style.overflow = 'auto'
    }
  }
)

watch(
  () => userInfoStore.showChat,
  (val) => {
    nextTick(() => {
      const overlays = document.querySelectorAll('.v-overlay-container > .v-overlay')
      overlays.forEach((overlay) => {
        const isMenu = overlay.classList.contains('v-overlay--menu')
        const isActive = overlay.classList.contains('v-overlay--active')

        if (val && !isMenu && isActive) {
          overlay.style.opacity = '0'
          overlay.style.pointerEvents = 'none'
          overlay.style.visibility = 'hidden'
        } else if (!val && isActive) {
          overlay.style.opacity = ''
          overlay.style.pointerEvents = ''
          overlay.style.visibility = ''
        }
      })
    })
  },
  { immediate: true }
)

const isSlicer = computed(() => authStore.role === 'slicer')
const userName = computed(() => userInfoStore.userInfo?.profile?.name ?? '')

const insideSlicer = computed(() => page.value === 'User')
const landing = computed(() => page.value === 'Landing')
const terms = computed(() => page.value === 'Terms')
const privacyPolicy = computed(() => page.value === 'PrivacyPolicy')

const showForSlicer = computed(() => page.value === 'UserInfo')
</script>

<style lang="scss">
@use './assets/sass/style.scss' as *;

.main {
  background: rgba(226, 238, 243, 1);
}
</style>
