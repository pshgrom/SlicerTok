<template>
  <section id="why" v-reveal class="why">
    <v-container class="container">
      <h2 class="why__title">Почему SlicerTok</h2>
      <p class="why__subtitle">Платформа для честного взаимодействия блогеров и клипмейкеров</p>

      <div class="why__grid">
        <v-card class="why-item">
          <div class="why-item__icon">
            <SvgIcon name="why-1" />
          </div>
          <h3 class="why-item__title">Поддержка популярных платформ</h3>
          <p class="why-item__text">
            Работаем с TikTok, YouTube Shorts и Instagram Reels — загружай клип туда, где тебе
            удобно.
          </p>
        </v-card>

        <v-card class="why-item">
          <div class="why-item__icon">
            <SvgIcon name="why-2" />
          </div>
          <h3 class="why-item__title">Быстрая проверка заявок</h3>
          <p class="why-item__text">
            Прозрачная и аккуратная модерация, без бюрократии и лишних шагов.
          </p>
        </v-card>

        <v-card class="why-item">
          <div class="why-item__icon">
            <SvgIcon name="why-3" />
          </div>
          <h3 class="why-item__title">Работа с топовыми блогерами</h3>
          <p class="why-item__text">
            Создавай контент для популярных стримеров и блогеров. Получай больше внимания,
            просмотров и расширяй свою аудиторию
          </p>
        </v-card>

        <v-card class="why-item">
          <div class="why-item__icon">
            <SvgIcon name="why-4" />
          </div>
          <h3 class="why-item__title">Честное взаимодействие</h3>
          <p class="why-item__text">
            Блогер задаёт условия сотрудничества, а платформа помогает всё организовать: проверку,
            прозрачность и подтверждение выплат.
          </p>
        </v-card>
      </div>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/base/SvgIcon.vue'
</script>

<style scoped lang="scss">
.why {
  background-image: url('@/static/img/why-bg.png');
  background-size: cover;
  padding-top: 84px;
  padding-bottom: 81px;
  border-radius: 24px;

  @media (max-width: 767px) {
    padding-top: 28px;
    padding-bottom: 0;
  }

  &__title {
    text-align: center;
    margin-bottom: 10px;
  }

  &__subtitle {
    text-align: center;
    margin-bottom: 62px;

    @media (max-width: 767px) {
      margin-bottom: 35px;
    }
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;

    @media (max-width: 767px) {
      gap: 8px;
    }
  }

  &-item {
    width: 550px;
    height: 203px;
    padding: 20px;
    border-radius: 24px;
    background: #fff;
    box-shadow: none;

    @media (max-width: 767px) {
      height: auto;
    }

    &__icon {
      margin-bottom: 40px;
    }

    &__title {
      font-family: 'Unbounded', sans-serif;
      font-weight: 500;
      font-size: 16px;
      margin-bottom: 9px;
    }

    &__text {
      font-size: 14px;
    }
  }
}
</style>
