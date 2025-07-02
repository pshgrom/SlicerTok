import axios from 'axios'

export const getChatQuery = () => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/chat/get-chat-support')
}

export const getChatsSupportQuery = () => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/chat/get-chats')
}

export const getMessagesQuery = (roomId: number) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://185.228.235.34/api/api',
    params: {
      chatRoomId: roomId
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/chat/get-chat-messages')
}

export const sendMessageQuery = (data: any) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.post('/chat/send-chat-messages', data)
}
