<template>
  <section v-reveal class="dashboard">
    <v-container class="container">
      <div class="dashboard__content">
        <div class="dashboard__left">
          <h2 class="dashboard__title">Отслеживай все <span>в одном месте</span></h2>

          <p class="dashboard__subtitle">
            Интуитивный личный кабинет для управления твоими нарезками, заявками и взаимодействием с
            блогерами.
          </p>

          <div class="dashboard-list">
            <div class="dashboard-item">
              <div class="dashboard-item__icon">
                <SvgIcon name="dashboard-1" />
              </div>
              <div class="dashboard-item__content">
                <h3 class="dashboard-item__title">История заявок и выплат</h3>
                <p class="dashboard-item__text">Смотри прогресс каждой отправленной заявки.</p>
              </div>
            </div>
            <div class="dashboard-item">
              <div class="dashboard-item__icon">
                <SvgIcon name="dashboard-2" />
              </div>
              <div class="dashboard-item__content">
                <h3 class="dashboard-item__title">Статусы в реальном времени</h3>
                <p class="dashboard-item__text">Следи за модерацией и ответами модераторов.</p>
              </div>
            </div>
            <div class="dashboard-item">
              <div class="dashboard-item__icon">
                <SvgIcon name="dashboard-3" />
              </div>
              <div class="dashboard-item__content">
                <h3 class="dashboard-item__title">Аналитика твоих нарезок</h3>
                <p class="dashboard-item__text">Узнай, какие нарезки получают больше внимания.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="dashboard__right">
          <div class="dashboard__img">
            <img src="@/static/img/progress.png" alt="Progress" />
          </div>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/base/SvgIcon.vue'
</script>

<style scoped lang="scss">
.dashboard {
  padding-top: 103px;
  padding-bottom: 103px;
  background-image: url('@/static/img/ellipse.png');
  background-position-x: 80%;
  background-position-y: -150%;

  .container {
    @media (max-width: 767px) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  @media (max-width: 767px) {
    background-image: none;
    padding-top: 97px;
  }

  &__title {
    margin-bottom: 12px;

    span {
      display: block;

      @media (max-width: 767px) {
        display: inline;
      }
    }
  }

  &__subtitle {
    margin-bottom: 20px;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 767px) {
      flex-direction: column;
    }
  }

  &__left {
    max-width: 550px;

    @media (max-width: 767px) {
      max-width: none;
    }
  }

  &__img {
    max-width: 550px;

    @media (max-width: 767px) {
      max-width: none;
    }
  }

  &-item {
    display: flex;
    gap: 16px;

    & + .dashboard-item {
      margin-top: 22px;
    }

    &__title {
      font-size: 16px;
      font-family: 'Unbounded', sans-serif;
      font-weight: 500;
      margin-bottom: 5px;
      letter-spacing: -0.4px;
    }

    &__text {
      font-size: 14px;
    }
  }
}
</style>
