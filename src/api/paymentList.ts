import type { ITableParams } from '@/interfaces/AppModel'

import api from './axios'

export const getDataWallet = (data: ITableParams) =>
  api.get('/admin/payment-list', { params: data })

export const getPaymentStatistic = () => api.get('/admin/payment-statistic')
