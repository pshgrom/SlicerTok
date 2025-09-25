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
          <span>{{ currentRoom?.name || 'Чат' }}</span>
        </div>

        <div ref="chatBoxRef" class="chat-messages" @scroll="onScroll">
          <div v-if="loadingMessages" class="chat-spinner">
            <v-progress-circular indeterminate color="primary" size="40" />
          </div>

          <transition-group v-else-if="currentMessages.length" name="fade-slide" tag="div">
            <div
              v-for="msg in currentMessages"
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

        <div
          v-if="newMessageCount > 0"
          class="new-message-indicator"
          @click="scrollToBottomAnimated"
        >
          {{ newMessageCount }} новых сообщений
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getChatsSupportQuery, getMessagesQuery, sendMessageQuery } from '@/api/chat.ts'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { useChatSocketStore } from '@/stores/ChatSocket'
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

const messageIds = ref<Record<number, Set<string>>>({})
const rooms = ref<Room[]>([])
const roomId = ref<number | null>(null)
const messages = ref<Record<number, ChatMessage[]>>({})
const newMessage = ref('')
const newMessageCount = ref(0)
const chatBoxRef = ref<HTMLElement | null>(null)
const unreadCounts = ref<Record<number, number>>({})
const loadingMessages = ref(true)
const userScrolledUp = ref(false)

const userId = computed(() => supportStore.supportInfo?.id)
const currentRoom = computed(() => rooms.value.find((r) => r.id === roomId.value) || null)
const currentMessages = computed(() => (roomId.value ? messages.value[roomId.value] || [] : []))

const getTime = (time: string) => {
  const date = new Date(time)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const getMessageSet = (rId: number) => {
  if (!messageIds.value[rId]) messageIds.value[rId] = new Set()
  return messageIds.value[rId]
}

const getRoomMessages = (rId: number) => {
  if (!messages.value[rId]) messages.value[rId] = []
  return messages.value[rId]
}

function addMessage(msg: ChatMessage, targetRoomId: number) {
  const ids = getMessageSet(targetRoomId)
  const roomMsgs = getRoomMessages(targetRoomId)

  if (!msg.id) msg.id = Date.now() + Math.random()
  if (ids.has(msg.id)) return

  ids.add(msg.id)
  roomMsgs.push(msg)
}

function isAtBottom() {
  const el = chatBoxRef.value
  if (!el) return false
  return el.scrollHeight - el.scrollTop <= el.clientHeight + 50
}

function scrollToBottomAnimated() {
  const el = chatBoxRef.value
  if (!el) return

  const target = el.scrollHeight
  const duration = 200
  const start = el.scrollTop
  const startTime = performance.now()

  function animate(time: number) {
    const elapsed = time - startTime
    const progress = Math.min(elapsed / duration, 1)
    el.scrollTop = start + (target - start) * progress
    if (progress < 1) requestAnimationFrame(animate)
    else {
      newMessageCount.value = 0
      userScrolledUp.value = false
    }
  }

  requestAnimationFrame(animate)
}

const scrollToBottom = () =>
  nextTick(() => chatBoxRef.value?.scrollTo(0, chatBoxRef.value.scrollHeight))

function onScroll() {
  const el = chatBoxRef.value
  if (!el) return
  userScrolledUp.value = el.scrollHeight - el.scrollTop > el.clientHeight + 50
}

async function getMessages() {
  if (!roomId.value) return
  loadingMessages.value = true
  try {
    const { data } = await getMessagesQuery(roomId.value)
    if (data.code === 200) {
      for (const m of data.data.messages ?? []) {
        addMessage({ ...m, is_your: m.user?.id === userId.value }, roomId.value)
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingMessages.value = false
    scrollToBottom()
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || !roomId.value) return

  const msg: ChatMessage = {
    id: Date.now() + Math.random(),
    content: newMessage.value,
    created_at: new Date().toISOString(),
    is_your: true,
    user: { id: userId.value, name: 'Вы' }
  }

  addMessage(msg, roomId.value)
  if (!userScrolledUp.value) scrollToBottomAnimated()
  else newMessageCount.value++

  try {
    await sendMessageQuery({ chatRoomId: roomId.value, message: newMessage.value })
  } catch (err) {
    console.error(err)
  } finally {
    newMessage.value = ''
  }
}

const selectRoom = async (id: number) => {
  if (roomId.value === id) return
  roomId.value = id
  unreadCounts.value[id] = 0
  chatStore.subscribeChannel(`chat.${id}`)
  await getMessages()
  newMessageCount.value = 0
  userScrolledUp.value = false
  await router.push({ name: 'SupportChat', params: { id } })
}

onMounted(async () => {
  await supportStore.getSupportInfo()
  const savedUnread = localStorage.getItem('unreadCounts')
  if (savedUnread) unreadCounts.value = JSON.parse(savedUnread)

  chatStore.connect()
  const { data } = await getChatsSupportQuery()
  if (data.code === 200) {
    rooms.value = data.data.chats.map((chat) => ({
      id: chat.chat_room_id,
      name: chat.chat_room_name
    }))
    rooms.value.forEach((room) => chatStore.subscribeChannel(`chat.${room.id}`))

    if (rooms.value.length) {
      const targetId = Number(route.params.id) || rooms.value[0].id
      await selectRoom(targetId)
    }
  }
})

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId && rooms.value.length) await selectRoom(rooms.value[0].id)
    else if (newId) await selectRoom(Number(newId))
  }
)

watch(
  unreadCounts,
  (newCounts) => localStorage.setItem('unreadCounts', JSON.stringify(newCounts)),
  { deep: true }
)

watch(
  () => chatStore.messages[chatStore.messages.length - 1],
  (msg) => {
    if (!msg || msg.event !== 'MessageSent') return

    const roomIdFromMsg = Number(msg.channel?.split('.')[1])
    if (!roomIdFromMsg) return

    const parsed = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
    if (parsed.senderId === userId.value) return

    const newMsg: ChatMessage = {
      id: parsed.id ?? Date.now() + Math.random(),
      content: parsed.content,
      created_at: parsed.timestamp,
      is_your: false,
      user: { id: parsed.senderId, name: parsed.senderName ?? 'Пользователь' }
    }

    addMessage(newMsg, roomIdFromMsg)

    if (roomIdFromMsg !== roomId.value) {
      unreadCounts.value[roomIdFromMsg] = (unreadCounts.value[roomIdFromMsg] || 0) + 1
    } else {
      if (!userScrolledUp.value) scrollToBottomAnimated()
      else newMessageCount.value++
    }
  }
)
</script>

<style scoped lang="scss">
.chat-wrapper {
  display: flex;
  justify-content: center;
  max-height: 83vh;

  @media (max-width: 767px) {
    flex-direction: column;
    max-height: 100vh;
  }
}

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
    max-height: 602px;
    overflow-y: scroll;
    padding-top: 0;

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
      font-weight: 500;
    }

    &__top {
      padding: 0 20px;
      position: sticky;
      top: 0;
      height: 60px;
      display: flex;
      align-items: center;
      z-index: 1;
      background: #fff;

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

  &__actions {
    display: flex;
    align-items: center;
    padding: 20px;
    position: relative;

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
    font-weight: 400;
    font-size: 14px;
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

.new-message-indicator {
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: rgb(169, 55, 244);
  color: #fff;
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* анимация сообщений */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
