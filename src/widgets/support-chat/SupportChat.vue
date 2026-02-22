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
          <span @click="goToProfile">{{ currentRoom?.name || 'Чат' }}</span>
        </div>

        <div ref="chatBoxRef" class="chat-messages" @scroll="onScroll">
          <div v-if="loadingMessages" class="chat-spinner">
            <v-progress-circular color="rgba(169, 55, 244, 1)" indeterminate size="40" />
          </div>

          <transition-group v-else-if="currentMessages.length" name="fade-slide">
            <div
              v-for="msg in currentMessages"
              :key="msg.id"
              class="chat-messages-item"
              :class="{
                'chat-messages-item_your': msg.is_your,
                'chat-messages-item_unread': !msg.is_your && !msg.is_read
              }"
              :data-id="msg.id"
            >
              <div class="chat-messages-item__role">
                {{ msg?.user?.name ?? '' }}
              </div>
              <div class="chat-messages-item__msg">{{ msg.content }}</div>
              <div class="chat-messages-item__time">
                {{ getTime(msg.created_at) }}
              </div>
            </div>
          </transition-group>

          <h3 v-else class="chat-messages__empty">Пока нет сообщений</h3>
        </div>
      </div>

      <v-form ref="formRef" class="chat__actions" @submit.prevent>
        <VCustomInput
          v-model.trim="newMessage"
          autofocus
          label="Введите текст"
          class="mr-1"
          required
          :rules="[requiredRules.maxLength]"
          @input="removeEmoji"
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
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  getChatsSupportQuery,
  getMessagesQuery,
  markMessagesAsReadQuery,
  sendMessageQuery,
  useChatSocketStore
} from '@/entities/chat'
import { useSupport } from '@/entities/support'
import type { ChatMessage, Room } from '@/shared/config/types/chat'
import { debounce, requiredRules } from '@/shared/lib'
import VCustomInput from '@/shared/ui/VCustomInput.vue'

const chatStore = useChatSocketStore()
const supportStore = useSupport()
const route = useRoute()
const dateFrom = ref(undefined)
const router = useRouter()

const formRef = ref(null)
const messageIds = ref<Record<number, Set<string | number>>>({})
const rooms = ref<Room[]>([])
const roomId = ref<number | null>(null)
const messages = ref<Record<number, ChatMessage[]>>({})
const newMessage = ref('')
const newMessageCount = ref(0)
const chatBoxRef = ref<HTMLElement | null>(null)
const unreadCounts = ref<Record<number, number>>({})
const loadingMessages = ref(false)
const userScrolledUp = ref(false)
const initialScrollDone = ref(false)
const currentTransition = ref(null)

const page = ref<Record<number, number>>({})
const pageSize = 20
const hasMore = ref<Record<number, boolean>>({})

const userId = computed(() => supportStore.supportInfo?.id)
const currentRoom = computed(() => rooms.value.find((r) => r.id === roomId.value) || null)
const currentMessages = computed(() => (roomId.value ? messages.value[roomId.value] || [] : []))

const getTime = (time: string) => {
  const date = new Date(time)
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
}

const getMessageSet = (rId: number) => {
  if (!messageIds.value[rId]) messageIds.value[rId] = new Set()
  return messageIds.value[rId]
}
const getRoomMessages = (rId: number) => {
  if (!messages.value[rId]) messages.value[rId] = []
  return messages.value[rId]
}
const goToProfile = () => {
  const id = currentTransition.value
  if (id) {
    router.push({ name: 'User', params: { id } })
  }
}
const getPage = (rId: number) => {
  if (!page.value[rId]) page.value[rId] = 1
  return page.value[rId]
}
const getHasMore = (rId: number) => {
  if (hasMore.value[rId] === undefined) hasMore.value[rId] = true
  return hasMore.value[rId]
}

function addMessage(msg: ChatMessage, targetRoomId: number) {
  const ids = getMessageSet(targetRoomId)
  const roomMsgs = getRoomMessages(targetRoomId)
  if (!msg.id) msg.id = Date.now() + Math.random()
  if (ids.has(msg.id)) return
  ids.add(msg.id)
  roomMsgs.push(msg)
}

const removeEmoji = (e) => {
  const cleaned = e.target.value.replace(/[^a-zA-Zа-яА-Я0-9\s.,!?'"()\-:;@]/g, '')
  newMessage.value = cleaned
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
  nextTick(() => {
    if (chatBoxRef.value) {
      chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
    }
  })

// Проверяем, какие сообщения видимы в области прокрутки
function getVisibleMessages(container: HTMLElement): ChatMessage[] {
  const messagesEls = container.querySelectorAll('.chat-messages-item')
  const visible: ChatMessage[] = []
  const containerRect = container.getBoundingClientRect()

  messagesEls.forEach((el) => {
    const rect = el.getBoundingClientRect()
    const msgId = el.getAttribute('data-id')
    if (!msgId || !roomId.value) return

    const msg = messages.value[roomId.value]?.find((m) => String(m.id) === msgId)
    if (!msg || msg.is_your || msg.is_read) return

    const isVisible = rect.top >= containerRect.top + 10 && rect.bottom <= containerRect.bottom - 10
    if (isVisible) visible.push(msg)
  })

  return visible
}

async function onScroll() {
  const el = chatBoxRef.value
  if (!el || !roomId.value) return

  if (!initialScrollDone.value) {
    initialScrollDone.value = true
    return
  }

  userScrolledUp.value = el.scrollHeight - el.scrollTop > el.clientHeight + 50

  // --- Пометка видимых сообщений как прочитанных ---
  const visibleMessages = getVisibleMessages(el)
  if (visibleMessages.length) markVisibleMessagesAsRead(visibleMessages)

  // подгрузка старых сообщений
  if (el.scrollTop <= 100 && getHasMore(roomId.value) && !loadingMessages.value) {
    page.value[roomId.value] = getPage(roomId.value) + 1
    await getMessages(roomId.value, true)
  }
}

async function getMessages(rId: number, isLoadMore = false) {
  loadingMessages.value = true
  let oldScrollHeight = 0
  let oldScrollTop = 0
  if (isLoadMore && chatBoxRef.value) {
    oldScrollHeight = chatBoxRef.value.scrollHeight
    oldScrollTop = chatBoxRef.value.scrollTop
  }

  try {
    const dateVal = getPage(rId) === 1 ? undefined : dateFrom.value
    const { data } = await getMessagesQuery(rId, getPage(rId), dateVal)
    dateFrom.value = data?.date_from ?? undefined
    const newMsgs = data.data.reverse() ?? []

    if (isLoadMore) {
      messages.value[rId] = [
        ...newMsgs.map((m) => ({ ...m, is_your: m.user?.id === userId.value })),
        ...(messages.value[rId] || [])
      ]
    } else {
      messages.value[rId] = newMsgs.map((m) => ({ ...m, is_your: m.user?.id === userId.value }))
    }

    if (newMsgs.length < pageSize) {
      hasMore.value[rId] = false
    }
  } catch (error) {
    console.error(error)
  } finally {
    loadingMessages.value = false
  }

  if (isLoadMore && chatBoxRef.value) {
    await nextTick()
    const newScrollHeight = chatBoxRef.value.scrollHeight
    chatBoxRef.value.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight)
  } else if (!isLoadMore) {
    scrollToBottom()
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || !roomId.value) return
  const isValid = await formRef?.value?.validate()
  if (isValid.valid) {
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
      await sendMessageQuery({
        chatRoomId: roomId.value,
        message: newMessage.value
      })
    } catch (err) {
      console.error(err)
    } finally {
      newMessage.value = ''
    }
  }
}

// Основная функция (дебаунсится ниже)
async function _markVisibleMessagesAsRead(msgs: ChatMessage[]) {
  if (!msgs.length || !roomId.value) return

  const unreadIds = msgs.map((m) => m.id)
  try {
    await markMessagesAsReadQuery(unreadIds)
    msgs.forEach((m) => (m.is_read = true))
    unreadCounts.value[roomId.value] = Math.max(
      (unreadCounts.value[roomId.value] || 0) - unreadIds.length,
      0
    )
  } catch (e) {
    console.error('Ошибка при отметке видимых сообщений прочитанными:', e)
  }
}
const markVisibleMessagesAsRead = debounce(_markVisibleMessagesAsRead, 300)

const markAllAsRead = async () => {
  if (!roomId.value) return

  const msgs = messages.value[roomId.value] || []
  const unreadIds = msgs.filter((m) => !m.is_your && !m.is_read).map((m) => m.id)

  if (!unreadIds.length) return

  try {
    await markMessagesAsReadQuery([...unreadIds])

    // обновляем состояние в сторе/фронте
    msgs.forEach((m) => {
      if (unreadIds.includes(m.id)) m.is_read = true
    })

    // сбрасываем счетчик в UI
    unreadCounts.value[roomId.value] = 0
  } catch (e) {
    console.error('Ошибка при отметке сообщений прочитанными:', e)
  }
}

const selectRoom = async (id: number) => {
  if (roomId.value === id) return
  roomId.value = id
  // unreadCounts.value[id] = 0
  chatStore.subscribeChannel(`chat.${id}`)

  page.value[id] = 1
  hasMore.value[id] = true
  await getMessages(id)
  newMessageCount.value = 0
  userScrolledUp.value = false
  initialScrollDone.value = false

  await markAllAsRead()

  await router.push({ name: 'SupportChat', params: { id } })
  currentTransition.value = currentRoom.value?.slicer_id ?? undefined
}

onMounted(async () => {
  if (!userId.value) await supportStore.getSupportInfo()

  chatStore.connect()
  const { data } = await getChatsSupportQuery()
  if (data.code === 200) {
    rooms.value = data.data.chats.map((chat) => ({
      id: chat.chat_room_id,
      name: chat.chat_room_name,
      slicer_id: chat.slicer_id,
      unread_count: chat.unread_count
    }))
    rooms.value.forEach((room) => {
      unreadCounts.value[room.id] = room.unread_count || 0
    })
    rooms.value.forEach((room) => chatStore.subscribeChannel(`chat.${room.id}`))

    if (rooms.value.length) {
      const targetId = Number(route.params.id) || rooms.value[0].id
      await selectRoom(targetId)
    }
  }
})

onBeforeUnmount(() => {
  rooms.value.forEach((room) => {
    chatStore.unsubscribeChannel(`chat.${room.id}`)
  })
})

//лишний вызов текущей комнаты
// watch(
//   () => route.params.id,
//   async (newId) => {
//     if (!newId && rooms.value.length) await selectRoom(rooms.value[0].id)
//     else if (newId) await selectRoom(Number(newId))
//   }
// )

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
  max-height: 85vh;

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
    max-height: 624px;
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
        background: $primary-color;
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

  &__title {
    font-weight: 400;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
