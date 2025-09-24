import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw
} from 'vue-router'

import { ROLES, type RoleType } from '@/constants/roles'
import { useLoader } from '@/stores/GlobalLoader.ts'
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
    component: () => import('@/views/LoginView.vue'), // lazy-load
    // component: LoginView,
    meta: { showChat: false }
  },
  {
    path: '/login-admin',
    name: 'LoginAdmin',
    component: () => import('@/views/LoginViewAdmin.vue'), // lazy-load
    // component: () => LoginViewAdmin, // lazy-load
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
    component: () => import('@/views/AdminInfo.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN], showChat: true }
  },
  {
    path: '/support',
    name: 'Support',
    component: () => import('@/views/SupportPage.vue'),
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
    component: () => import('@/views/AdminPaymentsFinance.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_FINANCE], showChat: true }
  },
  {
    path: '/admin-main',
    name: 'AdminMain',
    component: () => import('@/views/AdminMain.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_MAIN], showChat: false }
  },
  {
    path: '/coefficients',
    name: 'AdminCoeff',
    component: () => import('@/views/AdminCoeff.vue'),
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
    // component: () => import('@/views/UserInfo.vue'),
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
