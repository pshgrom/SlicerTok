import { ROLES } from '@/constants/roles.ts'

export const redirectByRole: Record<number, string> = {
  [ROLES.SLICER]: 'UserInfo',
  [ROLES.ADMIN]: 'AdminInfo',
  [ROLES.ADMIN_FINANCE]: 'AdminPaymentsFinance',
  [ROLES.ADMIN_MAIN]: 'AdminMain',
  [ROLES.STREAMER]: 'StreamerStats',
  [ROLES.SUPPORT]: 'Support'
}
