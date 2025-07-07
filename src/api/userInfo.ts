import axios from 'axios'
import type { INewPublication, ITableParams } from '@/interfaces/AppModel'

export const createPublicationQuery = (data: INewPublication) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return instWithCred.post('/slicer/publication/create-publication', data)
}

export const updateContactQuery = (data: any) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.post('/slicer/profile/update-contacts', data)
}

export const addWalletQuery = (data: any) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.post('/slicer/profile/wallet/add-wallet', data)
}

export const getWalletsQuery = () => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/slicer/profile/wallet/get-wallet-list')
}

export const updateNameQuery = (name: string) => {
  console.error('name', name)
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.post('/slicer/profile/update-name', { name })
}

export const setWalletMainQuery = (id: number) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.post('/slicer/profile/wallet/set-wallet-main', { wallet_id: id })
}

export const removeWalletQuery = (id: number) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.post('/slicer/profile/wallet/delete-wallet', { wallet_id: id })
}

export const getInfoQuery = () => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/slicer/profile/get-info')
}

export const getPublicationListQuery = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/slicer/publication/get-publication-list')
}
