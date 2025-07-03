<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-list>
          <h2>Чаты</h2>
          <v-list-item
            v-for="room in rooms"
            :key="room.id"
            :value="room.id"
            @click="selectRoom(room.id)"
            :active="room.id === roomId"
          >
            <v-list-item-title>{{ room.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="9">
        <div
          class="chat-box"
          ref="chatBoxRef"
          style="height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 1rem"
        >
          <div v-for="msg in messages" :class="{ 'text-right': msg.is_your }">
            <v-chip :color="msg.is_your ? 'blue' : 'grey'" class="ma-1" label>
              {{ msg.content }}
            </v-chip>
          </div>
        </div>

        <v-row class="mt-2" align="center">
          <v-col cols="10">
            <v-text-field
              v-model="newMessage"
              label="Введите сообщение"
              @keyup.enter="sendMessage"
            />
          </v-col>
          <v-col cols="2">
            <v-btn @click="sendMessage" color="primary">Отправить</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { getChatsSupportQuery, getMessagesQuery, sendMessageQuery } from '@/api/chat.ts'

type Room = { id: number; name: string }
const rooms = ref<Room[]>([])
const roomId = ref<null | number>(null)

const chatBoxRef = ref<HTMLElement | null>(null)

const newMessage = ref<string>('')

const messages = ref([])

const selectRoom = async (id: number) => {
  roomId.value = id
  await getMessages()
  scrollToBottom()
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  try {
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

const getMessages = async () => {
  try {
    const { data } = await getMessagesQuery(roomId.value)
    if (data.code === 200) {
      messages.value = data.data.messages ?? []
    }
  } catch (error) {
    console.log(error)
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBoxRef.value) {
      chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
    }
  })
}

const getChatsSupport = async () => {
  try {
    const { data } = await getChatsSupportQuery()
    if (data.code === 200) {
      rooms.value = data.data.chats.map((item, index) => {
        return {
          name: `Комната ${index + 1}`,
          id: item.chat_room_id
        }
      })
      roomId.value = rooms.value[0].id
      await getMessages()
      scrollToBottom()
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getChatsSupport()
})
</script>

<style scoped>
.chat-box {
  background-color: #f9f9f9;
  border-radius: 8px;
}
.text-right {
  text-align: right;
}
</style>
