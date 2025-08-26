export interface IAuth {
  login: string
  password: string
}

export interface IAuthByPhone {
  country_calling_codes_id: number
  phone: string
}

export interface IAuthConfirmation extends IAuthByPhone {
  key: string
  google2fa_key?: number
}

export interface LoginResult {
  token: string | null
  role: string | string[]
}
