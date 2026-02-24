import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useError } from '@/app/stores'
import type {
  IAuth,
  IAuthByPhone,
  IAuthConfirmation,
  LoginResult
} from '@/shared/config/types/auth.ts'

import * as authApi from '../api/api.ts'

export const useAuth = defineStore('authStore', () => {
  const token = ref<string | null>(localStorage.getItem('authToken') || null)
  const role = ref<null | string>(localStorage.getItem('role') || null)
  const errorStore = useError()
  const phone = ref('')
  const isEnableGoogle2fa = ref(false)
  const currentCountryCode = ref<number | null>(null)
  const countryCodes = ref<unknown[]>([])

  const login = async ({
    login,
    password,
    google2fa_key
  }: IAuth): Promise<LoginResult | undefined> => {
    try {
      const { data } = await authApi.loginUser({ login, password, google2fa_key })
      const { access_token, is_enable_google2fa } = (data as Record<string, unknown>) ?? {}
      if (is_enable_google2fa) {
        isEnableGoogle2fa.value = true
        return { token: null, role: '' }
      }

      const roleData = (data as Record<string, unknown>)?.role as string[] | undefined
      if (access_token && roleData?.[0]) {
        token.value = access_token as string
        localStorage.setItem('authToken', access_token as string)
        role.value = roleData[0]
        if (role.value) localStorage.setItem('role', role.value.toString())
        return { token: token.value, role: role.value }
      }
      errorStore.setErrors('Ошибка авторизации')
      return
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw err?.response?.data?.message ?? ''
    }
  }

  const loginByPhone = async (data: IAuthByPhone) => {
    try {
      return await authApi.loginByPhoneQuery(data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw err?.response?.data?.message ?? ''
    }
  }

  const setPhone = (value: string) => {
    phone.value = value
  }

  const getCountryCodes = async () => {
    try {
      const countries: unknown[] = []
      const { data } = await authApi.getCountryCodesQuery()
      const res = data as Record<string, unknown>
      const newData = res?.data as Record<string, unknown> | undefined
      const status = res?.status
      if (status === 'Success' && newData) {
        Object.keys(newData).forEach((item) => {
          const row = (newData[item] as Record<string, unknown>) ?? {}
          const { id, code, name, placeholder } = row
          countries.push({
            value: id,
            label: `${code} ${name}`,
            placeholder
          })
        })
        if (!countryCodes.value.length) {
          countryCodes.value = countries
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw err?.response?.data?.message ?? ''
    }
  }

  const loginConfirmation = async (data: IAuthConfirmation) => {
    try {
      return await authApi.loginConfirmationQuery(data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      throw err?.response?.data?.message ?? err?.message ?? ''
    }
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    errorStore.setErrors('Вы вышли из системы', 'error')
  }

  return {
    login,
    logout,
    loginByPhone,
    loginConfirmation,
    getCountryCodes,
    countryCodes,
    role,
    token,
    setPhone,
    phone,
    currentCountryCode,
    isEnableGoogle2fa
  }
})
