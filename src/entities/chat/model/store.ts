import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useError } from '@/app/stores'
import { useAdminInfo } from '@/entities/admin'
import { useAuth } from '@/entities/auth'
import { useAdminPaymentsFinance } from '@/entities/payment'
import { useUserInfo } from '@/entities/user'
import { ROLES } from '@/shared/config'

import * as chatApi from '../api/api.ts'

type Message = { event: string; channel: string; data: unknown }

interface ChatMessage {
  id?: number
  content: string
  created_at: string
  is_your: boolean
  user?: { name: string }
  is_read?: boolean
  _uuid?: string
  user_id?: unknown
}

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuth()
  const userInfoStore = useUserInfo()
  const adminStore = useAdminInfo()
  const adminFinanceStore = useAdminPaymentsFinance()
  const chatSocketStore = useChatSocketStore()

  const page = ref(1)
  const pageSize = 20
  const hasMore = ref(true)
  const isLoading = ref(false)
  const roomId = ref<number | null>(null)
  const messages = ref<ChatMessage[]>([])
  const dateFrom = ref<string | undefined>(undefined)
  const isSending = ref(false)
  const processedMessageIds = new Set<number | string>()
  const unreadCount = computed(() => messages.value.filter((m) => !m.is_your && !m.is_read).length)
  const role = computed(() => authStore.role)
  const userId = computed(() => {
    if (!role.value) return null
    switch (role.value) {
      case ROLES.SLICER:
        return (userInfoStore.userInfo as Record<string, unknown>)?.id
      case ROLES.ADMIN_FINANCE:
        return adminFinanceStore.adminFinanceInfo?.id
      default:
        return (adminStore.adminProfileData as Record<string, unknown>)?.id
    }
  })

  const filteredMessages = computed(() => {
    const unique: ChatMessage[] = []
    const seen = new Set<string>()
    for (const m of messages.value) {
      const key = getMessageKey(m)
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(m)
      }
    }
    return unique
  })

  const getMessageKey = (msg: ChatMessage) => {
    if (msg.id) return `id_${msg.id}`
    return `time_${msg.created_at}_content_${msg.content.slice(0, 20)}_your_${msg.is_your}`
  }

  const resetChatBeforeInit = () => {
    if (roomId.value) {
      chatSocketStore.unsubscribeChannel(`chat.${roomId.value}`)
    }
    roomId.value = null
    messages.value = []
    dateFrom.value = undefined
    page.value = 1
    hasMore.value = true
    isLoading.value = false
  }

  const getTime = (time: string) => {
    const d = new Date(time)
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  const initializeChat = async (streamerId?: number, reset = true) => {
    try {
      if (reset) resetChatBeforeInit()
      const { data } = await chatApi.getChatQuery(streamerId)
      const res = data as { code?: number; data?: { chat_room_id?: number } }
      if (res.code !== 200) return
      roomId.value = res.data?.chat_room_id ?? null
      if (reset) await getMessages(false)
      if (roomId.value) {
        chatSocketStore.subscribeChannel(`chat.${roomId.value}`)
      }
    } catch (err) {
      console.error('Ошибка инициализации чата:', err)
    }
  }

  const resetDateFrom = () => {
    dateFrom.value = undefined
  }

  const getMessages = async (isLoadMore = false) => {
    if (!roomId.value) return
    if (isLoadMore && (!hasMore.value || isLoading.value)) return
    isLoading.value = true
    if (isLoadMore) page.value += 1
    else {
      page.value = 1
      hasMore.value = true
      messages.value = []
      dateFrom.value = undefined
    }
    try {
      const { data } = await chatApi.getMessagesQuery(roomId.value, page.value, dateFrom.value)
      const res = data as { date_from?: string; data?: Array<Record<string, unknown>> }
      dateFrom.value = res?.date_from ?? undefined
      const uid = Number(userId.value)
      const newMessages = (res?.data?.reverse() ?? []).map((msg) => ({
        ...msg,
        is_your: Number((msg as Record<string, unknown>).user_id) === uid
      })) as ChatMessage[]
      if (!newMessages.length) {
        hasMore.value = false
        return
      }
      if (newMessages.length < pageSize) hasMore.value = false
      if (isLoadMore) messages.value = [...newMessages, ...messages.value]
      else messages.value = [...newMessages]
    } catch (err) {
      console.error('Ошибка загрузки сообщений:', err)
    } finally {
      isLoading.value = false
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || !roomId.value || isSending.value) return
    isSending.value = true
    try {
      const tempMessage: ChatMessage = {
        content: text,
        created_at: new Date().toISOString(),
        is_your: true,
        _uuid: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
      messages.value.push(tempMessage)
      await chatApi.sendMessageQuery({
        chatRoomId: roomId.value,
        message: text
      })
    } catch (err) {
      console.error('Ошибка отправки:', err)
      messages.value = messages.value.filter((msg) => !msg._uuid?.includes('temp_'))
    } finally {
      isSending.value = false
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = messages.value
      .filter((m) => !m.is_your && !m.is_read)
      .map((m) => m.id)
      .filter((id): id is number => id !== undefined)
    if (!unreadIds.length) return
    await chatApi.markMessagesAsReadQuery(unreadIds)
    messages.value.forEach((m) => {
      if (unreadIds.includes(m.id!)) m.is_read = true
    })
  }

  const handleIncomingMessage = (msg: Message) => {
    if (!msg || msg.channel !== `chat.${roomId.value}` || msg.event !== 'MessageSent') return
    const parsed = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
    if (parsed.senderId === userId.value) return
    const key = `socket_${parsed.id || parsed.timestamp}_${parsed.content}`
    if (processedMessageIds.has(key)) return
    processedMessageIds.add(key)
    messages.value.push({
      content: parsed.content,
      created_at: parsed.timestamp,
      is_your: false,
      id: parsed.id,
      is_read: parsed.is_read ?? false,
      user: parsed.user ?? parsed.senderId,
      user_id: parsed.user ?? parsed.senderId
    } as ChatMessage)
  }

  return {
    messages,
    filteredMessages,
    roomId,
    hasMore,
    isLoading,
    getMessages,
    sendMessage,
    initializeChat,
    handleIncomingMessage,
    getTime,
    getMessageKey,
    unreadCount,
    markAllAsRead,
    resetDateFrom
  }
})

export const useChatSocketStore = defineStore('chatSocket', () => {
  const socket = ref<WebSocket | null>(null)
  const connected = ref(false)
  const subscribedChannels = ref<Set<string>>(new Set())
  const messages = ref<Message[]>([])
  const errorStore = useError()
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 10
  const isConnecting = ref(false)
  const reconnectUrl = ref<string>('')

  function connect() {
    const { VITE_APP_WS_URL, VITE_APP_WS_PATH, VITE_APP_WS_QUERY } = (import.meta.env ??
      {}) as Record<string, string>
    const url = `${VITE_APP_WS_URL || ''}${VITE_APP_WS_PATH || ''}${VITE_APP_WS_QUERY || ''}`
    if (isConnecting.value || reconnectAttempts.value >= maxReconnectAttempts) return
    reconnectUrl.value = url
    isConnecting.value = true
    socket.value = new WebSocket(url)
    socket.value.onopen = () => {
      connected.value = true
      isConnecting.value = false
      reconnectAttempts.value = 0
      subscribedChannels.value.forEach((channel) => subscribeChannel(channel))
    }
    socket.value.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as Message
        messages.value.push(msg)
      } catch (e) {
        console.error('Ошибка парсинга сообщения:', event.data)
      }
    }
    socket.value.onclose = () => {
      connected.value = false
      isConnecting.value = false
      socket.value = null
      attemptReconnect()
    }
    socket.value.onerror = () => {
      socket.value?.close()
    }
  }

  function attemptReconnect() {
    if (reconnectAttempts.value >= maxReconnectAttempts) {
      errorStore.setErrors(`Переподключение #${reconnectAttempts.value}`, 'error')
      return
    }
    const delay = Math.min(1000 * (reconnectAttempts.value + 1), 5000)
    reconnectAttempts.value++
    setTimeout(() => {
      if (reconnectUrl.value) connect()
    }, delay)
  }

  function subscribeChannel(channel: string) {
    subscribedChannels.value.add(channel)
    if (!connected.value || !socket.value) return
    socket.value.send(JSON.stringify({ event: 'pusher:subscribe', data: { channel } }))
  }

  function unsubscribeChannel(channel: string) {
    subscribedChannels.value.delete(channel)
    if (!connected.value || !socket.value) return
    socket.value.send(JSON.stringify({ event: 'pusher:unsubscribe', data: { channel } }))
  }

  return {
    socket,
    connected,
    messages,
    subscribedChannels,
    connect,
    subscribeChannel,
    unsubscribeChannel
  }
})

type RequestItem = { id: number; title: string; status: string }

export const useRequestSocket = defineStore('requestSocket', () => {
  const socket = ref<WebSocket | null>(null)
  const connected = ref(false)
  const subscribed = ref(false)
  const requests = ref<RequestItem[]>([])
  const errorStore = useError()
  const channelName = ref<string>('')
  const slicerRequest = ref<unknown>(null)
  const userInfoStore = useUserInfo()
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 10
  const isConnecting = ref(false)
  const reconnectUrl = ref<string>('')

  const setChannel = (name: string) => {
    channelName.value = name
  }

  function connect() {
    const { VITE_APP_WS_URL, VITE_APP_WS_PATH, VITE_APP_WS_QUERY } = (import.meta.env ??
      {}) as Record<string, string>
    const url = `${VITE_APP_WS_URL || ''}${VITE_APP_WS_PATH || ''}${VITE_APP_WS_QUERY || ''}`
    if (isConnecting.value || socket.value) return
    reconnectUrl.value = url
    isConnecting.value = true
    socket.value = new WebSocket(url)
    socket.value.onopen = () => {
      connected.value = true
      isConnecting.value = false
      reconnectAttempts.value = 0
      subscribeChannel(channelName.value)
    }
    socket.value.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data)
        switch (msg.event) {
          case 'pusher_internal:subscription_succeeded':
            subscribed.value = true
            break
          case 'App\\Events\\PublicationNew':
            errorStore.setErrors('Новая заявка — обновите страницу', 'error')
            break
          case 'PublicationStatus': {
            slicerRequest.value = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data
            const payload = slicerRequest.value as Record<string, unknown>
            const item = (payload?.value ?? payload) as Record<string, unknown>
            const id = item?.id
            errorStore.setErrors(`Статус заявки ${id} обновлен`, 'error')
            userInfoStore.updateUserInfoItem(item)
            break
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    socket.value.onclose = () => {
      connected.value = false
      isConnecting.value = false
      socket.value = null
    }
    socket.value.onerror = () => socket.value?.close()
  }

  function subscribeChannel(channel: string) {
    if (!channel || !socket.value || !connected.value) return
    socket.value.send(JSON.stringify({ event: 'pusher:subscribe', data: { channel } }))
  }

  return {
    socket,
    connected,
    subscribed,
    requests,
    channelName,
    setChannel,
    connect
  }
})
