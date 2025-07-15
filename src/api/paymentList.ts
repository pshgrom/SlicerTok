import api from './axios'
import type { ITableParams } from '@/interfaces/AppModel'

export const getDataWallet = (data: ITableParams) =>
  api.get('/admin/payment-list', { params: data })

export const getPaymentStatistic = () => api.get('/admin/payment-statistic')
