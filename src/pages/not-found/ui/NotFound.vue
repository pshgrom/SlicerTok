<template>
  <div class="not-found">
    <div class="not-found__content">
      <SvgIcon name="404" />
      <h3 class="not-found__title">Страница не найдена</h3>
      <p class="not-found__text">
        К сожалению, неправильно выбран адрес, <br />
        или такой страницы на сайте больше не существует.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/shared/ui/SvgIcon.vue'
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;

  &__content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  &__title {
    margin-top: 30px;
    font-weight: 500;
    font-size: 18px;
    color: rgb(var(--v-theme-primary));
    margin-bottom: 10px;
  }

  &__text {
    text-align: center;
    font-size: 14px;
    line-height: 140%;
    color: rgb(var(--v-theme-primary));
  }
}
</style>
