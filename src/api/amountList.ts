import axios from 'axios'
import type { ITableParams } from '@/interfaces/AppModel'

export const getDataAmountList = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin/received-amount-list')
}

export const getReceivedStatistic = () => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin/received-statistic')
}
