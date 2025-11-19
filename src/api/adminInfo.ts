import type { AxiosResponse } from 'axios'

import type { ITableParams } from '@/interfaces/AppModel'

import api from './axios'

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
  api.get('/admin-main/publication/get-publication-list', { params: data })

export const getCoeffsListQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/streamer/coefficient/get-coefficient-list')

export const getCompletedListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/publication/get-publication-moderation-completed-list', { params: data })

export const getLogListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-main/log/get-log-list', { params: data })

export const getAdminInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin/profile/get-info')

export const getAdminFinanceInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-finance/profile/get-info')

export const getCoefficientQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/coefficient/get-coefficient-for-admin')

export type SetPublicationStatusPayload = Record<string, unknown>
export const setPublicationStatusQuery = (
  data: SetPublicationStatusPayload
): Promise<AxiosResponse<unknown>> => api.post('/admin/publication/set-publication-status', data)

export const finishCheckQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('/admin/publication/complete-moderation', { id })

export const importFileQuery = (formData: FormData): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-finance/transfer/import-transfer-list-exel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const requestVerificationQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('admin/publication/set-require-verification', { id })

export type SaveMarkPayload = Record<string, unknown>
export const saveMarkQuery = (data: SaveMarkPayload): Promise<AxiosResponse<unknown>> =>
  api.post('/admin/publication/set-mark', data)

export type SetTransferPayload = Record<string, unknown>
export const setTransferQuery = (data: SetTransferPayload): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-finance/transfer/make-transfer', data)

export type CancelTransferPayload = Record<string, unknown>
export const cancelTransferQuery = (data: CancelTransferPayload): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-finance/transfer/cancel-transfer', data)

export const getTransferListExelQuery = (data: {
  transfer_ids: number[]
}): Promise<AxiosResponse<Blob>> =>
  api.post('/admin-finance/transfer/get-transfer-list-exel', data, {
    responseType: 'blob'
  })

export type TransferFinishedPayload = Record<string, unknown>
export const transferFinishedQuery = (
  data: TransferFinishedPayload
): Promise<AxiosResponse<unknown>> => api.post('/admin-finance/transfer/transfer-finished', data)

export type ActionRequestAdminPayload = Record<string, unknown>
export const actionRequestAdminQuery = (
  data: ActionRequestAdminPayload
): Promise<AxiosResponse<unknown>> => api.post('/admin-main/publication/final-status', data)

export const removeCoeffQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('/streamer/coefficient/delete-coefficient', { id })

export const addNewCoeffQuery = (value: string): Promise<AxiosResponse<unknown>> =>
  api.post('/streamer/coefficient/create-coefficient', { rate: value })
