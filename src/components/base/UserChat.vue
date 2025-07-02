<template>
  <v-container>
    <div class="chat-box" ref="chatBoxRef">
      <template v-if="userMessages.length">
        <div v-for="msg in userMessages" :class="{ 'text-right': msg.is_your }">
          <v-chip :color="msg.is_your ? 'blue' : 'grey'" class="ma-1" label>
            {{ msg.content }}
          </v-chip>
        </div>
      </template>
      <h2 v-else>Пока нет сообщений</h2>
    </div>

    <v-row class="mt-2" align="center">
      <v-col cols="10">
        <v-text-field v-model="newMessage" label="Ваше сообщение" @keyup.enter="sendMessage" />
      </v-col>
      <v-col cols="2">
        <v-btn @click="sendMessage" color="primary">Отправить</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { getChatQuery, getMessagesQuery, sendMessageQuery } from '@/api/chat.ts'

type Message = {
  id: number
  sender: 'you' | 'support'
  text: string
}
const roomId = ref<null | number>(null)
const chatBoxRef = ref<HTMLElement | null>(null)

const userMessages = ref<Message[]>([])

const newMessage = ref<string>('')

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBoxRef.value) {
      chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  try {
    console.log(newMessage.value)
    const newData = {
      chatRoomId: roomId.value,
      message: newMessage.value
    }
    await sendMessageQuery(newData)
    newMessage.value = ''
    await getMessages()
    scrollToBottom()
  } catch (err) {
    console.log(err)
  }
}

const getChat = async () => {
  try {
    const { data } = await getChatQuery()
    if (data.code === 200) {
      roomId.value = data.data.chat_room_id
      await getMessages()
    }
  } catch (error) {
    console.log(error)
  }
}

const getMessages = async () => {
  try {
    const { data } = await getMessagesQuery(roomId.value)
    if (data.code === 200) {
      userMessages.value = data.data.messages ?? []
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getChat()
})
</script>

<style scoped>
.chat-box {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 8px;
}
.text-right {
  text-align: right;
}
</style>
