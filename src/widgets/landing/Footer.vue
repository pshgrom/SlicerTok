<template>
  <footer class="footer">
    <v-container class="container" :class="{ container_offset: offsetContainer }">
      <div class="footer__content">
        <div class="footer__left">
          <div class="footer__logo">
            <SvgIcon name="logo" />
          </div>
        </div>
        <p v-if="!isMobile" class="footer__copyright">{{ year }} SlicerTok. Все права защищены</p>
        <div class="footer__right">
          <div class="footer__policy">
            <router-link to="/privacy-policy">Политика конфиденциальности</router-link>
            <router-link to="/terms">Условия использования</router-link>
            <p v-if="isMobile" class="footer__copyright">
              {{ year }} SlicerTok. Все права защищены
            </p>
          </div>
        </div>
      </div>
      <div class="footer__logo-big">
        <img src="../../shared/assets/images/logo-big.png" alt="logo" />
      </div>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
import { useDeviceDetection } from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'

defineProps({
  offsetContainer: {
    type: Boolean,
    default: false
  }
})

const year: number = new Date().getFullYear()
const { isMobile } = useDeviceDetection()
</script>

<style scoped lang="scss">
.footer {
  position: relative;
  background: #fff;
  padding-top: 4px;
  padding-bottom: 18px;

  @media (max-width: 767px) {
    padding-top: 0;
  }

  .container {
    @media (max-width: 767px) {
      padding-left: 0;
      padding-right: 0;
    }

    &_offset {
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  &__logo {
    margin-bottom: 50px;

    @media (max-width: 767px) {
      margin-bottom: 25px;
    }

    &-big {
      margin-top: 29px;
      position: absolute;
      bottom: 0;
      max-width: 1120px;
    }
  }

  &__content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 73px;

    @media (max-width: 767px) {
      margin-bottom: 64px;
      flex-direction: column;
    }
  }

  &__copyright {
    font-size: 12px;
    color: rgba(17, 17, 17, 0.5);
    letter-spacing: -0.2px;
    height: 100%;
    position: relative;
    top: 6px;

    @media (max-width: 767px) {
      margin-top: 20px !important;
    }
  }

  &__right {
    display: flex;
    flex-direction: column;
  }

  &__policy {
    a {
      display: block;
      color: rgba(126, 126, 126, 1);
      text-decoration: underline;
      font-size: 12px;
      letter-spacing: -0.2px;
      transition: color 0.2s ease-in;

      &:hover {
        color: rgba(17, 17, 17, 1);
      }
    }

    a + a {
      margin-top: 7px;
    }
  }
}

.container {
  padding-bottom: 0;
}
</style>
