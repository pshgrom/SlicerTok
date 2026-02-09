// export const paymentListHeaders = [
//   {
//     title: 'ID',
//     value: 'id'
//   },
//   { title: 'Кошелек нарезчика', value: 'wallet_id' },
//   { title: 'Nickname Tg', value: 'nikname' },
//   { title: 'Просмотры', value: 'number_views' },
//   { title: 'Сумма выплаты', value: 'amount' },
//   {
//     title: 'Заявленный статус',
//     value: 'declared_status'
//   },
//   {
//     title: 'Актуальный статус',
//     value: 'actual_status'
//   },
//   {
//     title: 'Вызывающий подозрение',
//     value: 'suspicion_status'
//   }
// ]

// export const amountListHeaders = [
//   {
//     title: 'Кошелек Нарезчика',
//     value: 'wallet_id'
//   },
//   { title: 'Сумма выплат', value: 'total_amount' },
//   { title: 'Заявленная сумма выплат', value: 'declared_amount_paid', sortable: true },
//   { title: 'Осталось выплатить', value: 'left_amount_pay', sortable: true },
//   { title: 'Найдено поступлений на сумму', value: 'revenues_found_amount', sortable: true },
//   {
//     title: 'Статус',
//     value: 'status.amount'
//   }
// ]

// export const walletListHeaders = [
//   {
//     title: 'Кошелек выводов',
//     value: 'wallet_id_interaction'
//   },
//   { title: 'Количество кошельков', value: 'count_wallet' },
//   { title: 'Кошельки нарезчиков', value: 'wallet_id_out' }
// ]

// export const payoutListHeaders = [
//   {
//     title: 'ID',
//     value: 'id'
//   },
//   { title: 'Адрес', value: 'wallet' },
//   { title: 'Nickname Tg', value: 'nikname' },
//   { title: 'Просмотры', value: 'number_views' },
//   { title: 'Сумма выплаты', value: 'amount' },
//   {
//     title: 'Публикации',
//     value: 'publications'
//   }
// ]

export const userInfoHeaders = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Ссылка', value: 'url' },
  { title: 'Статистика', value: 'video_stat_link' },
  { title: 'Просмотры', value: 'number_views' },
  { title: 'Выплаты', value: 'expected_reward' },
  { title: 'Статус', value: 'status' },
  { title: 'Причины отказа', value: 'rules' }
]

export const adminInfoHeaders = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Ссылка', value: 'url' },
  { title: 'Ключ', value: 'key' },
  { title: 'Статистика', value: 'video_stat_link' },
  { title: 'Просмотры', value: 'number_views' },
  { title: 'Статус', value: 'status' },
  { title: 'Бонус', value: 'is_bonus' },
  // { title: 'Верификация', value: 'is_verified' },
  { title: 'Пометки', value: 'mark' },
  { title: 'Комментарии', value: 'status_comment' },
  {
    title: 'Дата регистрации',
    value: 'user_created_at',
    sortable: true
  },
  {
    title: 'Дата загрузки',
    value: 'created_at',
    sortable: true
  },
  { title: '', value: 'actions' }
]

export const supportHeaders = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Ключ', value: 'key' },
  { title: 'Просмотры', value: 'number_views' },
  { title: 'Бонус', value: 'is_bonus' },
  { title: 'Ссылка', value: 'url' },
  { title: 'Статистика', value: 'video_stat_link' },
  { title: 'Статус модераторов', value: 'status_moderation' },
  { title: '', value: 'actions' }
]

export const supportUsersHeaders = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Имя Юзера', value: 'name' },
  { title: 'Ключ', value: 'key' },
  { title: 'Просмотры', value: 'total_views' },
  { title: 'Верификация', value: 'is_verified' },
  { title: 'Проверка', value: 'requires_verification' },
  { title: 'Действия', value: 'actions' }
]

export const streamerMainInfoHeaders = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Админ', value: 'name' }
]

export const adminInfoCheckedHeaders = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Ссылка', value: 'url' },
  { title: 'Ключ', value: 'key' },
  { title: 'Статистика', value: 'video_stat_link' },
  { title: 'Просмотры', value: 'number_views' },
  { title: 'Статус', value: 'status' },
  { title: 'Комментарии', value: 'status_comment' }
]

export const adminPaymentsFinance = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Адрес кошелька', value: 'wallet_address' },
  { title: 'Сумма', value: 'amount' },
  { title: 'Тип кошелька', value: 'wallet_type' },
  { title: '', value: 'actions' }
]

export const adminProcessPayments = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Адрес кошелька', value: 'wallet' },
  { title: 'Публикации', value: 'publication' },
  { title: 'Сумма', value: 'amount' },
  { title: '', value: 'actions' }
]

export const adminFinishedPayments = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Ссылка', value: 'link' },
  { title: 'Адрес кошелька', value: 'wallet' },
  { title: 'Публикации', value: 'publication' },
  { title: 'Сумма', value: 'amount' },
  { title: '', value: 'actions' }
]

export const adminMain = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Ключ', value: 'key' },
  { title: 'Дата загрузки', value: 'created_at' },
  { title: 'Бонус', value: 'is_bonus' },
  { title: 'Просмотры', value: 'number_views' },
  { title: 'Статус', value: 'status' },
  { title: 'Ссылка', value: 'url' },
  { title: 'Статистика', value: 'video_stat_link' },
  { title: 'Статус модераторов', value: 'status_moderation' },
  { title: '', value: 'actions' }
]

export const streamerStats = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Дата', value: 'date' },
  { title: 'Всего пришло', value: 'come' },
  { title: 'Обработано', value: 'processed' },
  { title: 'Принятые', value: 'approved' },
  { title: 'Отклоненные', value: 'rejected' },
  { title: 'Выплаченные', value: 'amount' },
  { title: 'Количество просмотров за день', value: 'number_of_views' },
  { title: 'Сумма выплат за день', value: 'approved_amount' }
]

export const adminStats = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Дата', value: 'date' },
  { title: 'Одобренные', value: 'approved' },
  { title: 'Доп. проверка', value: 'na' },
  { title: 'Отклоненные', value: 'rejected' },
  { title: 'Общее количество проверенных', value: 'total_verified' }
]

export const adminCoeffs = [
  { title: 'Значение', value: 'rate' },
  { title: '', value: 'actions' }
]

export const adminMainLogs = [
  {
    title: 'ID',
    value: 'id'
  },
  {
    title: 'Действия',
    value: 'action'
  },
  { title: 'Дата действия', value: 'datetime' },
  { title: 'Описание', value: 'description' },
  { title: 'IP', value: 'ip' },
  { title: 'Id юзера', value: 'user_id' }
]
