<template>
  <div v-click-outside="closeChat" class="chat" :class="{ chat_mobile: isMobile }">
    <div class="chat-box">
      <div class="chat__title">
        <span>Чат с поддержкой</span>
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </div>
      <div ref="chatBoxRef" class="chat-messages">
        <template v-if="loadingMessages">
          <div class="chat-spinner">
            <v-progress-circular indeterminate color="primary" size="40" />
          </div>
        </template>

        <template v-else-if="filteredMessages.length">
          <transition-group name="fade-slide">
            <div
              v-for="msg in filteredMessages"
              :key="getMessageKey(msg)"
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
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { getChatQuery, getMessagesQuery, sendMessageQuery } from '@/api/chat.ts'
import VCustomInput from '@/components/base/VCustomInput.vue'
import { useDeviceDetection } from '@/composables/useDeviceDetection.ts'
import { ROLES } from '@/constants/roles.ts'
import { useAdminInfo } from '@/stores/AdminInfo.ts'
import { useAdminPaymentsFinance } from '@/stores/AdminPaymentsFinance.ts'
import { useAuth } from '@/stores/Auth.ts'
import { useChatSocketStore } from '@/stores/ChatSocket'
import { useUserInfo } from '@/stores/UserInfo.ts'
import { throttle } from '@/utils/optimize.ts'

interface ChatMessage {
  id?: number
  content: string
  created_at: string
  is_your: boolean
  user?: { name: string }
  _uuid?: string
}

defineProps({ showChat: Boolean })
const emit = defineEmits(['update:showChat'])

const userInfoStore = useUserInfo()
const adminStore = useAdminInfo()
const adminFinanceStore = useAdminPaymentsFinance()
const chatStore = useChatSocketStore()
const { isMobile } = useDeviceDetection()
const authStore = useAuth()

const page = ref(1)
const pageSize = 20
const hasMore = ref(true)
const isLoadingMore = ref(false)
const roomId = ref<number | null>(null)
const newMessage = ref('')
const dateFrom = ref(undefined)
const messages = ref<ChatMessage[]>([])
const chatBoxRef = ref<HTMLElement | null>(null)
const loadingMessages = ref(false)
const isSending = ref(false)
const processedMessageIds = new Set<number | string>()
let scrollListenerAttached = false
let initialScrollDone = false

const userId = computed(() => {
  if (!role.value) return null
  switch (role.value) {
    case ROLES.SLICER:
      return userInfoStore.userInfo?.id
    case ROLES.ADMIN_FINANCE:
      return adminFinanceStore.adminFinanceInfo?.id
    default:
      return adminStore.adminProfileData?.id
  }
})

const role = computed(() => authStore.role)

const filteredMessages = computed(() => {
  const uniqueMessages: ChatMessage[] = []
  const seenKeys = new Set<string>()
  for (const message of messages.value) {
    const key = getMessageKey(message)
    if (!seenKeys.has(key)) {
      seenKeys.add(key)
      uniqueMessages.push(message)
    }
  }
  return uniqueMessages
})

const getTime = (time: string) => {
  const date = new Date(time)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const getMessageKey = (msg: ChatMessage) => {
  if (msg.id) return `id_${msg.id}`
  return `time_${msg.created_at}_content_${msg.content.slice(0, 20)}_your_${msg.is_your}`
}

const scrollToBottom = (smooth = true) => {
  nextTick(() => {
    if (chatBoxRef.value) {
      chatBoxRef.value.scrollTo({
        top: chatBoxRef.value.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  })
}

const sendMessage = async (): Promise<void> => {
  if (!newMessage.value.trim() || !roomId.value || isSending.value) return
  isSending.value = true
  try {
    const tempMessage: ChatMessage = {
      content: newMessage.value,
      created_at: new Date().toISOString(),
      is_your: true,
      _uuid: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    messages.value.push(tempMessage)
    scrollToBottom()
    await sendMessageRest()
  } finally {
    isSending.value = false
  }
}

const sendMessageRest = async (): Promise<void> => {
  if (!newMessage.value.trim() || !roomId.value) return
  try {
    await sendMessageQuery({ chatRoomId: roomId.value, message: newMessage.value })
    newMessage.value = ''
  } catch (err) {
    console.error('Ошибка отправки сообщения:', err)
    messages.value = messages.value.filter((msg) => !msg._uuid?.includes('temp_'))
  }
}

const getMessages = async (isLoadMore = false): Promise<void> => {
  if (!roomId.value) return
  if (isLoadMore && (!hasMore.value || isLoadingMore.value)) return

  let oldScrollHeight = 0
  let oldScrollTop = 0
  if (isLoadMore && chatBoxRef.value) {
    oldScrollHeight = chatBoxRef.value.scrollHeight
    oldScrollTop = chatBoxRef.value.scrollTop
  }

  if (!isLoadMore) {
    loadingMessages.value = true
    page.value = 1
    hasMore.value = true
  } else {
    isLoadingMore.value = true
    page.value += 1
  }

  try {
    const { data } = await getMessagesQuery(roomId.value, page.value, dateFrom.value)
    dateFrom.value = data?.date_from ?? undefined

    const uid = Number(userId.value)
    const newMessages = (data?.data.reverse() ?? []).map((msg: any) => ({
      ...msg,
      is_your: Number(msg.user_id) === uid
    }))

    if (!newMessages.length) {
      hasMore.value = false
      return
    }
    if (newMessages.length < pageSize) {
      hasMore.value = false
    }

    if (isLoadMore) {
      messages.value = [...newMessages, ...messages.value]
      await nextTick(() => {
        if (chatBoxRef.value) {
          const newScrollHeight = chatBoxRef.value.scrollHeight
          chatBoxRef.value.scrollTop = newScrollHeight - oldScrollHeight + oldScrollTop
        }
      })
    } else {
      messages.value = [...newMessages]
    }
  } catch (error) {
    console.error('Ошибка загрузки сообщений:', error)
  } finally {
    loadingMessages.value = false
    isLoadingMore.value = false
  }
}

const initializeChat = async (): Promise<void> => {
  try {
    const { data } = await getChatQuery()
    if (data.code === 200) {
      roomId.value = data.data.chat_room_id
      // только первая страница, без скролла
      await getMessages(false)
      if (roomId.value) chatStore.subscribeChannel(`chat.${roomId.value}`)
    }
  } catch (error) {
    console.error('Ошибка инициализации чата:', error)
  }
}

const handleIncomingMessage = (msg: any) => {
  if (!msg || msg.channel !== `chat.${roomId.value}` || msg.event !== 'MessageSent') return
  const parsed = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
  if (parsed.senderId === userId.value) return
  const messageKey = `socket_${parsed.id || parsed.timestamp}_${parsed.content}`
  if (processedMessageIds.has(messageKey)) return
  processedMessageIds.add(messageKey)
  const newMsg: ChatMessage = {
    content: parsed.content,
    created_at: parsed.timestamp,
    is_your: false,
    id: parsed.id,
    user: parsed.user
  }
  messages.value.push(newMsg)
  scrollToBottom()
  if (!userInfoStore.showChat) userInfoStore.unreadCount++
}

const closeChat = (event: KeyboardEvent) => {
  if (event.key === 'Escape') emit('update:showChat', false)
}
const close = () => emit('update:showChat', false)

watch(
  () => userInfoStore.showChat,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      userInfoStore.unreadCount = 0
      localStorage.setItem('unreadCountUser', '0')
      scrollToBottom() // скроллим вниз один раз
      if (!scrollListenerAttached && chatBoxRef.value) {
        chatBoxRef.value.addEventListener('scroll', onScroll)
        scrollListenerAttached = true
      }
    }
  }
)

watch(
  () => chatStore.messages,
  (newMessages) => {
    const lastMessage = newMessages[newMessages.length - 1]
    if (lastMessage) handleIncomingMessage(lastMessage)
  },
  { deep: true }
)

const onScroll = throttle(() => {
  if (!chatBoxRef.value) return
  if (isLoadingMore.value || loadingMessages.value || !hasMore.value) return

  if (!initialScrollDone) {
    initialScrollDone = true
    return
  }

  if (chatBoxRef.value.scrollTop <= 100) {
    getMessages(true)
  }
}, 500)

onMounted(async () => {
  chatStore.connect()
  await initializeChat()
  document.addEventListener('keydown', closeChat)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', closeChat)
  if (chatBoxRef.value) chatBoxRef.value.removeEventListener('scroll', onScroll)
  if (roomId.value) chatStore.unsubscribeChannel(`chat.${roomId.value}`)
})
</script>

<style scoped lang="scss">
.chat {
  bottom: 87px;
  right: 24px;
  position: fixed;
  background: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  width: 432px;
  border-radius: 16px;
  z-index: 9999;

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
      max-width: 350px;
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
        background: $primary-color;
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
