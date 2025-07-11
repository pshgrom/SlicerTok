// composables/useChat.ts
import { ref, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'

interface Message {
  room: string
  userId: string
  text: string
  createdAt: string
}

let socket: Socket

export function useChat() {
  const messages = ref<Message[]>([])
  const currentRoom = ref<string | null>(null)
  const connected = ref(false)

  const connectSocket = () => {
    if (!socket) {
      const url = import.meta.env.VITE_APP_WS_URL || 'ws://localhost:8080'
      const path = import.meta.env.VITE_APP_WS_PATH || '/socket.io'
      const query = import.meta.env.VITE_APP_WS_QUERY || ''

      console.log(url)
      console.log(path)
      console.log(query)

      socket = io(url, {
        path,
        query,
        transports: ['websocket']
      })
      console.warn('socket', socket)

      socket.on('connect', () => {
        connected.value = true
        console.log('✅ Socket connected:', socket.id)
      })

      socket.on('disconnect', () => {
        connected.value = false
        console.log('❌ Socket disconnected')
      })

      socket.on('chat-message', (message: Message) => {
        messages.value.push(message)
      })
    }
  }

  const joinRoom = (roomName: string) => {
    if (currentRoom.value) {
      socket.emit('leave-room', currentRoom.value)
    }

    currentRoom.value = roomName
    socket.emit('join-room', roomName)
    messages.value = []
  }

  const sendMessage = (text: string, userId: string) => {
    if (!currentRoom.value || !text.trim()) return

    const message: Message = {
      room: currentRoom.value,
      userId,
      text,
      createdAt: new Date().toISOString()
    }

    socket.emit('chat-message', message)
    messages.value.push(message)
  }

  onUnmounted(() => {
    if (socket) {
      socket.disconnect()
    }
  })

  return {
    connectSocket,
    joinRoom,
    sendMessage,
    messages,
    currentRoom,
    connected
  }
}
