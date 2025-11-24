<template>
  <section id="join" v-reveal class="cta">
    <v-container class="container">
      <h2 class="cta__title">Готов присоединиться <span>к сообществу клипмейкеров?</span></h2>

      <p class="cta__subtitle">
        Присоединяйся к сообществу создателей, которые помогают
        <span>блогерам становиться популярнее.</span>
      </p>

      <div class="cta__actions">
        <v-btn class="cta__btn" to="/login">
          Присоединиться к SlicerTok
          <SvgIcon name="arrow-top-black" />
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/base/SvgIcon.vue'
</script>

<style scoped lang="scss">
.cta {
  padding-top: 103px;
  padding-bottom: 101px;
  background-color: rgba(84, 7, 135, 1);
  text-align: center;
  border-radius: 24px;
  background-image: url('@/static/img/cta-bg.png');
  background-size: cover;

  @media (max-width: 767px) {
    padding-top: 103px;
    padding-bottom: 104px;
  }

  &__btn {
    height: 64px;
    background-color: #fff;
    font-family: 'Manrope', sans-serif;
    font-weight: 600;
    font-size: 16px;
    border-radius: 20px;
    text-transform: none;
    letter-spacing: -0.2px;
    padding: 0 24px;
    color: rgba(17, 17, 17, 1);

    :deep(.svg-icon) {
      margin-left: 12px;
      color: #000;
    }
  }
}

.cta__title {
  margin-bottom: 14px;
  color: #fff;

  @media (max-width: 767px) {
    margin-bottom: 11px;
  }

  span {
    display: block;
  }
}

.cta__subtitle {
  margin-bottom: 32px;
  color: #fff;

  span {
    display: block;

    @media (max-width: 767px) {
      display: inline;
    }
  }
}
</style>
