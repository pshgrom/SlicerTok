import type { AxiosResponse } from 'axios'

import type { ITableParams } from '@/interfaces/AppModel'

import api from './axios'

export const getDataWallet = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/payment-list', { params: data })

export const getPaymentStatistic = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/payment-statistic')
