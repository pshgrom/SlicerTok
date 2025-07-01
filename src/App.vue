<template>
  <v-app>
    <ErrorAlert />
    <LeftSideBar v-if="isShowLeftSidebar" />
    <v-main class="main">
      <v-container
        class="custom-container"
        :class="{ 'custom-container_none': isAdmin }"
        fluid
        style="max-width: 1000px"
      >
        <HeaderMain v-if="isShowHeader" />
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import LeftSideBar from '@/components/layout/LeftSideBar.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ErrorAlert from '@/components/base/ErrorAlert.vue'
import HeaderMain from '@/components/layout/HeaderMain.vue'
import { useAuth } from '@/stores/Auth.ts'

const router = useRouter()
const authStore = useAuth()

const page = computed(() => router.currentRoute.value.name)
const isShowLeftSidebar = computed(() => {
  return (
    page.value !== 'Login' &&
    page.value !== 'LoginAdmin' &&
    page.value !== 'NotFound' &&
    page.value !== 'UserInfo'
  )
})

const isAdmin = computed(() => authStore.role !== 'slicer')

const isShowHeader = computed(() => page.value === 'UserInfo')
</script>

<style lang="scss">
@import './assets/sass/style.scss';

.main {
  background: rgba(226, 238, 243, 1);
}
</style>
