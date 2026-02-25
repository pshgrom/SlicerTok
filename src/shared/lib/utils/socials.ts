export const getNameSocialMedia = (url: string): string => {
  if (url.includes('inst')) return 'Instagram'
  if (url.includes('tik')) return 'Tik Tok'
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
    case 'na':
      return 'Доп. проверка'
    case 'awaiting_payment':
      return 'Ожидание оплаты'
    case 'process_payment':
      return 'Процесс оплаты'
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
    case 'process_payment':
      return 'rgb(var(--v-theme-statusProcessBg))'
    case 'approved':
    case 'paid':
      return 'rgb(var(--v-theme-statusApprovedBg))'
    case 'rejected':
      return 'rgb(var(--v-theme-statusRejectBg))'
    case 'na':
      return 'rgba(255, 241, 221, 1)'
    default:
      return ''
  }
}

export const getColor = (status: string): string => {
  switch (status) {
    case 'create':
    case 'todo':
      return 'rgba(169, 55, 244, 1)'
    case 'moderation':
    case 'awaiting_payment':
    case 'process_payment':
      return 'rgb(var(--v-theme-statusProcessColor))'
    case 'approved':
    case 'paid':
      return 'rgb(var(--v-theme-statusApprovedColor))'
    case 'rejected':
      return 'rgb(var(--v-theme-statusRejectColor))'
    case 'na':
      return 'rgba(235, 142, 4, 1)'
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

export const getIcon = (status: string): string => {
  let icon = ''
  switch (status) {
    case 'create':
    case 'todo':
    case 'moderation':
      icon = 'status-new'
      break
    case 'awaiting_payment':
    case 'process_payment':
      icon = 'status-awaiting-payment'
      break
    case 'approved':
      icon = 'status-ok'
      break
    case 'paid':
      icon = 'status-paid'
      break
    case 'rejected':
      icon = 'status-bad'
      break
    case 'na':
      icon = 'addCheck'
      break
  }
  return icon
}
