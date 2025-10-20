export const videoRules = {
  required: (v: string) => !!v || 'Обязательное поле',
  quantityViews: (v: string) => v.length <= 15 || 'Количество не должно превышать 15 символов',
  quantityLink: (v: string) => v.length <= 120 || 'Ссылка не должна превышать 120 символов',
  url: (v: string) => /^https?:\/\/.+/.test(v) || 'Введите корректную ссылку',
  noShare: (v: string) => !/share/.test(v) || 'Строка не должна содержать слово "share"',
  quantityViewsMin: (v: any) => {
    const format = v.replace(/\D/g, '')
    return (!isNaN(+format) && +format >= 100000) || 'Минимум 100 000 просмотров'
  }
}

export const infoRules = {
  required: (v: string) => !!v || 'Обязательное поле',
  name: (v: string) => v.length <= 30 || 'Имя не должно превышать 30 символов',
  phone: (v: string) =>
    /^\+?[0-9]{7,15}$/.test(v) || 'Введите корректный номер телефона (от 7 до 15 цифр)',
  telegram: (v: string) => /^@\w{3,}/.test(v) || 'Ник должен начинаться с @',
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Некорректный email',
  noCyrillic: (v: string) => !/[а-яА-ЯёЁ]/.test(v) || 'Кириллические символы запрещены'
}

export const requiredRules = {
  required: (v: any) => !!v || 'Обязательное поле',
  maxLength: (v: any) => v.length <= 500 || 'Максимум 500 символов'
}

export const coeffsRules = {
  required: (v: any) => !!v || 'Обязательное поле',
  min: (v: any) => parseFloat(v) >= 0 || 'Минимум 0',
  format: (v: any) => /^\d+\.\d+$/.test(v) || 'Введите число в формате X.Y',
  max: (v: any) => parseFloat(v) <= 10 || 'Максимум 10'
}

export const walletRules = {
  required: (v: any) => !!v || 'Обязательное поле',

  isValidWallet: (v: string) => {
    if (!v || typeof v !== 'string') return true

    const trimmed = v.trim()

    const isETH = /^0x[a-fA-F0-9]{40}$/.test(trimmed)
    const isBTC = /^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(trimmed)
    const isBTCBech32 = /^bc1[ac-hj-np-z02-9]{11,71}$/.test(trimmed)
    const isTRC20 = /^T[a-zA-Z0-9]{33}$/.test(trimmed)

    if (isETH || isBTC || isBTCBech32 || isTRC20) return true

    return 'Неверный формат адреса кошелька'
  }
}
