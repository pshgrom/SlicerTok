import { computed } from 'vue'

import { useAdminInfo, useAdminMain } from '@/entities/admin'
import { useAdminPaymentsFinance } from '@/entities/payment'
import { useStreamer } from '@/entities/streamer'
import { useSupport } from '@/entities/support'
import { useUserInfo } from '@/entities/user'
import { ROLES } from '@/shared/config'

export type TwoFactorRole = 'user' | 'admin' | 'support'

function resolveStore(role: TwoFactorRole) {
  switch (role) {
    case ROLES.SLICER:
      return useUserInfo()
    case ROLES.ADMIN:
      return useAdminInfo()
    case ROLES.SUPPORT:
      return useSupport()
    case ROLES.ADMIN_FINANCE:
      return useAdminPaymentsFinance()
    case ROLES.ADMIN_MAIN:
      return useAdminMain()
    case ROLES.STREAMER:
      return useStreamer()
    default:
      return useUserInfo()
  }
}

export function useTwoFactor(role: TwoFactorRole) {
  const store = resolveStore(role)

  return {
    isEnableGoogle2fa: computed({
      get: () => {
        return store.isEnableGoogle2fa
      },
      set: (val) => (store.isEnableGoogle2fa = val)
    }),
    checkCode: (code: string) => store.checkCode(code)
  }
}
