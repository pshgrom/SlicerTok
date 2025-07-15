import api from './axios'
import type { ITableParams } from '@/interfaces/AppModel'
import type { ISupportSaveStatus } from '@/interfaces/ISupport'

export const getPublicationListQuery = (data: ITableParams) =>
  api.get('/admin-support/publication/get-publication-list', { params: data })

export const doubleCheckQuery = (data: ISupportSaveStatus) =>
  api.post('/admin-support/publication/double-check', data)
