import api from './axios'
import type { ITableParams } from '@/interfaces/AppModel'
import type { IPayout } from '@/interfaces/IPayout'

export const createPayment = (data: IPayout) => api.post('/admin/payout/set-payout-item', data)

export const getDataPayout = (data: ITableParams) =>
  api.get('/admin/payout/get-payout-list', { params: data })
