// composables/useSocket.ts
import { ref, onUnmounted } from 'vue'
import { io, type Socket } from 'socket.io-client'

export function useSocket() {
  // Инициализация сокета с автоматическим подключением
  const socket: Socket = io(import.meta.env.VITE_WS_URL, {
    path: import.meta.env.VITE_WS_PATH,
    autoConnect: false, // Отключаем авто-подключение
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 3000,
    transports: ['websocket']
  })

  // Состояния
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const error = ref<Error | null>(null)
  const messages = ref<Record<string, any[]>>({})
  const activeSubscriptions = ref<Set<string>>(new Set())

  // Обработчики событий
  const setupEventHandlers = () => {
    socket.on('connect', () => {
      isConnected.value = true
      isConnecting.value = false
      error.value = null
      console.log('Socket connected, ID:', socket.id)

      // Восстанавливаем подписки при реконнекте
      activeSubscriptions.value.forEach((channel) => {
        subscribeToChannel(channel)
      })
    })

    socket.on('connecting', () => {
      console.log('socker connected')
      isConnecting.value = true
    })

    socket.on('connect_error', (err) => {
      isConnected.value = false
      isConnecting.value = false
      error.value = err
      console.error('Connection error:', err)
    })

    socket.on('disconnect', () => {
      isConnected.value = false
      console.log('Socket disconnected')
    })

    // Глобальный обработчик сообщений
    socket.on('channel_message', (data: { channel: string; message: any }) => {
      if (!messages.value[data.channel]) {
        messages.value[data.channel] = []
      }
      messages.value[data.channel].push(data.message)
    })
  }

  // Подключение к серверу
  const connect = () => {
    if (!isConnected.value && !isConnecting.value) {
      console.log('Initializing socket connection...')
      setupEventHandlers()
      socket.connect()
    }
  }

  // Отключение от сервера
  const disconnect = () => {
    if (isConnected.value || isConnecting.value) {
      socket.disconnect()
    }
  }

  // Подписка на канал
  const subscribeToChannel = (channel: string) => {
    if (!activeSubscriptions.value.has(channel)) {
      socket.emit('pusher:subscribe', { channel }, (response: any) => {
        if (response?.success) {
          activeSubscriptions.value.add(channel)
          console.log(`Successfully subscribed to ${channel}`)

          // Добавляем обработчик для конкретного канала
          socket.on(`channel:${channel}`, (message: any) => {
            if (!messages.value[channel]) {
              messages.value[channel] = []
            }
            messages.value[channel].push(message)
          })
        }
      })
    }
  }

  // Отписка от канала
  const unsubscribeFromChannel = (channel: string) => {
    if (activeSubscriptions.value.has(channel)) {
      socket.emit('pusher:unsubscribe', { channel }, (response: any) => {
        if (response?.success) {
          activeSubscriptions.value.delete(channel)
          socket.off(`channel:${channel}`)
          console.log(`Successfully unsubscribed from ${channel}`)
        }
      })
    }
  }

  // Отправка сообщения
  const sendMessage = (channel: string, message: any) => {
    return new Promise((resolve, reject) => {
      if (!isConnected.value) {
        reject(new Error('Not connected to socket'))
        return
      }

      socket.emit('send_message', { channel, message }, (response: any) => {
        if (response?.error) {
          reject(new Error(response.error))
        } else {
          resolve(response)
        }
      })
    })
  }

  // Автоматическое подключение при первом использовании
  connect()

  // Очистка при демонтировании
  onUnmounted(() => {
    disconnect()
    socket.off('connect')
    socket.off('connect_error')
    socket.off('disconnect')
    socket.off('channel_message')
  })

  return {
    socket,
    isConnected,
    isConnecting,
    error,
    messages,
    connect,
    disconnect,
    subscribeToChannel,
    unsubscribeFromChannel,
    sendMessage
  }
}
