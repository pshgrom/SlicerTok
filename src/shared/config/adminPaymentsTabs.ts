export const ADMIN_PAYMENTS_TAB_IDS = {
  ALL: 'tab1',
  IN_PROCESS: 'tab2',
  FINISHED: 'tab3'
} as const

export const adminPaymentsTabs = [
  {
    id: ADMIN_PAYMENTS_TAB_IDS.ALL,
    title: 'Все заявки',
    redirect: '/admin-payments-finance'
  },
  {
    id: ADMIN_PAYMENTS_TAB_IDS.IN_PROCESS,
    title: 'В процессе выплат',
    redirect: '/admin-process-payments'
  },
  {
    id: ADMIN_PAYMENTS_TAB_IDS.FINISHED,
    title: 'Оплаченные',
    redirect: '/admin-finished-list'
  }
] as const
