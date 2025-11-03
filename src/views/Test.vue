<template>
  <v-container class="py-10">
    <h2 class="text-h5 mb-4">Результаты анализа</h2>

    <video ref="videoEl" controls :src="videoUrl" class="rounded-lg mb-4" width="100%"></video>

    <v-row>
      <v-col cols="12" md="6">
        <h3 class="text-h6">Лучшие моменты:</h3>
        <v-list>
          <v-list-item v-for="(item, i) in highlights" :key="i" @click="seekTo(item.start)">
            <v-list-item-title>
              🎬 {{ formatTime(item.start) }} – {{ formatTime(item.end) }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12" md="6">
        <h3 class="text-h6">Теги AI:</h3>
        <v-chip-group>
          <v-chip v-for="tag in tags" :key="tag" color="primary" variant="tonal">
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </v-container>
  <v-app
    class="bg-gradient-to-b from-grey-darken-4 via-deep-purple-darken-3 to-indigo-darken-3 text-white"
  >
    <!-- Hero Section -->
    <v-container class="py-16 text-center">
      <v-row align="center" justify="center">
        <v-col cols="12" md="8">
          <h1 class="text-h3 font-weight-bold mb-4">🎬 Делай нарезки. Зарабатывай на хайпе.</h1>
          <p class="text-subtitle-1 mb-6">
            Платформа, где стримеры и клипмейкеры создают вирусный контент вместе. Загружай —
            получай оплату — попадай в ТОП.
          </p>
          <v-btn color="pink-accent-2" class="ma-2" size="large" rounded>Начать как нарезчик</v-btn>
          <v-btn variant="outlined" class="ma-2" size="large" rounded>Для стримеров</v-btn>
          <div class="mt-6 d-flex justify-center flex-wrap text-grey-lighten-2">
            <div class="mx-3">🔥 <strong class="text-white">4 300</strong> видео</div>
            <div class="mx-3">👥 <strong class="text-white">200+</strong> нарезчиков</div>
            <div class="mx-3">🎮 <strong class="text-white">120</strong> стримеров</div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Top Creators -->
    <v-container class="py-12">
      <h2 class="text-h4 font-weight-bold mb-6 text-center">🏆 Топ нарезчиков месяца</h2>
      <v-row>
        <v-col v-for="creator in topCreators" :key="creator.id" cols="12" sm="6" md="4">
          <v-card class="pa-4 bg-grey-darken-3" rounded="xl">
            <v-avatar size="72" class="mb-3">
              <v-img :src="creator.avatar" />
            </v-avatar>
            <h3 class="text-h6 mb-2">{{ creator.name }}</h3>
            <p class="text-caption text-grey-lighten-2">{{ creator.stats }}</p>
          </v-card>
        </v-col>
      </v-row>
      <div class="text-center mt-8">
        <v-btn color="primary" rounded>Смотреть рейтинг полностью</v-btn>
      </div>
    </v-container>

    <!-- How it works -->
    <v-container class="py-12">
      <h2 class="text-h4 font-weight-bold mb-8 text-center">⚙️ Как это работает</h2>
      <v-row>
        <v-col v-for="(step, index) in steps" :key="index" cols="12" md="4">
          <v-card class="pa-6 text-center bg-grey-darken-3" rounded="xl">
            <v-icon size="48" color="pink-accent-2">{{ step.icon }}</v-icon>
            <h3 class="text-h6 mt-4 mb-2">{{ step.title }}</h3>
            <p class="text-body-2 text-grey-lighten-2">{{ step.text }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- AI Tools -->
    <v-container class="py-12 text-center">
      <h2 class="text-h4 font-weight-bold mb-6">
        🤖 Slicer AI — умные инструменты для клипмейкеров
      </h2>
      <v-row>
        <v-col v-for="(ai, i) in aiTools" :key="i" cols="12" md="4">
          <v-card class="pa-6 bg-grey-darken-3" rounded="xl">
            <v-icon size="48" color="light-blue-accent-2">{{ ai.icon }}</v-icon>
            <h3 class="text-h6 mt-4 mb-2">{{ ai.title }}</h3>
            <p class="text-body-2 text-grey-lighten-2">{{ ai.text }}</p>
          </v-card>
        </v-col>
      </v-row>
      <div class="mt-8">
        <v-btn color="light-blue-accent-2" size="large" rounded>Попробовать бесплатно</v-btn>
      </div>
    </v-container>

    <!-- Referral Program -->
    <v-container class="py-12 text-center">
      <h2 class="text-h4 font-weight-bold mb-4">💎 Реферальная программа</h2>
      <p class="text-subtitle-1 mb-6">
        Приводи друзей и зарабатывай вместе! Получай <strong>10%</strong> с их заработка первые 30
        дней.
      </p>
      <v-btn color="amber-accent-3" size="large" rounded>Получить ссылку</v-btn>
    </v-container>

    <!-- CTA Footer -->
    <v-container class="py-16 text-center">
      <h2 class="text-h4 mb-4">🚀 Начни сегодня — создавай и зарабатывай на клипах!</h2>
      <v-btn color="pink-accent-2" size="large" class="ma-2" rounded>Стать нарезчиком</v-btn>
      <v-btn color="primary" variant="outlined" size="large" class="ma-2" rounded
        >Подключить стримера</v-btn
      >
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const videoUrl = '/uploads/test.mp4' // пример
const videoEl = ref<HTMLVideoElement | null>(null)
const highlights = ref([
  { start: 12, end: 22 },
  { start: 80, end: 94 }
])
const tags = ref(['funny', 'moment', 'stream'])

const seekTo = (time: number) => {
  if (videoEl.value) videoEl.value.currentTime = time
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface Creator {
  id: number
  name: string
  avatar: string
  stats: string
}

interface Step {
  icon: string
  title: string
  text: string
}

interface AiTool {
  icon: string
  title: string
  text: string
}

const topCreators = ref<Creator[]>([
  {
    id: 1,
    name: '@CutMaster',
    avatar: 'https://i.pravatar.cc/150?img=3',
    stats: '32 видео • 18 240₽'
  },
  {
    id: 2,
    name: '@MiraClip',
    avatar: 'https://i.pravatar.cc/150?img=5',
    stats: '27 видео • 15 100₽'
  },
  {
    id: 3,
    name: '@VideoNinja',
    avatar: 'https://i.pravatar.cc/150?img=8',
    stats: '25 видео • 12 900₽'
  }
])

const steps = ref<Step[]>([
  {
    icon: 'mdi-upload',
    title: 'Загрузи нарезку',
    text: 'Загрузи видео со стрима прямо в платформу.'
  },
  {
    icon: 'mdi-check-decagram',
    title: 'Одобрение модератора',
    text: 'Видео проходит быструю проверку админом.'
  },
  {
    icon: 'mdi-cash-multiple',
    title: 'Получай оплату',
    text: 'Одобрено? Получай оплату и рейтинг!'
  }
])

const aiTools = ref<AiTool[]>([
  {
    icon: 'mdi-brain',
    title: 'Анализ эмоций',
    text: 'Slicer AI находит самые эмоциональные моменты в стриме.'
  },
  {
    icon: 'mdi-timeline-text-outline',
    title: 'Авто таймкоды',
    text: 'Искусственный интеллект формирует таймкоды и ключевые сцены.'
  },
  {
    icon: 'mdi-rocket-launch',
    title: 'Прогноз вирусности',
    text: 'AI подсказывает, какие клипы могут стать вирусными.'
  }
])
</script>

<style scoped>
.bg-gradient-to-b {
  background: linear-gradient(to bottom, #1e1b4b, #4c1d95, #312e81);
}
</style>
