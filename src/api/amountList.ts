import axios from 'axios'
import type { ITableParams } from '@/interfaces/AppModel'

export const getDataAmountList = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
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
    // baseURL: 'http://localhost:80/api',
    baseURL: 'http://185.228.235.34/api/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin/received-statistic')
}
