import api from './axios'
import type { INewPublication, ITableParams } from '@/interfaces/AppModel'

export const createPublicationQuery = (data: INewPublication) =>
  api.post('/slicer/publication/create-publication', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const updateContactQuery = (data: any) => api.post('/slicer/profile/update-contacts', data)

export const addWalletQuery = (data: any) => api.post('/slicer/profile/wallet/add-wallet', data)

export const getWalletsQuery = () => api.get('/slicer/profile/wallet/get-wallet-list')

export const enableTwoFactorQuery = () => api.get('/user/enable-two-factor')
export const disabledTwoFactorQuery = () => api.get('/user/disable-two-factor')

export const setWalletMainQuery = (id: number) =>
  api.post('/slicer/profile/wallet/set-wallet-main', { wallet_id: id })

export const removeWalletQuery = (id: number) =>
  api.post('/slicer/profile/wallet/delete-wallet', { wallet_id: id })

export const getInfoQuery = () => api.get('/slicer/profile/get-info')

export const getPublicationListQuery = (data: ITableParams) =>
  api.get('/slicer/publication/get-publication-list', { params: data })
