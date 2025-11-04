import type { AxiosResponse } from 'axios'

import type { ITableParams } from '@/interfaces/AppModel'

import api from './axios'

export const getDataAmountList = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/received-amount-list', { params: data })

export const getReceivedStatistic = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/received-statistic')
