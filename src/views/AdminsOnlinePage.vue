<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title> Админы </v-card-title>

      <v-divider />

      <v-list>
        <v-list-item v-for="admin in admins" :key="admin.id">
          <template #prepend>
            <v-avatar size="40">
              <img :src="admin.avatar" :alt="admin.name" />
            </v-avatar>
          </template>

          <v-list-item-title>{{ admin.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ admin.role }}</v-list-item-subtitle>

          <template #append>
            <v-chip :color="admin.online ? 'green' : 'grey'" size="small" text-color="white">
              {{ admin.online ? 'Онлайн' : 'Оффлайн' }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Admin = {
  id: number
  name: string
  role: string
  online: boolean
  avatar?: string
}

const admins = ref<Admin[]>([
  {
    id: 1,
    name: 'Иван Петров',
    role: 'Главный админ',
    online: true,
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
  },
  {
    id: 2,
    name: 'Анна Смирнова',
    role: 'Админ',
    online: false,
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg'
  },
  {
    id: 3,
    name: 'Сергей Иванов',
    role: 'Админ',
    online: true,
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg'
  }
])
</script>
