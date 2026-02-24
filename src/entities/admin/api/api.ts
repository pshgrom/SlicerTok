import type { AxiosResponse } from 'axios'

import api from '@/shared/api'
import type { ITableParams } from '@/shared/config/types/app-model.ts'

export const getPublicationListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/publication/get-publication-list', { params: data })

export const getPublicationListPaymentQuery = (
  data: ITableParams
): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-finance/publication/get-publication-list', { params: data })

export const getTransferListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-finance/transfer/get-transfer-list', { params: data })

export const getFinishedListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-finance/transfer/get-transfer-list-finished', { params: data })

export const getPublicationsListMainQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/publication/get-publication-list', { params: data })

export const getCoeffsListQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/coefficient/get-coefficient-list')

export const getCompletedListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/publication/get-publication-moderation-completed-list', {
    params: data
  })

export const getLogListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-main/log/get-log-list', { params: data })

export const getAdminStatsQuery = (
  data: ITableParams,
  adminId: string
): Promise<AxiosResponse<unknown>> =>
  api.get(`/admin-main/streamer/admin/get-statistic-daily?admin_id=${adminId}`, {
    params: data
  })

export const getAdminInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/profile/get-info')

export const getMainAdminInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-main/profile/get-info')

export const getAdminFinanceInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-finance/profile/get-info')

export const getAdminMainInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-main/streamer/get-streamer-list')

export const getAdminsForCurrentStreamerQuery = (data: {
  streamer_id: string
}): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-main/streamer/get-admin-list-by-streamer', { params: data })

export const getCoefficientQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/coefficient/get-coefficient-for-admin')

export const setPublicationStatusQuery = (
  data: Record<string, unknown>
): Promise<AxiosResponse<unknown>> => api.post('/admin/publication/set-publication-status', data)

export const setPublicationStreamerStatusQuery = (
  data: Record<string, unknown>
): Promise<AxiosResponse<unknown>> => api.post('/streamer/publication/set-publication-status', data)

export const finishCheckQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('/admin/publication/complete-moderation', { id })

export const importFileQuery = (formData: FormData): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-finance/transfer/import-transfer-list-exel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const requestVerificationQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('/admin/publication/set-require-verification', { id })

export const saveMarkQuery = (data: Record<string, unknown>): Promise<AxiosResponse<unknown>> =>
  api.post('/admin/publication/set-mark', data)

export const setTransferQuery = (data: Record<string, unknown>): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-finance/transfer/make-transfer', data)

export const cancelTransferQuery = (
  data: Record<string, unknown>
): Promise<AxiosResponse<unknown>> => api.post('/admin-finance/transfer/cancel-transfer', data)

export const transferFinishedQuery = (
  data: Record<string, unknown>
): Promise<AxiosResponse<unknown>> => api.post('/admin-finance/transfer/transfer-finished', data)

export const actionRequestAdminQuery = (
  data: Record<string, unknown>
): Promise<AxiosResponse<unknown>> => api.post('/streamer/publication/final-status', data)

export const removeCoeffQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('/streamer/coefficient/delete-coefficient', { id })

export const addNewCoeffQuery = (value: string): Promise<AxiosResponse<unknown>> =>
  api.post('/streamer/coefficient/create-coefficient', { rate: value })
