import type { AxiosResponse } from 'axios'

import type { ITableParams } from '@/interfaces/AppModel'
import type { IPayout } from '@/interfaces/IPayout'

import api from './axios'

export const createPayment = (data: IPayout): Promise<AxiosResponse<unknown>> =>
  api.post('/admin/payout/set-payout-item', data)

export const getDataPayout = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/payout/get-payout-list', { params: data })
