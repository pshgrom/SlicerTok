import { ROLES } from './roles'

export const redirectByRole: Record<string, string> = {
  [ROLES.SLICER]: 'UserInfo',
  [ROLES.ADMIN]: 'AdminInfo',
  [ROLES.ADMIN_FINANCE]: 'AdminPaymentsFinance',
  [ROLES.ADMIN_MAIN]: 'AdminMain',
  [ROLES.STREAMER]: 'StreamerStats',
  [ROLES.SUPPORT]: 'Support'
}
