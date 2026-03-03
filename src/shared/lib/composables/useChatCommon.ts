import type { Ref } from 'vue'
import { nextTick } from 'vue'

const CHAT_SANITIZE_REGEX = /[^a-zA-Zа-яА-Я0-9\s.,!?'"()\-:;@]/g

export function useChatCommon(containerRef: Ref<HTMLElement | null>) {
  const scrollToBottom = (smooth = true) => {
    nextTick(() => {
      const el = containerRef.value
      if (!el) return

      el.scrollTo({
        top: el.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    })
  }

  const sanitizeMessage = (value: string): string => value.replace(CHAT_SANITIZE_REGEX, '')

  return {
    scrollToBottom,
    sanitizeMessage
  }
}

