import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  getChatQuery,
  getMessagesQuery,
  markMessagesAsReadQuery,
  sendMessageQuery
} from '@/api/chat.ts'
import { ROLES } from '@/constants/roles.ts'
import { useAdminInfo } from '@/stores/AdminInfo.ts'
import { useAdminPaymentsFinance } from '@/stores/AdminPaymentsFinance.ts'
import { useAuth } from '@/stores/Auth.ts'
import { useChatSocketStore } from '@/stores/ChatSocket'
import { useUserInfo } from '@/stores/UserInfo.ts'

interface ChatMessage {
  id?: number
  content: string
  created_at: string
  is_your: boolean
  user?: { name: string }
  is_read: boolean
  _uuid?: string
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
        return userInfoStore.userInfo?.id
      case ROLES.ADMIN_FINANCE:
        return adminFinanceStore.adminFinanceInfo?.id
      default:
        return adminStore.adminProfileData?.id
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

  const getTime = (time: string) => {
    const d = new Date(time)
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  const initializeChat = async () => {
    try {
      const { data } = await getChatQuery()
      if (data.code === 200) {
        roomId.value = data.data.chat_room_id
        await getMessages(false)
        if (roomId.value) chatSocketStore.subscribeChannel(`chat.${roomId.value}`)
      }
    } catch (err) {
      console.error('Ошибка инициализации чата:', err)
    }
  }

  const getMessages = async (isLoadMore = false) => {
    if (!roomId.value) return
    if (isLoadMore && (!hasMore.value || isLoading.value)) return

    if (!isLoadMore) {
      isLoading.value = true
      page.value = 1
      hasMore.value = true
    } else {
      isLoading.value = true
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
      if (newMessages.length < pageSize) hasMore.value = false

      if (isLoadMore) {
        messages.value = [...newMessages, ...messages.value]
      } else {
        messages.value = [...newMessages]
      }
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

      await sendMessageQuery({ chatRoomId: roomId.value, message: text })
      // очищаем input только в компоненте
    } catch (err) {
      console.error('Ошибка отправки:', err)
      messages.value = messages.value.filter((msg) => !msg._uuid?.includes('temp_'))
    } finally {
      isSending.value = false
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = messages.value.filter((m) => !m.is_your && !m.is_read).map((m) => m.id)

    if (!unreadIds.length) return

    await markMessagesAsReadQuery([...unreadIds])

    messages.value.forEach((m) => {
      if (unreadIds.includes(m.id)) m.is_read = true
    })

    // уведомляем других через WebSocket (если нужно)
    // if (socket.value && isConnected.value) {
    //   socket.value.send(JSON.stringify({ type: 'mark_as_read', message_ids: unreadIds }))
    // }
  }

  const handleIncomingMessage = (msg: any) => {
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
    })
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
    markAllAsRead
  }
})
