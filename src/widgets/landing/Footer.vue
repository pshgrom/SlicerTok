<template>
  <footer class="footer">
    <v-container class="container" :class="{ container_offset: offsetContainer }">
      <div class="footer__content">
        <div class="footer__left">
          <div class="footer__logo">
            <SvgIcon :name="themeStore.current === 'dark' ? 'logo-dark' : 'logo'" />
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
        <SvgIcon :name="themeStore.current !== 'dark' ? 'logo-big' : 'logo-big-dark'" />
      </div>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/app/stores'
import { useDeviceDetection } from '@/shared/lib'
import SvgIcon from '@/shared/ui/SvgIcon.vue'

defineProps({
  offsetContainer: {
    type: Boolean,
    default: false
  }
})

const themeStore = useThemeStore()
const year: number = new Date().getFullYear()
const { isMobile } = useDeviceDetection()
</script>

<style scoped lang="scss">
.footer {
  position: relative;
  padding-top: 4px;
  background-color: rgb(var(--v-theme-secondLandingBg));

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
      max-width: 1120px;
      margin: 0 auto;

      :deep(svg) {
        width: 100%;
        height: auto;
        display: block;
      }
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
    color: rgb(126, 126, 126);
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
        color: rgb(var(--v-theme-primary));
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
