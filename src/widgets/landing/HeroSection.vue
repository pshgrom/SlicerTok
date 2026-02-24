<template>
  <section id="hero" v-reveal class="hero">
    <v-container class="container">
      <div class="hero-social">
        <div class="hero-social__item"><SvgIcon name="tiktok" scale="1.4" /></div>
        <div class="hero-social__item"><SvgIcon name="shorts" scale="1.5" /></div>
        <div class="hero-social__item"><SvgIcon name="instagram" scale="1.4" /></div>
      </div>
      <h1 class="hero__title">Клипмейкеры и блогеры <span>растут вместе</span></h1>

      <p class="hero__subtitle">
        <span>Платформа, где блогеры и клипмейкеры создают вирусный контент вместе.</span>
        <span> Загружай, попадай в ТОП и получай оплату.</span>
      </p>

      <div class="hero__actions">
        <v-btn class="hero__btn" to="/login">
          Стать клипмейкером
          <SvgIcon name="arrow-top" />
        </v-btn>
        <v-btn class="hero__btn hero__btn--dark" @click.prevent="scrollToSection('how')"
          >Как это работает
          <SvgIcon name="video" />
        </v-btn>
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
import SvgIcon from '@/shared/ui/SvgIcon.vue'

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped lang="scss">
.hero {
  background-image: url('@/shared/assets/images/hero-bg.png');
  background-size: cover;
  text-align: center;
  border-radius: 24px;
  padding-bottom: 100px;
  padding-top: 103px;

  &-social {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: 16px;

    :deep(button) {
      box-shadow: none;
    }

    &__item {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  @media (max-width: 767px) {
    padding-top: 82px;
    padding-bottom: 82px;
  }

  &__social {
    @media (max-width: 767px) {
      margin-bottom: 6px;
    }
  }

  &__title {
    margin-bottom: 9px;
    @media (max-width: 767px) {
      margin-bottom: 12px;
    }
  }

  &__btn {
    height: 64px;
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
      margin-left: 12px;
    }

    &:hover {
      background: rgba(169, 77, 250, 1);
    }

    &--dark {
      background: rgba(17, 17, 17, 1);

      &:hover {
        background: rgba(59, 59, 59, 1);
      }
    }

    @media (max-width: 767px) {
      width: 245px;
    }
  }

  &__subtitle {
    margin-bottom: 31px;
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 52px;

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: center;
      margin-bottom: 51px;
    }
  }
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 4px;

  @media (max-width: 767px) {
    gap: 4px;
    justify-content: space-between;
  }

  &__item {
    max-width: 150px;
    min-width: 150px;
    margin-bottom: 2px;

    h3 {
      color: rgba(17, 17, 17, 1);
      font-size: 22px;
      line-height: 160%;
      font-family: 'Unbounded', sans-serif;
      font-weight: 500;
      margin-bottom: 4px;
    }

    p {
      font-size: 12px;
      line-height: 132%;
      text-align: center;
    }

    @media (max-width: 767px) {
      max-width: none;
      min-width: auto;

      h3 {
        font-size: 20px;
      }
    }
  }
}
</style>
