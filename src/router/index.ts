import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw
} from 'vue-router'

import { ROLES, type RoleType } from '@/constants/roles'
import { useLoader } from '@/stores/GlobalLoader.ts'
import AdminInfo from '@/views/AdminInfo.vue'
import AdminMain from '@/views/AdminMain.vue'
import AdminPaymentsFinance from '@/views/AdminPaymentsFinance.vue'
import AdminPaymentsFinished from '@/views/AdminPaymentsFinished.vue'
import AdminProcessPayments from '@/views/AdminProcessPayments.vue'
import LoginView from '@/views/LoginView.vue'
import LoginViewAdmin from '@/views/LoginViewAdmin.vue'
import SupportPage from '@/views/SupportPage.vue'
import UserInfo from '@/views/UserInfo.vue'

// Расширяем типы meta
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
    redirect: '/login'
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
    component: () => import('@/views/NotFound.vue'),
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
    component: () => import('@/views/CurrentUser.vue'),
    meta: { requiresAuth: true, roles: [ROLES.SUPPORT], showChat: false }
  },
  {
    path: '/support-users',
    name: 'SupportUsers',
    component: () => import('@/views/SupportUsers.vue'),
    meta: { requiresAuth: true, roles: [ROLES.SUPPORT], showChat: false }
  },
  {
    path: '/support-chat/:id?',
    name: 'SupportChat',
    component: () => import('@/views/SupportChatPage.vue'),
    meta: { requiresAuth: true, roles: [ROLES.SUPPORT], showChat: false }
  },
  {
    path: '/admin-info-checked',
    name: 'AdminInfoChecked',
    component: () => import('@/views/AdminInfoChecked.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN], showChat: true }
  },
  {
    path: '/admin-payments-finance',
    name: 'AdminPaymentsFinance',
    component: AdminPaymentsFinance,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_FINANCE], showChat: true }
  },
  {
    path: '/admin-process-payments',
    name: 'AdminProcessPayments',
    component: AdminProcessPayments,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_FINANCE], showChat: true }
  },
  {
    path: '/admin-finished-list',
    name: 'AdminPaymentsFinished',
    component: AdminPaymentsFinished,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_FINANCE], showChat: true }
  },
  {
    path: '/admin-main',
    name: 'AdminMain',
    component: AdminMain,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_MAIN], showChat: false }
  },
  {
    path: '/coefficients',
    name: 'AdminCoeff',
    component: () => import('@/views/AdminCoeff.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_MAIN], showChat: false }
  },
  {
    path: '/admins-online',
    name: 'AdminsOnlinePage',
    component: () => import('@/views/AdminsOnlinePage.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_MAIN], showChat: false }
  },
  {
    path: '/admin-main-logs',
    name: 'AdminMainLogs',
    component: () => import('@/views/AdminMainLogs.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_MAIN], showChat: false }
  },
  {
    path: '/user-info',
    name: 'UserInfo',
    component: UserInfo,
    meta: { requiresAuth: true, roles: [ROLES.SLICER], showChat: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const loader = useLoader()
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role') as RoleType | null
    const { requiresAuth, roles: allowedRoles } = to.meta || {}

    const adminRoles: RoleType[] = [
      ROLES.ADMIN,
      ROLES.ADMIN_FINANCE,
      ROLES.ADMIN_MAIN,
      ROLES.SUPPORT
    ]

    if (requiresAuth && !token) {
      const isAdminRoute = allowedRoles?.some((role) => adminRoles.includes(role))
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
