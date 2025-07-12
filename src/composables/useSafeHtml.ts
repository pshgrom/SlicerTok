import { computed } from 'vue'
import DOMPurify from 'dompurify'

export function useSafeHtml(rawHtml: string | null | undefined) {
  const safeHtml = computed(() => {
    if (!rawHtml) return ''
    return DOMPurify.sanitize(rawHtml)
  })
  return { safeHtml }
}
