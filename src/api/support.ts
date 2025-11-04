import type { AxiosResponse } from 'axios'

import type { ITableParams } from '@/interfaces/AppModel'

import api from './axios'

export const getPublicationListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/admin-support/publication/get-publication-list', { params: data })

export const actionRequestQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-support/publication/complete-moderation', { id })

export type ChangeFinalValuesPayload = Record<string, unknown>
export const changeFinalValuesQuery = (
  data: ChangeFinalValuesPayload
): Promise<AxiosResponse<unknown>> =>
  api.post('/admin-support/publication/set-publication-status', data)

export type VerifyUserPayload = Record<string, unknown>
export const verifyUserQuery = (data: VerifyUserPayload): Promise<AxiosResponse<unknown>> =>
  api.post('admin-support/slicer/slicer-verified', { ...data })

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
