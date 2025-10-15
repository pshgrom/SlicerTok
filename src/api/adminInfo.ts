import type { ITableParams } from '@/interfaces/AppModel'

import api from './axios'

export const getPublicationListQuery = (data: ITableParams) =>
  api.get('/admin/publication/get-publication-list', { params: data })

export const getPublicationListPaymentQuery = (data: ITableParams) =>
  api.get('/admin-finance/publication/get-publication-list', { params: data })

export const getTransferListQuery = (data: ITableParams) =>
  api.get('/admin-finance/transfer/get-transfer-list', { params: data })

export const getFinishedListQuery = (data: ITableParams) =>
  api.get('/admin-finance/transfer/get-transfer-list-finished', { params: data })

export const getPublicationsListMainQuery = (data: ITableParams) =>
  api.get('/admin-main/publication/get-publication-list', { params: data })

export const getCoeffsListQuery = () => api.get('/admin-main/coefficient/get-coefficient-list')

export const getCompletedListQuery = (data: ITableParams) =>
  api.get('/admin/publication/get-publication-moderation-completed-list', { params: data })

export const getLogListQuery = (data: ITableParams) =>
  api.get('/admin-main/log/get-log-list', { params: data })

export const getAdminInfoQuery = () => api.get('/admin/profile/get-info')

export const getAdminFinanceInfoQuery = () => api.get('/admin-finance/profile/get-info')

export const getCoefficientQuery = () => api.get('/coefficient/get-coefficient')

export const setPublicationStatusQuery = (data: any) =>
  api.post('/admin/publication/set-publication-status', data)

export const finishCheckQuery = (id: number) =>
  api.post('/admin/publication/complete-moderation', { id })

export const requestVerificationQuery = (id: number) =>
  api.post('admin/publication/set-require-verification', { id })

export const saveMarkQuery = (data: any) => api.post('/admin/publication/set-mark', data)

export const setTransferQuery = (data: any) =>
  api.post('/admin-finance/transfer/make-transfer', data)

export const cancelTransferQuery = (data: any) =>
  api.post('/admin-finance/transfer/cancel-transfer', data)

export const transferFinishedQuery = (data: any) =>
  api.post('/admin-finance/transfer/transfer-finished', data)

export const actionRequestAdminQuery = (data: any) =>
  api.post('/admin-main/publication/final-status', data)

export const removeCoeffQuery = (id: number) =>
  api.post('/admin-main/coefficient/delete-coefficient', { id })

export const addNewCoeffQuery = (value: string) =>
  api.post('/admin-main/coefficient/create-coefficient', { rate: value })
