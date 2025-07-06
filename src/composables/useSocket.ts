import { ref, onUnmounted } from 'vue'
import { io } from 'socket.io-client'

export function useSocket() {
  const socket = io(import.meta.env.VUE_APP_WS_URL, {
    path: import.meta.env.VUE_APP_WS_PATH,
    query: import.meta.env.VUE_APP_WS_QUERY
  })
  const isConnected = ref(false)
  const message = ref(null)
  const subscribedChannels = ref(new Set())

  socket.on('connect', () => {
    isConnected.value = true
    // При реконнекте подписываемся на все ранее подписанные каналы
    subscribedChannels.value.forEach((channel) => {
      subscribeToChannel(channel)
    })
  })

  socket.on('disconnect', () => {
    isConnected.value = false
  })

  socket.on('message', (data) => {
    message.value = data
  })

  const subscribeToChannel = (channel) => {
    console.log('channel', channel)
    if (!subscribedChannels.value.has(channel)) {
      socket.emit('pusher:subscribe', {
        channel: channel
      })
      console.warn('subscribedChannels.value', subscribedChannels.value)
      subscribedChannels.value.add(channel)
    }
  }

  const unsubscribeFromChannel = (channel) => {
    if (subscribedChannels.value.has(channel)) {
      socket.emit('pusher:unsubscribe', {
        channel: channel
      })
      subscribedChannels.value.delete(channel)
    }
  }

  onUnmounted(() => {
    if (socket) socket.disconnect()
  })

  const emit = (event, data) => {
    socket.emit(event, data)
  }

  return {
    socket,
    isConnected,
    message,
    emit,
    subscribeToChannel,
    unsubscribeFromChannel
  }
}
