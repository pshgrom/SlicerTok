export const videoRules = {
  required: (v: string) => !!v || 'Обязательное поле',
  url: (v: string) => /^https?:\/\/.+/.test(v) || 'Введите корректную ссылку',
  noShare: (v: string) => !/share/.test(v) || 'Строка не должна содержать слово "share"'
}

export const infoRules = {
  required: (v: string) => !!v || 'Обязательное поле',
  telegram: (v: string) => /^@\w{3,}/.test(v) || 'Ник должен начинаться с @',
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Некорректный email'
}

export const requiredRules = {
  required: (v: any) => !!v || 'Обязательное поле'
}
