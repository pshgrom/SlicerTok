import DOMPurify from 'dompurify'
import { computed } from 'vue'

export function useSafeHtml(rawHtml: string | null | undefined) {
  const safeHtml = computed(() => {
    if (!rawHtml) return ''
    return DOMPurify.sanitize(rawHtml)
  })
  return { safeHtml }
}
