import api from './axios'
import type { ITableParams } from '@/interfaces/AppModel'

export const getDataAmountList = (data: ITableParams) =>
  api.get('/admin/received-amount-list', { params: data })

export const getReceivedStatistic = () => api.get('/admin/received-statistic')
