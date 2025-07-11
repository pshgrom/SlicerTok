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
      return 'Новая'
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
      return 'rgba(229, 236, 253, 1)'
    case 'approved':
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
