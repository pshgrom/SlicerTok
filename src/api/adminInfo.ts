import axios from 'axios'
import type { ITableParams } from '@/interfaces/AppModel'

export const getPublicationListQuery = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin/publication/get-publication-list')
}

export const getPublicationListPaymentQuery = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin-finance/publication/get-publication-list')
}

export const getPublicationsListMainQuery = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin-main/publication/get-publication-list')
}

export const getCompletedListQuery = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin/publication/get-publication-moderation-completed-list')
}

export const getLogListQuery = (data: ITableParams) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/admin-main/log/get-log-list')
}

export const getTaskQuery = () => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.get('/publication/get-task')
}

export const setPublicationStatusQuery = (data: any) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.post('/admin/publication/set-publication-status', data)
}

export const finishCheckQuery = (id: number) => {
  const token = localStorage.getItem('authToken')
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return instWithCred.post('/admin/publication/complete-moderation', { id })
}
