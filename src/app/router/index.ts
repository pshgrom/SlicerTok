import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw
} from 'vue-router'

import { useLoader } from '@/app/stores'
import { useStreamers } from '@/entities/streamer'
import AdminInfo from '@/pages/admin-info'
import Landing from '@/pages/landing'
import LoginView from '@/pages/login'
import LoginViewAdmin from '@/pages/login-admin'
import Streamer from '@/pages/streamer'
import SupportPage from '@/pages/support'
import UserInfo from '@/pages/user-info'
import { ROLES, type RoleType } from '@/shared/config'
import { redirectByRole } from '@/shared/config'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: RoleType[]
    showChat?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
    meta: { showChat: false }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/pages/terms'),
    meta: { showChat: false }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('@/pages/privacy-policy'),
    meta: { showChat: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { showChat: false }
  },
  {
    path: '/login-admin',
    name: 'LoginAdmin',
    component: LoginViewAdmin,
    meta: { showChat: false }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@/pages/not-found'),
    meta: { showChat: false }
  },
  {
    path: '/admin-info',
    name: 'AdminInfo',
    component: AdminInfo,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN], showChat: true }
  },
  {
    path: '/support',
    name: 'Support',
    component: SupportPage,
    meta: { requiresAuth: true, roles: [ROLES.SUPPORT], showChat: false }
  },
  {
    path: '/slicer/:id',
    name: 'User',
    component: () => import('@/pages/current-user'),
    meta: { requiresAuth: true, roles: [ROLES.SUPPORT], showChat: false }
  },
  {
    path: '/admin-main',
    name: 'AdminMain',
    component: () => import('@/pages/admin-main'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_MAIN], showChat: false }
  },
  {
    path: '/admin-main/:streamerId/admins',
    name: 'StreamerAdmins',
    component: () => import('@/pages/streamer-admins'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_MAIN], showChat: false }
  },
  {
    path: '/admin-main/:streamerId/admins/:adminId/stats',
    name: 'AdminStats',
    component: () => import('@/pages/admin-stats'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_MAIN], showChat: false }
  },
  {
    path: '/support-users',
    name: 'SupportUsers',
    component: () => import('@/pages/support-users'),
    meta: { requiresAuth: true, roles: [ROLES.SUPPORT], showChat: false }
  },
  {
    path: '/support-chat/:id?',
    name: 'SupportChat',
    component: () => import('@/pages/support-chat'),
    meta: { requiresAuth: true, roles: [ROLES.SUPPORT], showChat: false }
  },
  {
    path: '/admin-info-checked',
    name: 'AdminInfoChecked',
    component: () => import('@/pages/admin-info-checked'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN], showChat: true }
  },
  {
    path: '/admin-payments-finance',
    name: 'AdminPaymentsFinance',
    component: () => import('@/pages/admin-payments-finance'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_FINANCE], showChat: true }
  },
  {
    path: '/admin-process-payments',
    name: 'AdminProcessPayments',
    component: () => import('@/pages/admin-process-payments'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_FINANCE], showChat: true }
  },
  {
    path: '/admin-finished-list',
    name: 'AdminPaymentsFinished',
    component: () => import('@/pages/admin-payments-finished'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_FINANCE], showChat: true }
  },
  {
    path: '/streamer',
    name: 'Streamer',
    component: Streamer,
    meta: { requiresAuth: true, roles: [ROLES.STREAMER], showChat: false }
  },
  {
    path: '/streamer-coefficients',
    name: 'AdminCoeff',
    component: () => import('@/pages/admin-coeff'),
    meta: { requiresAuth: true, roles: [ROLES.STREAMER], showChat: false }
  },
  {
    path: '/streamer-stats',
    name: 'StreamerStats',
    component: () => import('@/pages/streamer-stats'),
    meta: { requiresAuth: true, roles: [ROLES.STREAMER], showChat: false }
  },
  {
    path: '/streamer-logs',
    name: 'AdminStreamerLogs',
    component: () => import('@/pages/streamer-logs'),
    meta: { requiresAuth: true, roles: [ROLES.STREAMER], showChat: false }
  },
  {
    path: '/user-info',
    name: 'UserInfo',
    component: UserInfo,
    meta: { requiresAuth: true, roles: [ROLES.SLICER], showChat: true }
  }
]

const router = createRouter({
  history: createWebHistory((import.meta.env.VITE_BASE_URL as string) || '/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { left: 0, top: 0 }
  }
})

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const loader = useLoader()
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role') as RoleType | null
    const { requiresAuth, roles: allowedRoles } = to.meta || {}

    const adminRoles: RoleType[] = [
      ROLES.ADMIN,
      ROLES.ADMIN_FINANCE,
      ROLES.ADMIN_MAIN,
      ROLES.SUPPORT,
      ROLES.STREAMER
    ]

    if (token) {
      const streamers = useStreamers()
      if (!streamers.streamersLoaded) {
        try {
          await streamers.getStreamerList()
        } catch (e) {
          console.error('Ошибка загрузки стримеров', e)
        }
      }
    }

    const isAuthPage = to.name === 'Login' || to.name === 'LoginAdmin' || to.path === '/'

    if (token && role && isAuthPage) {
      const redirectRoute = redirectByRole[role]

      if (redirectRoute) {
        return next({ name: redirectRoute })
      }

      return next({ name: 'Login' })
    }

    if (requiresAuth && !token) {
      const isAdminRoute = allowedRoles?.some((r) => adminRoles.includes(r))
      return next({ name: isAdminRoute ? 'LoginAdmin' : 'Login' })
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      return next({ name: 'Login' })
    }

    loader.start()
    next()
  }
)

router.afterEach(() => {
  const loader = useLoader()
  setTimeout(() => loader.stop(), 200)
})

export default router
