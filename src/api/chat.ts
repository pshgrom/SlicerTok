import api from './axios'

export const getChatQuery = () => api.get('/chat/get-chat-support')

export const getChatsSupportQuery = () => api.get('/chat/get-chats')

export const getMessagesQuery = (roomId: number, page = 1, dateFrom = undefined) =>
  api.get('/chat/get-chat-messages', {
    params: { page, dateFrom, chatRoomId: roomId }
  })

export const getChatByUserQuery = (userId: number | string) =>
  api.get('/chat/get-chat', {
    params: { user_id: userId }
  })

export const sendMessageQuery = (data: any) => api.post('/chat/send-chat-messages', data)
export const markMessagesAsReadQuery = (data: any) =>
  api.post('/chat/read-chat-messages', { message_ids: data })
