<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <button @click="goBack">Вернуться обратно</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  .content {
    text-align: center;
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

    h1 {
      font-size: 6rem;
      margin-bottom: 0.5rem;
      color: #0070ba;
    }

    p {
      font-size: 1.25rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    button {
      background-color: #0070ba;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #1d3557;
      }
    }
  }
}
</style>
