import axios from 'axios'
import type { ITableParams } from '@/interfaces/AppModel'
import { IPayout } from '@/interfaces/IPayout'

export const createPayment = (data: IPayout) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.post('/admin/payout/set-payout-item', data)
}

export const getDataPayout = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin/payout/get-payout-list')
}
