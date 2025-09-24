import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useError } from '@/stores/Errors.ts'

type Message = {
  event: string
  channel: string
  data: any
}

export const useChatSocketStore = defineStore('chatSocket', () => {
  const socket = ref<WebSocket | null>(null)
  const connected = ref(false)
  const subscribedChannels = ref<Set<string>>(new Set())
  const messages = ref<Message[]>([])
  const errorStore = useError()

  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 10
  const isConnecting = ref(false)
  const reconnectUrl = ref<string>('') // хранение URL для переподключения

  function connect() {
    const { VITE_APP_WS_URL, VITE_APP_WS_PATH, VITE_APP_WS_QUERY } = import.meta.env ?? {}
    const url = `${VITE_APP_WS_URL}${VITE_APP_WS_PATH}${VITE_APP_WS_QUERY}`
    console.warn(url)
    if (isConnecting.value || reconnectAttempts.value >= maxReconnectAttempts) return

    reconnectUrl.value = url
    isConnecting.value = true

    socket.value = new WebSocket(url)

    socket.value.onopen = () => {
      connected.value = true
      isConnecting.value = false
      reconnectAttempts.value = 0
      // errorStore.setErrors('Соединение установлено', 'success')

      // повторная подписка
      subscribedChannels.value.forEach((channel) => {
        subscribeChannel(channel)
      })
    }

    socket.value.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as Message
        messages.value.push(msg)
      } catch (e) {
        console.error('Ошибка парсинга сообщения:', event.data)
      }
    }

    socket.value.onclose = (e) => {
      connected.value = false
      isConnecting.value = false
      errorStore.setErrors('Соединение потеряно, переподключение...', 'error')
      socket.value = null
      attemptReconnect()
    }

    socket.value.onerror = (e) => {
      errorStore.setErrors('Ошибка сети', 'error')
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
      if (reconnectUrl.value) {
        connect(reconnectUrl.value)
      }
    }, delay)
  }

  function subscribeChannel(channel: string) {
    subscribedChannels.value.add(channel)

    if (!connected.value || !socket.value) return

    const subscribeMsg = {
      event: 'pusher:subscribe',
      data: { channel }
    }
    socket.value.send(JSON.stringify(subscribeMsg))
  }

  function unsubscribeChannel(channel: string) {
    if (!connected.value || !subscribedChannels.value.has(channel)) return

    const unsubscribeMsg = {
      event: 'pusher:unsubscribe',
      data: { channel }
    }

    socket.value?.send(JSON.stringify(unsubscribeMsg))
    subscribedChannels.value.delete(channel)
  }

  function sendMessage(channel: string, eventName: string, data: any) {
    if (!connected.value || !socket.value) return

    const msg = {
      event: eventName.startsWith('client-') ? eventName : `client-${eventName}`,
      channel,
      data
    }

    socket.value.send(JSON.stringify(msg))
  }

  return {
    socket,
    connected,
    messages,
    subscribedChannels,
    connect,
    subscribeChannel,
    unsubscribeChannel,
    sendMessage
  }
})
