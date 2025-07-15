import api from './axios'
import type { IAuth, IAuthByPhone, IAuthConfirmation } from '@/interfaces/Auth'

export const loginUser = ({ login, password }: IAuth) =>
  api.post('/user/auth', null, {
    params: { login, password }
  })

export const loginByPhoneQuery = ({ country_calling_codes_id, phone }: IAuthByPhone) =>
  api.post('/auth/phone-verification', null, {
    params: { country_calling_codes_id, phone }
  })

export const loginConfirmationQuery = (data: IAuthConfirmation) =>
  api.post('/auth/phone-confirmation', null, {
    params: { ...data }
  })

export const getCountryCodesQuery = () => api.get('/country-colling-codes')
