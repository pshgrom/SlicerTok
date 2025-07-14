import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  // Соединение
  function connect(url: string) {
    if (socket.value) return // уже подключено

    socket.value = new WebSocket(url)

    socket.value.onopen = () => {
      connected.value = true
      console.log('🟢 WebSocket connected')

      // Авто-подписка на все каналы, если уже есть
      subscribedChannels.value.forEach((channel) => {
        subscribeChannel(channel)
      })
    }

    socket.value.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as Message
        messages.value.push(msg)
        console.error('messages.value', messages.value)
      } catch (e) {
        console.error('Ошибка парсинга сообщения:', event.data)
      }
    }

    socket.value.onclose = () => {
      connected.value = false
      console.log('🔴 WebSocket disconnected')
      socket.value = null
    }

    socket.value.onerror = (e) => {
      console.error('⚠️ WebSocket error', e)
    }
  }

  // Подписка на канал
  function subscribeChannel(channel: string) {
    if (!connected.value) {
      subscribedChannels.value.add(channel)
      return
    }
    if (subscribedChannels.value.has(channel)) return

    const subscribeMsg = {
      event: 'pusher:subscribe',
      data: { channel }
    }

    socket.value?.send(JSON.stringify(subscribeMsg))
    subscribedChannels.value.add(channel)
    console.log('Подписались на канал', channel)
  }

  // Отписка (опционально)
  function unsubscribeChannel(channel: string) {
    if (!connected.value) return
    if (!subscribedChannels.value.has(channel)) return

    const unsubscribeMsg = {
      event: 'pusher:unsubscribe',
      data: { channel }
    }

    socket.value?.send(JSON.stringify(unsubscribeMsg))
    subscribedChannels.value.delete(channel)
    console.log('Отписались от канала', channel)
  }

  // Отправить событие в канал
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
