export const paymentListHeaders = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Кошелек нарезчика', value: 'wallet_id' },
  { title: 'Nickname Tg', value: 'nikname' },
  { title: 'Количество просмотров', value: 'number_views' },
  { title: 'Сумма выплаты', value: 'amount' },
  {
    title: 'Заявленный статус',
    value: 'declared_status'
  },
  {
    title: 'Актуальный статус',
    value: 'actual_status'
  },
  {
    title: 'Вызывающий подозрение',
    value: 'suspicion_status'
  }
]

export const amountListHeaders = [
  {
    title: 'Кошелек Нарезчика',
    value: 'wallet_id'
  },
  { title: 'Сумма выплат', value: 'total_amount' },
  { title: 'Заявленная сумма выплат', value: 'declared_amount_paid', sortable: true },
  { title: 'Осталось выплатить', value: 'left_amount_pay', sortable: true },
  { title: 'Найдено поступлений на сумму', value: 'revenues_found_amount', sortable: true },
  {
    title: 'Статус',
    value: 'status.amount'
  }
]

export const walletListHeaders = [
  {
    title: 'Кошелек выводов',
    value: 'wallet_id_interaction'
  },
  { title: 'Количество кошельков', value: 'count_wallet' },
  { title: 'Кошельки нарезчиков', value: 'wallet_id_out' }
]

export const payoutListHeaders = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Адрес', value: 'wallet' },
  { title: 'Nickname Tg', value: 'nikname' },
  { title: 'Количество просмотров', value: 'number_views' },
  { title: 'Сумма выплаты', value: 'amount' },
  {
    title: 'Публикации',
    value: 'publications'
  }
]

export const userInfoHeaders = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Ссылка', value: 'url' },
  { title: 'Статистика', value: 'video_stat_link' },
  { title: 'Просмотры', value: 'number_views' },
  { title: 'Статус', value: 'status' }
  // { title: 'Комментарии', value: 'status_moderation_comment' }
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
  { title: 'Платформа', value: 'resource' },
  { title: 'Статус', value: 'status' },
  { title: 'Комментарии', value: 'status_comment' },
  { title: 'Действия', value: 'actions' }
]

export const supportHeaders = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Ключ', value: 'key' },
  { title: 'Просмотры', value: 'number_views' },
  { title: 'Ссылка', value: 'url' },
  { title: 'Статистика', value: 'video_stat_link' },
  { title: 'Статус модераторов', value: 'status_moderation' }
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
  { title: 'Тип кошелька', value: 'wallet_type' }
]

export const adminMain = [
  {
    title: 'ID',
    value: 'id'
  },
  { title: 'Ключ', value: 'key' },
  { title: 'Количество просмотров', value: 'number_views' },
  { title: 'Статус', value: 'status' },
  { title: 'Статус модераторов', value: 'status_moderation' },
  { title: 'Ссылка', value: 'url' },
  { title: 'Статистика', value: 'video_stat_link' }
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
