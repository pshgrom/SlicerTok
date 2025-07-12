export const ROLES = {
  ADMIN: 'admin',
  ADMIN_FINANCE: 'admin_finance',
  SLICER: 'slicer',
  ADMIN_MAIN: 'admin_main',
  SUPPORT: 'admin_support'
}

export type RoleType = (typeof ROLES)[keyof typeof ROLES]
