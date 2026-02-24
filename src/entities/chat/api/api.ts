import type { AxiosResponse } from 'axios'

import api from '@/shared/api'

export const getChatQuery = (streamerId?: number): Promise<AxiosResponse<unknown>> =>
  api.get('/chat/get-chat-support', {
    params: { streamer_id: streamerId }
  })

export const getChatsSupportQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/chat/get-chats')

export const getMessagesQuery = (
  roomId: number,
  page = 1,
  dateFrom?: string
): Promise<AxiosResponse<unknown>> =>
  api.get('/chat/get-chat-messages', {
    params: { page, dateFrom, chatRoomId: roomId }
  })

export const getChatByUserQuery = (userId: number | string): Promise<AxiosResponse<unknown>> =>
  api.get('/chat/get-chat', {
    params: { user_id: userId }
  })

export type SendMessagePayload = Record<string, unknown>

export const sendMessageQuery = (data: SendMessagePayload): Promise<AxiosResponse<unknown>> =>
  api.post('/chat/send-chat-messages', data)

export const markMessagesAsReadQuery = (
  ids: (string | number)[]
): Promise<AxiosResponse<unknown>> => api.post('/chat/read-chat-messages', { message_ids: ids })
