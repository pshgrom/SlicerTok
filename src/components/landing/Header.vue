<template>
  <header class="header-lp">
    <v-container class="container">
      <div class="header-lp__wrapper">
        <div class="header-lp__logo" @click="goHome()">
          <SvgIcon name="logo" />
        </div>

        <nav class="header-lp-nav">
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
          <v-btn class="header-lp__login" to="/login">Войти</v-btn>
        </div>
      </div>
    </v-container>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const goHome = () => {
  router.push({ name: 'Landing' })
}
</script>

<style scoped lang="scss">
.header-lp {
  background: #fff;
  height: 72px;
  position: sticky;
  top: 0;
  z-index: 150;
  border-bottom: 1px solid #f6f1f9;

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
    margin-bottom: 53px;
    align-self: flex-end;
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
      color: rgba(0, 0, 0, 0.64);
      font-family: 'Manrope', sans-serif;
      font-weight: 600;
      font-size: 14px;
      display: block;
      letter-spacing: -0.4px;
    }
  }
}
</style>
