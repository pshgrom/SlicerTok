<template>
  <section id="hero" v-reveal class="hero">
    <v-container class="container">
      <div class="hero-social">
        <v-btn icon size="small">
          <SvgIcon name="tiktok" scale="1.5" />
        </v-btn>
        <v-btn icon size="small">
          <SvgIcon name="shorts" scale="1.5" />
        </v-btn>
        <v-btn icon size="small">
          <SvgIcon name="instagram" scale="1.4" />
        </v-btn>
      </div>
      <h1 class="hero__title">Клипмейкеры и блогеры <span>растут вместе</span></h1>

      <p class="hero__subtitle">
        <span>Платформа, где блогеры и клипмейкеры создают вирусный</span>
        <span> контент вместе. Загружай, попадай в ТОП и получай оплату.</span>
      </p>

      <div class="hero__actions">
        <v-btn class="hero__btn" to="/login">
          <SvgIcon name="arrow-top" />
          Стать клипмейкером
        </v-btn>
        <v-btn class="hero__btn hero__btn--dark"><SvgIcon name="video" />Как это работает</v-btn>
      </div>

      <div class="hero-stats">
        <div class="hero-stats__item">
          <h3>30K+</h3>
          <p>Опубликованных <span>видео</span></p>
        </div>

        <div class="hero-stats__item">
          <h3>90%</h3>
          <p>Одобренных <span>заявок</span></p>
        </div>

        <div class="hero-stats__item">
          <h3>200+</h3>
          <p>Активных <span>клипмейкеров</span></p>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/base/SvgIcon.vue'
</script>

<style scoped lang="scss">
.hero {
  background-image: url('@/static/img/hero-bg.png');
  background-size: cover;
  text-align: center;
  border-radius: 24px;
  padding-bottom: 65px;
  padding-top: 65px;

  &-social {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: 7px;

    :deep(button) {
      box-shadow: none;
    }
  }

  &__btn {
    height: 62px;
    background-color: rgba(169, 55, 244, 1);
    font-family: 'Manrope', sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    border-radius: 20px;
    text-transform: none;
    letter-spacing: -0.2px;
    padding: 0 24px;
    box-shadow: none;

    :deep(.svg-icon) {
      margin-right: 10px;
    }

    &--dark {
      background: rgba(17, 17, 17, 1);
    }
  }

  &__subtitle {
    margin-bottom: 31px;
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 80px;
  }
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 10px;

  &__item {
    max-width: 150px;
    min-width: 150px;
    margin-bottom: 2px;

    h3 {
      color: rgba(169, 55, 244, 1);
      font-size: 22px;
      line-height: 160%;
      font-family: 'Unbounded', sans-serif;
      font-weight: 500;
    }

    p {
      font-size: 12px;
      line-height: 132%;
      text-align: center;
    }
  }
}
</style>
