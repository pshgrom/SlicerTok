export const videoRules = {
  required: (v: string) => !!v || 'Обязательное поле',
  quantityViews: (v: string) => v.length <= 15 || 'Количество не должно превышать 15 символов',
  quantityLink: (v: string) => v.length <= 120 || 'Ссылка не должна превышать 120 символов',
  url: (v: string) => /^https?:\/\/.+/.test(v) || 'Введите корректную ссылку',
  noShare: (v: string) => !/share/.test(v) || 'Строка не должна содержать слово "share"'
}

export const infoRules = {
  required: (v: string) => !!v || 'Обязательное поле',
  name: (v: string) => v.length <= 30 || 'Имя не должно превышать 30 символов',
  phone: (v: string) =>
    /^\+?[0-9]{7,15}$/.test(v) || 'Введите корректный номер телефона (от 7 до 15 цифр)',
  telegram: (v: string) => /^@\w{3,}/.test(v) || 'Ник должен начинаться с @',
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Некорректный email'
}

export const requiredRules = {
  required: (v: any) => !!v || 'Обязательное поле'
}
