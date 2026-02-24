import type { AxiosResponse } from 'axios'

import api from '@/shared/api'
import type { ITableParams } from '@/shared/config/types/app-model.ts'

export const createPublicationQuery = (data: {
  id?: string | number
  key: string
  link: string
}): Promise<AxiosResponse<unknown>> =>
  api.post('/slicer/publication/create-publication', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const resubmissionPublicationQuery = (data: {
  id?: string | number
  key: string
  link: string
}): Promise<AxiosResponse<unknown>> =>
  api.post('/slicer/publication/resubmission-publication', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const updateContactQuery = (
  data: Record<string, unknown>
): Promise<AxiosResponse<unknown>> => api.post('/slicer/profile/update-contacts', data)

export const updateAvatarQuery = (base64: string): Promise<AxiosResponse<unknown>> =>
  api.post('/slicer/profile/update-icon', { icon: base64 })

export const addWalletQuery = (data: Record<string, unknown>): Promise<AxiosResponse<unknown>> =>
  api.post('/slicer/profile/wallet/add-wallet', data)

export const getWalletsQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/slicer/profile/wallet/get-wallet-list')

export const enableTwoFactorQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/user/enable-two-factor')

export const disabledTwoFactorQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/user/disable-two-factor')

export const verifyTwoFactorQuery = (data: string | number): Promise<AxiosResponse<unknown>> =>
  api.post('/user/verify-two-factor', { google2fa_key: data })

export const setWalletMainQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('/slicer/profile/wallet/set-wallet-main', { wallet_id: id })

export const removeWalletQuery = (id: number): Promise<AxiosResponse<unknown>> =>
  api.post('/slicer/profile/wallet/delete-wallet', { wallet_id: id })

export const checkLinkPublicationQuery = (link: string): Promise<AxiosResponse<unknown>> =>
  api.post('/slicer/publication/check-link-publication', { link })

export const getInfoQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/slicer/profile/get-info')

export const getPublicationListQuery = (data: ITableParams): Promise<AxiosResponse<unknown>> =>
  api.get('/slicer/publication/get-publication-list', { params: data })
