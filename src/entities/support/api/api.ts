import type { AxiosResponse } from 'axios'

import api from '@/shared/api'
import type { ITableParams } from '@/shared/config/types/app-model.ts'

export const getPublicationListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-support/publication/get-publication-list', { params: data })

export const actionRequestQuery = (
  data: number | Record<string, unknown>
): Promise<AxiosResponse<unknown>> =>
  api.post(
    '/admin-support/publication/complete-moderation',
    typeof data === 'number' ? { id: data } : data
  )

export const changeFinalValuesQuery = (
  data: Record<string, unknown>
): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-support/publication/set-publication-status', data)

export const verifyUserQuery = (data: Record<string, unknown>): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-support/slicer/slicer-verified', data)

export const getSupportInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-support/profile/get-info')

export const getSlicerListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-support/slicer/get-slicer-list', { params: data })

export const getSlicerQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-support/slicer/get-slicer', { params: { id } })

export const getWalletsQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-support/slicer/get-slicer-wallet-list', { params: { id } })

export const getInfoQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-support/slicer/get-slicer-publication-list', { params: data })
