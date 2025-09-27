import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useError } from '@/stores/Errors.ts'
import { useUserInfo } from '@/stores/UserInfo.ts'

type RequestItem = {
  id: number
  title: string
  status: string
}

export const useRequestSocket = defineStore('requestSocket', () => {
  const socket = ref<WebSocket | null>(null)
  const connected = ref(false)
  const subscribed = ref(false)
  const requests = ref<RequestItem[]>([])
  const errorStore = useError()
  const channelName = ref<string>('')
  const slicerRequest = ref(null)
  const userInfoStore = useUserInfo()

  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 10
  const isConnecting = ref(false)
  const reconnectUrl = ref<string>('')
  // const adminInfoStore = useAdminInfo()
  // const queryParams = computed(() => adminInfoStore.queryParams)

  const setChannel = (name: string) => {
    channelName.value = name
  }

  function connect() {
    const { VITE_APP_WS_URL, VITE_APP_WS_PATH, VITE_APP_WS_QUERY } = import.meta.env ?? {}
    const url = `${VITE_APP_WS_URL}${VITE_APP_WS_PATH}${VITE_APP_WS_QUERY}`

    if (isConnecting.value || socket.value) return

    reconnectUrl.value = url
    isConnecting.value = true

    socket.value = new WebSocket(url)

    socket.value.onopen = () => {
      connected.value = true
      isConnecting.value = false
      reconnectAttempts.value = 0
      console.log('✅ Соединение установлено для заявок')

      // сразу подписываемся на канал
      subscribeChannel(channelName.value)
    }

    socket.value.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data)

        switch (msg.event) {
          case 'pusher_internal:subscription_succeeded':
            subscribed.value = true
            console.log(`📡 Подписка на ${channelName.value} успешна`)
            break

          case 'App\\Events\\PublicationNew':
            console.log('📩 Получено событие publication.created')
            errorStore.setErrors('Новая заявка — обновите страницу', 'info')
            // await adminInfoStore.getPublicationsList(queryParams.value)
            break

          case 'PublicationStatus': {
            slicerRequest.value = JSON.parse(msg.data)
            const id = slicerRequest?.value?.id
            errorStore.setErrors(`Статус заявки ${id} обновлен`, 'info')
            userInfoStore.updateUserInfoItem(slicerRequest.value)
            break
          }

          default:
            console.log(`⚠️ Необработанное событие: ${msg.event}`)
        }
      } catch (e) {
        console.error('Ошибка парсинга сообщения:', event.data)
      }
    }

    socket.value.onclose = () => {
      connected.value = false
      subscribed.value = false
      socket.value = null
      isConnecting.value = false
      errorStore.setErrors('Соединение потеряно, переподключаемся...', 'error')
      attemptReconnect()
    }

    socket.value.onerror = () => {
      errorStore.setErrors('Ошибка сети (заявки)', 'error')
      socket.value?.close()
    }
  }

  function subscribeChannel(channel: string) {
    if (!socket.value) return
    const subscribeMsg = {
      event: 'pusher:subscribe',
      data: { channel }
    }
    socket.value.send(JSON.stringify(subscribeMsg))
  }

  function attemptReconnect() {
    if (reconnectAttempts.value >= maxReconnectAttempts) {
      errorStore.setErrors('❌ Превышено число попыток переподключения', 'error')
      return
    }

    const delay = Math.min(1000 * (reconnectAttempts.value + 1), 5000)
    reconnectAttempts.value++

    console.warn(`♻️ Переподключение #${reconnectAttempts.value} через ${delay}мс...`)

    setTimeout(() => {
      if (reconnectUrl.value) {
        connect()
      }
    }, delay)
  }

  return {
    socket,
    connected,
    subscribed,
    requests,
    connect,
    setChannel
  }
})
