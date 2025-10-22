export type ChatMessage = {
  id: string | number
  content: string
  created_at: string
  is_your: boolean
  user?: { id: number; name: string }
}

export type Room = { id: number; name: string }
