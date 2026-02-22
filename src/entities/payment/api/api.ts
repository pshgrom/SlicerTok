import type { AxiosResponse } from 'axios'

import api from '@/shared/api'
import type { ITableParams } from '@/shared/config/types/app-model.ts'

export const getPublicationListPaymentQuery = (
  data: ITableParams
): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-finance/publication/get-publication-list', { params: data })

export const getTransferListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-finance/transfer/get-transfer-list', { params: data })

export const getFinishedListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-finance/transfer/get-transfer-list-finished', { params: data })

export const getAdminFinanceInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-finance/profile/get-info')

export const importFileQuery = (formData: FormData): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-finance/transfer/import-transfer-list-exel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const setTransferQuery = (data: Record<string, unknown>): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-finance/transfer/make-transfer', data)

export const cancelTransferQuery = (
  data: Record<string, unknown>
): Promise<AxiosResponse<unknown>> => api.post('/admin-finance/transfer/cancel-transfer', data)

export const transferFinishedQuery = (
  data: Record<string, unknown>
): Promise<AxiosResponse<unknown>> => api.post('/admin-finance/transfer/transfer-finished', data)
