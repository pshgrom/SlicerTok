import axios from 'axios'
import type { ITableParams } from '@/interfaces/AppModel'
import type { ISupportSaveStatus } from '@/interfaces/ISupport'

export const getPublicationListQuery = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://185.228.235.34/api/api',
    params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin-support/publication/get-publication-list')
}

export const doubleCheckQuery = (data: ISupportSaveStatus) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://185.228.235.34/api/api',
    // params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.post('/admin-support/publication/double-check', data)
}
