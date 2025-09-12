import type { ITableParams } from '@/interfaces/AppModel'

import api from './axios'

export const getPublicationListQuery = (data: ITableParams) =>
  api.get('/admin/publication/get-publication-list', { params: data })

export const getPublicationListPaymentQuery = (data: ITableParams) =>
  api.get('/admin-finance/publication/get-publication-list', { params: data })

export const getPublicationsListMainQuery = (data: ITableParams) =>
  api.get('/admin-main/publication/get-publication-list', { params: data })

export const getCompletedListQuery = (data: ITableParams) =>
  api.get('/admin/publication/get-publication-moderation-completed-list', { params: data })

export const getLogListQuery = (data: ITableParams) =>
  api.get('/admin-main/log/get-log-list', { params: data })

export const getAdminInfoQuery = () => api.get('/admin/profile/get-info')

export const getCoefficientQuery = () => api.get('/coefficient/get-coefficient')

export const setPublicationStatusQuery = (data: any) =>
  api.post('/admin/publication/set-publication-status', data)

export const finishCheckQuery = (id: number) =>
  api.post('/admin/publication/complete-moderation', { id })

export const requestVerificationQuery = (id: number) =>
  api.post('admin/publication/set-require-verification', { id })

export const saveMarkQuery = (data: any) => api.post('/admin/publication/set-mark', data)

export const actionRequestAdminQuery = (data: any) =>
  api.post('/admin-main/publication/final-status', data)
