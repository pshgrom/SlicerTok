<template>
  <footer class="footer">
    <v-container class="container">
      <div class="footer__content">
        <div class="footer__left">
          <div class="footer__logo">
            <SvgIcon name="logo" />
          </div>
          <div class="footer__policy">
            <p>Политика конфиденциальности</p>
            <p>Условия использования</p>
          </div>
        </div>

        <div class="footer__links">
          <a href="#how" class="footer__link" @click.prevent="scrollToSection('how')"
            >Как работает</a
          >
          <a href="#why" class="footer__link" @click.prevent="scrollToSection('why')"
            >Почему SlicerTok</a
          >
          <a href="#join" class="footer__link" @click.prevent="scrollToSection('join')"
            >Присоединяйся</a
          >
        </div>

        <div class="footer__right">
          <v-btn class="footer__btn" to="/login"> Войти </v-btn>
          <p class="footer__copyright">{{ year }} SlicerTok. Все права защищены</p>
        </div>
      </div>
      <div class="footer__logo-big">
        <SvgIcon name="logo-big" />
      </div>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/base/SvgIcon.vue'

const year: number = new Date().getFullYear()

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped lang="scss">
.footer {
  position: relative;
  background: #fff;
  padding-top: 18px;
  padding-bottom: 18px;

  &__btn {
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

  &__logo {
    margin-bottom: 50px;

    &-big {
      margin-top: 29px;
      position: absolute;
      bottom: 0;
    }
  }

  &__content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 134px;
  }

  &__links {
    display: flex;
    justify-content: center;
    gap: 32px;
    position: relative;
    top: 9px;
    height: 100%;
  }

  &__link {
    color: rgba(0, 0, 0, 0.64);
    font-family: 'Manrope', sans-serif;
    font-weight: 600;
    font-size: 14px;
    display: block;
    letter-spacing: -0.4px;
  }

  &__copyright {
    font-size: 11px;
    color: rgba(17, 17, 17, 0.5);
    letter-spacing: -0.2px;
  }

  &__right {
    display: flex;
    flex-direction: column;
  }

  &__policy {
    font-size: 11px;
    color: rgba(17, 17, 17, 0.4);

    p + p {
      margin-top: 4px;
    }
  }
}

.container {
  padding-bottom: 0;
}
</style>
