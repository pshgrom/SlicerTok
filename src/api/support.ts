import api from './axios'
import type { ITableParams } from '@/interfaces/AppModel'

export const getPublicationListQuery = (data: ITableParams) =>
  api.get('/admin-support/publication/get-publication-list', { params: data })

export const actionRequestQuery = (data: any) =>
  api.post('/admin-support/publication/final-status', data)
