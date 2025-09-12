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
          <div v-if="loadingMessages" class="chat-spinner">
            <v-progress-circular indeterminate color="primary" size="40" />
          </div>

          <transition-group v-else-if="messages.length" name="fade-slide">
            <div
              v-for="msg in messages"
              :key="msg.id"
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

          <h3 v-else class="chat-messages__empty">Пока нет сообщений</h3>
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
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getChatsSupportQuery, getMessagesQuery, sendMessageQuery } from '@/api/chat.ts'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { useChatSocketStore } from '@/stores/chatSocket'
import { useSupport } from '@/stores/Support.ts'

const chatStore = useChatSocketStore()
const supportStore = useSupport()
const route = useRoute()
const router = useRouter()

type Room = { id: number; name: string }
type ChatMessage = {
  id: string
  content: string
  created_at: string
  is_your: boolean
  user?: { id: number; name: string }
}

const rooms = ref<Room[]>([])
const roomId = ref<number | null>(null)
const messages = ref<ChatMessage[]>([])
const messageIds = new Set<string>() // контроль дубликатов
const newMessage = ref('')
const newMessageCount = ref(0)
const chatBoxRef = ref<HTMLElement | null>(null)
const unreadCounts = ref<Record<number, number>>({})
const loadingMessages = ref(true)

const userId = computed(() => supportStore.supportInfo?.id)

const scrollToBottom = () =>
  nextTick(() => chatBoxRef.value?.scrollTo(0, chatBoxRef.value.scrollHeight))

const isAtBottom = () => {
  const el = chatBoxRef.value
  if (!el) return false
  return el.scrollHeight - el.scrollTop <= el.clientHeight + 50
}

const getTime = (time: string) => {
  const date = new Date(time)
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
}

/** безопасный пуш сообщений */
function addMessage(msg: ChatMessage) {
  if (!msg.id) {
    msg.id = msg.created_at + msg.content // fallback ID
  }
  if (messageIds.has(msg.id)) return
  messageIds.add(msg.id)
  messages.value.push(msg)
}

/** Загрузка сообщений */
const getMessages = async () => {
  if (!roomId.value) return
  loadingMessages.value = true
  try {
    const { data } = await getMessagesQuery(roomId.value)
    if (data.code === 200) {
      messages.value = []
      messageIds.clear()
      for (const m of data.data.messages ?? []) {
        addMessage({ ...m, is_your: m.user?.id === userId.value })
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingMessages.value = false
    scrollToBottom()
  }
}

/** Отправка сообщения */
async function sendMessage() {
  if (!newMessage.value.trim() || !roomId.value) return

  const msg: ChatMessage = {
    id: Date.now().toString(),
    content: newMessage.value,
    created_at: new Date().toISOString(),
    is_your: true,
    user: { id: userId.value, name: 'Вы' }
  }
  addMessage(msg)
  scrollToBottom()

  try {
    await sendMessageQuery({ chatRoomId: roomId.value, message: newMessage.value })
  } catch (err) {
    console.error(err)
  } finally {
    newMessage.value = ''
  }
}

/** Выбор комнаты */
const selectRoom = async (id: number) => {
  roomId.value = id
  unreadCounts.value[id] = 0
  chatStore.subscribeChannel(`chat.${id}`)
  await getMessages()
}

onMounted(async () => {
  await supportStore.getSupportInfo()

  // восстановить непрочитанные
  const savedUnread = localStorage.getItem('unreadCounts')
  if (savedUnread) unreadCounts.value = JSON.parse(savedUnread)

  chatStore.connect()

  const { data } = await getChatsSupportQuery()
  if (data.code === 200) {
    rooms.value = data.data.chats.map((c, i) => ({
      id: c.chat_room_id,
      name: `Комната ${i + 1}`
    }))

    rooms.value.forEach((room) => chatStore.subscribeChannel(`chat.${room.id}`))

    if (rooms.value.length) {
      const id = route.query?.id
      id ? await selectRoom(+id) : await selectRoom(rooms.value[0].id)
      if (route.query.id) {
        await router.replace({ query: { ...route.query, id: undefined } })
      }
    }
  }
})

/** Сохраняем непрочитанные в localStorage */
watch(
  unreadCounts,
  (newCounts) => {
    localStorage.setItem('unreadCounts', JSON.stringify(newCounts))
  },
  { deep: true }
)

/** Новые сообщения через сокет */
watch(
  () => chatStore.messages[chatStore.messages.length - 1],
  (msg) => {
    if (!msg || msg.event !== 'MessageSent') return

    const roomIdFromMsg = Number(msg.channel?.split('.')[1])
    if (!roomIdFromMsg) return

    const parsed = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
    if (parsed.senderId === userId.value) return

    const newMsg: ChatMessage = {
      id: parsed.id ?? parsed.timestamp + parsed.content,
      content: parsed.content,
      created_at: parsed.timestamp,
      is_your: false,
      user: { id: parsed.senderId, name: parsed.senderName ?? 'Пользователь' }
    }

    if (roomIdFromMsg !== roomId.value) {
      unreadCounts.value[roomIdFromMsg] = (unreadCounts.value[roomIdFromMsg] || 0) + 1
    } else {
      addMessage(newMsg)
      if (isAtBottom()) scrollToBottom()
      else newMessageCount.value++
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
        background: rgb(169, 55, 244);
        color: #fff;
        font-size: 12px;
        font-weight: 400;
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
      }

      &__title {
        white-space: nowrap;
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

    &__empty {
      font-size: 16px;
    }

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
        background: rgb(169, 55, 244);
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
