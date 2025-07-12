<template>
  <div class="chat-wrapper">
    <div class="chat-list">
      <div class="chat-list__top">
        <div class="chat-list__title">Чаты</div>
      </div>
      <div
        v-for="room in rooms"
        :key="room.id"
        class="chat-list-item"
        :class="{ 'chat-list-item_active': roomId === room.id }"
        @click="selectRoom(room.id)"
      >
        <div class="chat-list-item__title">
          {{ room.name }}
        </div>
      </div>
    </div>
    <div class="chat">
      <div class="chat-box">
        <div class="chat__title">
          <span>Чат</span>
        </div>
        <div v-if="messages.length" ref="chatBoxRef" class="chat-messages">
          <div
            v-for="msg in messages"
            :key="msg.created_at"
            class="chat-messages-item"
            :class="{ 'chat-messages-item_your': msg.is_your }"
          >
            <div class="chat-messages-item__role">
              {{ msg.is_your ? 'Поддержка' : 'Юзер' }}
            </div>
            <div class="chat-messages-item__msg">{{ msg.content }}</div>
            <div class="chat-messages-item__time">{{ getTime(msg.created_at) }}</div>
          </div>
        </div>
        <h2 v-else>Пока нет сообщений</h2>
      </div>
      <div class="chat__actions">
        <VCustomInput
          v-model="newMessage"
          :hide-details="true"
          autofocus
          label="Введите текст"
          class="mr-1"
          @keyup.enter="sendMessage"
        />
        <SvgIcon class="chat__actions-send" name="send" @click="sendMessage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { getChatsSupportQuery, getMessagesQuery, sendMessageQuery } from '@/api/chat.ts'
import SvgIcon from '@/components/base/SvgIcon.vue'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { useChat } from '@/composables/useChat.ts'
// import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'

type Room = { id: number; name: string }

// const { connectSocket, joinRoom, sendMessage, messages } = useChat()
const { connectSocket } = useChat()
const rooms = ref<Room[]>([])
// const { isMobile } = useDeviceDetection()
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

const getTime = (time: string) => {
  const date = new Date(time)

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
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
  connectSocket()
  getChatsSupport()
})
</script>

<style scoped lang="scss">
.chat {
  background: #fff;
  box-shadow: none;
  width: 636px;
  border-radius: 16px;

  @media (max-width: 767px) {
    width: 100%;
  }

  &-list {
    background: #fff;
    width: 312px;
    border-radius: 16px;
    margin-right: 12px;
    padding: 20px 4px;

    @media (max-width: 767px) {
      width: 100%;
      margin: 0;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }

    &__title {
      font-size: 18px;
      font-weight: 500;
      color: rgba(17, 17, 17, 1);
      font-weight: 400;
      margin-bottom: 10px;
    }

    &__top {
      padding: 0 20px;

      @media (max-width: 767px) {
        display: none;
      }
    }

    &-item {
      height: 72px;
      width: 304px;
      border-radius: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 16px;
      transition: background-color 0.2s ease-in;
      margin-bottom: 2px;

      &_active {
        background: rgba(242, 246, 254, 1);
        pointer-events: none;
      }

      &:hover {
        background: rgba(242, 246, 254, 1);
      }
    }
  }

  &-wrapper {
    display: flex;
    justify-content: center;

    @media (max-width: 767px) {
      flex-direction: column;
    }
  }

  h2 {
    padding: 20px;
  }

  &_mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 90vh;
  }

  &__actions {
    display: flex;
    align-items: center;
    padding: 20px;

    &-send {
      cursor: pointer;
      transition: opacity 0.15s ease-in;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  &__title {
    display: flex;
    justify-content: space-between;
    height: 64px;
    border-bottom: 1px solid rgba(229, 236, 253, 1);
    align-items: center;
    padding: 0 20px;
    color: rgba(17, 17, 17, 1);
    font-weight: 500;
    font-size: 18px;
    font-weight: 400;
  }

  &-messages {
    max-height: 450px;
    min-height: 450px;
    overflow-y: scroll;
    padding: 20px;
    display: flex;
    flex-direction: column;

    &-item {
      max-width: 420px;
      width: 100%;
      background: rgba(179, 246, 255, 1);
      padding: 16px;
      border-radius: 16px;
      border-top-left-radius: 4px;
      border-top-right-radius: 16px;
      position: relative;

      &:first-child {
        margin-top: 10px;
      }

      &__msg {
        color: rgba(17, 17, 17, 1);
        font-size: 14px;
        line-height: 140%;
        margin-bottom: 10px;
        font-weight: 400;
      }

      &__role {
        color: rgba(0, 0, 0, 1);
        font-weight: 500;
        font-size: 12px;
        font-weight: 400;
        position: absolute;
        left: 0;
        top: -22px;
      }

      &__time {
        font-weight: 500;
        font-size: 12px;
        color: rgba(143, 150, 165, 1);
        text-align: right;
      }

      &_your {
        background: rgba(34, 93, 255, 1);
        align-self: flex-end;
        border-top-right-radius: 4px;
        border-top-left-radius: 16px;

        .chat-messages-item__msg {
          color: rgba(255, 255, 255, 1);
        }

        .chat-messages-item__time {
          color: rgba(211, 219, 237, 1);
          text-align: left;
        }

        .chat-messages-item__role {
          left: auto;
          right: 0;
        }
      }

      & + .chat-messages-item {
        margin-top: 40px;
      }
    }
  }
}
</style>
