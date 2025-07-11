import axios from 'axios'
import type { IAuth, IAuthByPhone, IAuthConfirmation } from '@/interfaces/Auth'

export const loginUser = ({ login, password }: IAuth) => {
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: {
      login,
      password
    }
  })
  return instWithCred.post('/user/auth')
}

export const loginByPhoneQuery = ({ country_calling_codes_id, phone }: IAuthByPhone) => {
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: {
      country_calling_codes_id,
      phone
    }
  })
  return instWithCred.post('/auth/phone-verification')
}

export const loginConfirmationQuery = (data: IAuthConfirmation) => {
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: {
      ...data
    }
  })
  return instWithCred.post('/auth/phone-confirmation')
}

export const getCountryCodesQuery = () => {
  const instWithCred = axios.create({
    baseURL: 'http://localhost:80/api',
    // baseURL: 'http://localhost:80/api',
    params: {}
  })
  return instWithCred.get('/country-colling-codes')
}
