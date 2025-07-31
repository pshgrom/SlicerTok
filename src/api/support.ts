import api from './axios'
import type { ITableParams } from '@/interfaces/AppModel'

export const getPublicationListQuery = (data: ITableParams) =>
  api.get('/admin-support/publication/get-publication-list', { params: data })

export const actionRequestQuery = (data: any) =>
  api.post('/admin-support/publication/final-status', data)

export const verifyUserQuery = (data: any) =>
  api.post('admin-support/slicer/slicer-verified', { ...data })

export const getSlicerListQuery = (data: ITableParams) =>
  api.get('/admin-support/slicer/get-slicer-list', { params: data })

export const getSlicerQuery = (id: number) =>
  api.get('/admin-support/slicer/get-slicer', { params: { id } })
