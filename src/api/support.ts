import type { ITableParams } from '@/interfaces/AppModel'

import api from './axios'

export const getPublicationListQuery = (data: ITableParams) =>
  api.get('/admin-support/publication/get-publication-list', { params: data })

export const actionRequestQuery = (data: any) =>
  api.post('/admin-support/publication/final-status', data)

export const changeFinalValuesQuery = (data: any) =>
  api.post('/admin-support/publication/final-status-test', data)

export const verifyUserQuery = (data: any) =>
  api.post('admin-support/slicer/slicer-verified', { ...data })

export const getSupportInfoQuery = () => api.get('/admin-support/profile/get-info')

export const getSlicerListQuery = (data: ITableParams) =>
  api.get('/admin-support/slicer/get-slicer-list', { params: data })

export const getSlicerQuery = (id: number) =>
  api.get('/admin-support/slicer/get-slicer', { params: { id } })

export const getWalletsQuery = (id: number) =>
  api.get('/admin-support/slicer/get-slicer-wallet-list', { params: { id } })

export const getInfoQuery = (data: any) =>
  api.get('/admin-support/slicer/get-slicer-publication-list', { params: data })
