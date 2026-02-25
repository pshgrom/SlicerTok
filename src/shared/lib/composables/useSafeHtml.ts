import { sanitizeHtml } from '../utils/sanitize'

export function useSafeHtml(rawHtml: string | null | undefined) {
  return { safeHtml: () => sanitizeHtml(rawHtml) }
}
