import axios from 'axios'
import type { ITableParams } from '@/interfaces/AppModel'

export const getDataWallet = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin/payment-list')
}

export const getPaymentStatistic = () => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin/payment-statistic')
}
