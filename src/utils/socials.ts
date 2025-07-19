export const getNameSocialMedia = (url: string): string => {
  if (url.includes('inst')) return 'Instagram'
  if (url.includes('tik')) return 'TikTok'
  if (url.includes('shorts')) return 'Shorts'
  if (url.includes('vk')) return 'VK Video'
  return 'Unknown'
}

export const getTextStatus = (status: string): string => {
  switch (status) {
    case 'create':
    case 'todo':
      return 'Новая'
    case 'moderation':
      return 'На модерации'
    case 'awaiting_payment':
      return 'Ожидание оплаты'
    case 'paid':
      return 'Оплачено'
    case 'approved':
      return 'Одобрено'
    case 'rejected':
      return 'Отклонено'
    default:
      return 'Неизвестно'
  }
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'create':
    case 'todo':
      return 'rgba(229, 236, 253, 1)'
    case 'moderation':
    case 'awaiting_payment':
      return 'rgba(229, 236, 253, 1)'
    case 'approved':
    case 'paid':
      return 'rgba(187, 251, 228, 1)'
    case 'rejected':
      return 'rgba(255, 224, 224, 1)'
    default:
      return ''
  }
}

export const getIconSocial = (url: string): string => {
  let icon = ''
  if (url.includes('inst')) {
    icon = 'instagram'
  } else if (url.includes('tik')) {
    icon = 'tiktok'
  } else if (url.includes('shorts')) {
    icon = 'shorts'
  } else if (url.includes('vk')) {
    icon = 'vk'
  }
  return icon
}

export const getColor = (status: string): string => {
  switch (status) {
    case 'create':
    case 'todo':
      return 'rgba(34, 93, 255, 1)'
    case 'moderation':
    case 'awaiting_payment':
      return 'rgba(34, 93, 255, 1)'
    case 'approved':
    case 'paid':
      return 'rgba(16, 154, 106, 1)'
    case 'rejected':
      return 'rgba(255, 0, 0, 1)'
    default:
      return ''
  }
}

export const getIcon = (status: string): string => {
  let icon = ''
  switch (status) {
    case 'create':
    case 'todo':
    case 'moderation':
      icon = 'status-new'
      break
    case 'awaiting_payment':
      icon = 'status-awaiting-payment'
      break
    case 'approved':
    case 'paid':
      icon = 'status-ok'
      break
    case 'rejected':
      icon = 'status-bad'
      break
  }
  return icon
}
