<template>
  <section id="how" v-reveal class="how">
    <v-container class="container">
      <h2 class="how__title">Как это работает</h2>
      <p class="how__subtitle">Всего 3 простых шага до первой выплаты</p>

      <div class="how-steps">
        <v-card class="how-step">
          <div class="how-step__number">1</div>
          <h3 class="how-step__title">Опубликуй видео</h3>
          <p class="how-step__text">
            Загрузи нарезку в TikTok, YouTube Shorts или Instagram Reels.
          </p>
        </v-card>

        <v-card class="how-step">
          <div class="how-step__number">2</div>
          <h3 class="how-step__title">Отправь заявку</h3>
          <p class="how-step__text">Добавь ссылку на видео и укажи количество просмотров.</p>
        </v-card>

        <v-card class="how-step">
          <div class="how-step__number">3</div>
          <h3 class="how-step__title">Дождись проверки</h3>
          <p class="how-step__text">Мы аккуратно и прозрачно проверим твою нарезку и заявку.</p>
        </v-card>
      </div>
    </v-container>
  </section>
</template>

<style scoped lang="scss">
.how {
  padding-top: 103px;
  padding-bottom: 104px;

  @media (max-width: 767px) {
    padding-top: 118px;
    padding-bottom: 118px;
  }

  .container {
    @media (max-width: 767px) {
      padding: 0;
    }
  }

  &__title {
    text-align: center;
    margin-bottom: 10px;
  }

  &__subtitle {
    text-align: center;
    margin-bottom: 30px;
  }
}

.how-steps {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 767px) {
    gap: 6px;
  }
}

.how-step {
  width: 360px;
  background: rgba(246, 241, 249, 1);
  padding: 20px;
  border-radius: 24px;
  box-shadow: none;

  &__number {
    font-family: 'Unbounded', sans-serif;
    font-weight: 500;
    color: #fff;
    background: rgba(17, 17, 17, 1);
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    margin-bottom: 57px;
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
</style>
