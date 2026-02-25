<template>
  <header class="header-lp" :class="{ 'header-lp_scrolled': isScrolled }">
    <v-container class="container">
      <div class="header-lp__wrapper">
        <div class="header-lp__logo" @click="goHome()">
          <SvgIcon name="logo" />
        </div>

        <nav v-if="!hideMenu" class="header-lp-nav">
          <a href="#how" class="header-lp-nav__link" @click.prevent="scrollToSection('how')"
            >Как работает</a
          >
          <a href="#why" class="header-lp-nav__link" @click.prevent="scrollToSection('why')"
            >Почему SlicerTok</a
          >
          <a href="#join" class="header-lp-nav__link" @click.prevent="scrollToSection('join')"
            >Присоединяйся</a
          >
        </nav>

        <div class="header-lp__actions">
          <button class="change-mode" @click="themeStore.toggle()">
            <SvgIcon :name="themeStore.current === 'dark' ? 'dark-mode' : 'light-mode'" />
          </button>
          <v-btn class="header-lp__login" to="/login">Войти</v-btn>
        </div>
      </div>
    </v-container>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useThemeStore } from '@/app/stores'

import SvgIcon from '../../shared/ui/SvgIcon.vue'

defineProps({
  hideMenu: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const themeStore = useThemeStore()

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const goHome = () => {
  router.push({ name: 'Landing' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.header-lp {
  background: #fff;
  height: 72px;
  position: sticky;
  top: 0;
  z-index: 150;
  border-bottom: 1px solid transparent;

  &.header-lp_scrolled {
    border-bottom-color: #f6f1f9;
  }

  .container {
    height: 100%;
  }

  &__logo {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__wrapper {
    display: flex;
    justify-content: space-between;
    height: 100%;
  }

  &__login {
    height: 44px;
    width: 86px;
    background-color: rgba(17, 17, 17, 1);
    font-family: 'Manrope', sans-serif;
    font-weight: 600;
    font-size: 14px;
    border-radius: 14px;
    text-transform: none;
    letter-spacing: -0.2px;
    padding: 0 22px;
    color: #fff;
    box-shadow: none;
    align-self: flex-end;

    &:hover {
      background: rgba(59, 59, 59, 1);
    }
  }

  &-nav {
    display: flex;
    justify-content: center;
    gap: 32px;
    position: relative;
    height: 100%;
    align-items: center;

    @media (max-width: 767px) {
      display: none;
    }

    &__link {
      color: rgba(126, 126, 126, 1);
      font-family: 'Manrope', sans-serif;
      font-weight: 600;
      font-size: 14px;
      display: block;
      letter-spacing: -0.4px;
      transition: color 0.2s ease-in;

      &:hover {
        color: rgba(17, 17, 17, 1);
      }
    }
  }
}

.change-mode {
  min-width: 30px;
  max-width: 30px;
  margin-right: 4px;
}
</style>
