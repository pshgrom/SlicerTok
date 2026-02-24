import type { AxiosResponse } from 'axios'

import api from '@/shared/api'
import type { IAuth, IAuthByPhone, IAuthConfirmation } from '@/shared/config/types/auth.ts'

export const loginUser = ({
  login,
  password,
  google2fa_key
}: IAuth): Promise<AxiosResponse<unknown>> =>
  api.post('/user/auth', null, {
    params: { login, password, google2fa_key }
  })

export const loginByPhoneQuery = ({
  country_calling_codes_id,
  phone
}: IAuthByPhone): Promise<AxiosResponse<unknown>> =>
  api.post('/auth/phone-verification', null, {
    params: { country_calling_codes_id, phone }
  })

export const loginConfirmationQuery = (data: IAuthConfirmation): Promise<AxiosResponse<unknown>> =>
  api.post('/auth/phone-confirmation', null, {
    params: { ...data }
  })

export const getCountryCodesQuery = (): Promise<AxiosResponse<unknown>> =>
  api.get('/country-colling-codes')
