import { useError } from '@/stores/Errors.ts'

export const copyContent = async (value: string) => {
  if (!value) return
  const errorStore = useError()

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      errorStore.setErrors('Успешно скопировано', 'success')
    } catch (err) {
      console.error('Clipboard API error:', err)
      fallbackCopyTextToClipboard(value)
    }
  } else {
    fallbackCopyTextToClipboard(value)
  }
}

export const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  const errorStore = useError()
  try {
    const successful = document.execCommand('copy')
    if (successful) {
      errorStore.setErrors('Успешно скопировано', 'success')
    } else {
      throw new Error('execCommand failed')
    }
  } catch (err) {
    console.error('Fallback copy failed:', err)
    errorStore.setErrors('Не удалось скопировать текст.')
  }
  document.body.removeChild(textArea)
}
