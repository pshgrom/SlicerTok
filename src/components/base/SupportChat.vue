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
          <span v-if="unreadCounts[room.id] > 0" class="chat-list-item__badge">
            {{ unreadCounts[room.id] }}
          </span>
        </div>
      </div>
    </div>
    <div class="chat">
      <div class="chat-box">
        <div class="chat__title">
          <span>Чат</span>
        </div>
        <div ref="chatBoxRef" class="chat-messages">
          <template v-if="loadingMessages">
            <div class="chat-spinner">
              <v-progress-circular indeterminate color="primary" size="40" />
            </div>
          </template>

          <template v-else-if="messages.length">
            <transition-group name="fade-slide">
              <div
                v-for="msg in messages"
                :key="msg.id || msg.created_at + msg.content"
                class="chat-messages-item"
                :class="{ 'chat-messages-item_your': msg.is_your }"
              >
                <div class="chat-messages-item__role">
                  {{ msg?.user?.name ?? '' }}
                </div>
                <div class="chat-messages-item__msg">{{ msg.content }}</div>
                <div class="chat-messages-item__time">{{ getTime(msg.created_at) }}</div>
              </div>
            </transition-group>
          </template>
          <h2 v-else>Пока нет сообщений</h2>
        </div>
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
import { ref, onMounted, nextTick, watch } from 'vue'
import { getChatsSupportQuery, getMessagesQuery, sendMessageQuery } from '@/api/chat.ts'
import { useChatSocketStore } from '@/stores/chatSocket'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { useRoute, useRouter } from 'vue-router'

const chatStore = useChatSocketStore()

type Room = { id: number; name: string }
const rooms = ref<Room[]>([])
const newMessageCount = ref(0)
const roomId = ref<number | null>(null)
const messages = ref<any[]>([])
const newMessage = ref('')
const chatBoxRef = ref<HTMLElement | null>(null)
const unreadCounts = ref<Record<number, number>>({})
const loadingMessages = ref(true)
const route = useRoute()
const router = useRouter()

const scrollToBottom = () => {
  nextTick(() => {
    chatBoxRef.value?.scrollTo(0, chatBoxRef.value.scrollHeight)
  })
}

const isAtBottom = () => {
  if (!chatBoxRef.value) return false
  const el = chatBoxRef.value
  return el.scrollHeight - el.scrollTop <= el.clientHeight + 50
}

const getTime = (time: string) => {
  const date = new Date(time)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const getMessages = async () => {
  loadingMessages.value = true
  try {
    const { data } = await getMessagesQuery(roomId.value)
    if (data.code === 200) {
      messages.value = data.data.messages ?? []
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingMessages.value = false
  }
}

function sendMessage() {
  if (!newMessage.value.trim() || !roomId.value) return
  messages.value.push({
    content: newMessage.value,
    created_at: new Date().toISOString(),
    is_your: true
  })
  sendMessageRest()
}

const sendMessageRest = async () => {
  if (!newMessage.value.trim()) return
  try {
    const newData = {
      chatRoomId: roomId.value,
      message: newMessage.value
    }
    await sendMessageQuery(newData)
    newMessage.value = ''
    // await getMessages()
    scrollToBottom()
  } catch (err) {
    console.log(err)
  }
}

const selectRoom = async (id: number) => {
  roomId.value = +id
  messages.value = []
  loadingMessages.value = true
  unreadCounts.value[id] = 0
  const channel = `chat.${id}`
  chatStore.subscribeChannel(channel)
  await getMessages()
  scrollToBottom()
  loadingMessages.value = false
}

onMounted(async () => {
  const savedUnread = localStorage.getItem('unreadCounts')
  if (savedUnread) {
    unreadCounts.value = JSON.parse(savedUnread)
  }

  chatStore.connect()

  const { data } = await getChatsSupportQuery()
  if (data.code === 200) {
    rooms.value = data.data.chats.map((c, i) => ({ id: c.chat_room_id, name: `Комната ${i + 1}` }))

    rooms.value.forEach((room) => {
      const channel = `chat.${room.id}`
      chatStore.subscribeChannel(channel)
    })

    if (rooms.value.length) {
      const id = route.query?.id
      id ? await selectRoom(id) : await selectRoom(rooms.value[0].id)
      if (route.query.id) {
        await router.replace({
          query: { ...route.query, id: undefined }
        })
      }
    }
  }
})

watch(
  unreadCounts,
  (newCounts) => {
    localStorage.setItem('unreadCounts', JSON.stringify(newCounts))
  },
  { deep: true }
)

watch(
  () => chatStore.messages[chatStore.messages.length - 1],
  (msg) => {
    if (!msg || msg.event !== 'MessageSent') return

    const roomIdFromMsg = Number(msg.channel?.split('.')[1])
    if (!roomIdFromMsg) return

    const parsed = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
    if (parsed.senderId === 7) return

    if (roomIdFromMsg !== roomId.value) {
      unreadCounts.value[roomIdFromMsg] = (unreadCounts.value[roomIdFromMsg] || 0) + 1
      return
    }
    messages.value.push({
      content: parsed.content,
      created_at: parsed.timestamp,
      is_your: false
    })
    if (isAtBottom()) {
      scrollToBottom()
    } else {
      newMessageCount.value++
    }
  }
)
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
    min-width: 312px;
    border-radius: 16px;
    margin-right: 12px;
    padding: 20px 4px;
    max-height: 450px;
    overflow-y: scroll;

    @media (max-width: 767px) {
      width: 100%;
      margin: 0;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }

    &__title {
      font-size: 18px;
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
      position: relative;

      &__badge {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(34, 93, 255, 1);
        color: #fff;
        font-size: 12px;
        font-weight: 400;
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
      }

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
    max-height: 83vh;

    @media (max-width: 767px) {
      flex-direction: column;
      max-height: 100vh;
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

.chat-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 450px;
}
</style>
