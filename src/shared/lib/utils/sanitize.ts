import DOMPurify from 'dompurify'

const DEFAULT_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'ol', 'li', 'span'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
}

/**
 * Санитизирует HTML для безопасного вывода через v-html (защита от XSS).
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (html == null || html === '') return ''
  return DOMPurify.sanitize(html, DEFAULT_CONFIG)
}
