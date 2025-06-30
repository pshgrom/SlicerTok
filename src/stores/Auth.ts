import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginUser, loginByPhoneQuery, loginConfirmationQuery } from '@/api/auth'
import type { IAuth, IAuthByPhone, IAuthConfirmation, LoginResult } from '@/interfaces/Auth'
import { useError } from '@/stores/Errors'
import { ROLES } from '@/constants/roles'

export const useAuth = defineStore('authStore', () => {
  const token = ref<string | null>(localStorage.getItem('authToken') || null)
  const role = ref<string>(localStorage.getItem('role') || ROLES.SLICER)
  const errorStore = useError()
  const phone = ref('')
  const countryIds = ref([
    {
      value: 1,
      label: 'Беларусь'
    },
    {
      value: 2,
      label: 'Россия'
    }
  ])

  const countryCodes = ref([
    {
      value: 1,
      label: '🇧🇾 +375'
    },
    {
      value: 2,
      label: '🇷🇺 +7'
    }
  ])

  const login = async ({ login, password }: IAuth): Promise<LoginResult | undefined> => {
    try {
      const { data } = await loginUser({ login, password })
      const { access_token } = data ?? {}
      if (access_token && data.role[0]) {
        token.value = access_token
        localStorage.setItem('authToken', access_token)
        role.value = data.role[0]
        if (role.value) localStorage.setItem('role', role.value.toString())
        return { token: token.value, role: role.value }
        // return { token: token.value, role: ROLES.ADMIN_FINANCE }
      }
      errorStore.setErrors('Ошибка авторизации')
      return
    } catch (error: any) {
      throw error?.response?.data?.message ?? ''
    }
  }

  const loginByPhone = async (data: IAuthByPhone) => {
    try {
      return await loginByPhoneQuery(data)
    } catch (error: any) {
      throw error?.response?.data?.message ?? ''
    }
  }

  const setPhone = (value: string) => {
    phone.value = value
  }

  // const getCountryCodes = async () => {
  //   try {
  //     const { data } = await getCountryCodesQuery()
  //     if (data.status === 'Success') {
  //       countryCodes.value = data?.data ?? []
  //       console.warn(countryCodes.value)
  //     }
  //   } catch (error: any) {
  //     throw error?.response?.data?.message ?? ''
  //   }
  // }

  const loginConfirmation = async (data: IAuthConfirmation) => {
    try {
      return await loginConfirmationQuery(data)
    } catch (error: any) {
      console.log('error', error)
      throw error?.response?.data?.message ?? error.message ?? ''
    }
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
  }

  return {
    login,
    logout,
    loginByPhone,
    loginConfirmation,
    // getCountryCodes,
    countryCodes,
    countryIds,
    role,
    token,
    setPhone,
    phone
  }
})
