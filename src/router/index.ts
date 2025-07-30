import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalized,
  type NavigationGuardNext
} from 'vue-router'
import { useLoader } from '@/stores/GlobalLoader.ts'
// import LoginView from '@/views/LoginView.vue'
// import LoginViewAdmin from '@/views/LoginViewAdmin.vue'
import { ROLES, type RoleType } from '@/constants/roles'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
    roles?: RoleType[]
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
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/login-admin',
    name: 'LoginAdmin',
    component: () => import('@/views/LoginViewAdmin.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: '/admin-info',
    name: 'AdminInfo',
    component: () => import('@/views/AdminInfo.vue'),
    meta: {
      requiresAuth: true,
      roles: [ROLES.ADMIN]
    }
  },
  {
    path: '/support',
    name: 'Support',
    component: () => import('@/views/SupportPage.vue'),
    meta: {
      requiresAuth: true,
      roles: [ROLES.SUPPORT]
    }
  },
  {
    path: '/support-users',
    name: 'SupportUsers',
    component: () => import('@/views/SupportUsers.vue'),
    meta: {
      requiresAuth: true,
      roles: [ROLES.SUPPORT]
    }
  },
  {
    path: '/support-chat',
    name: 'SupportChat',
    component: () => import('@/views/SupportChatPage.vue'),
    meta: {
      requiresAuth: true,
      roles: [ROLES.SUPPORT]
    }
  },
  {
    path: '/admin-info-checked',
    name: 'AdminInfoChecked',
    component: () => import('@/views/AdminInfoChecked.vue'),
    meta: {
      requiresAuth: true,
      roles: [ROLES.ADMIN]
    }
  },
  {
    path: '/admin-payments-finance',
    name: 'AdminPaymentsFinance',
    component: () => import('@/views/AdminPaymentsFinance.vue'),
    meta: {
      requiresAuth: true,
      roles: [ROLES.ADMIN_FINANCE]
    }
  },
  {
    path: '/admin-main',
    name: 'AdminMain',
    component: () => import('@/views/AdminMain.vue'),
    meta: {
      requiresAuth: true,
      roles: [ROLES.ADMIN_MAIN]
    }
  },
  {
    path: '/admin-main-logs',
    name: 'AdminMainLogs',
    component: () => import('@/views/AdminMainLogs.vue'),
    meta: {
      requiresAuth: true,
      roles: [ROLES.ADMIN_MAIN]
    }
  },
  {
    path: '/user-info',
    name: 'UserInfo',
    component: () => import('@/views/UserInfo.vue'),
    meta: {
      requiresAuth: true,
      roles: [ROLES.SLICER]
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL), // Используйте VITE_BASE_URL вместо VITE_API_URL для базового пути
  routes
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const loader = useLoader()
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('role') as RoleType | null
    const { requiresAuth, roles: allowedRoles } = to.meta

    const adminRoles: RoleType[] = [
      ROLES.ADMIN,
      ROLES.ADMIN_FINANCE,
      ROLES.ADMIN_MAIN,
      ROLES.SUPPORT
    ]

    if (requiresAuth && !token) {
      // Перенаправление на соответствующий логин в зависимости от требуемой роли
      const isAdminRoute = allowedRoles?.some((role) => adminRoles.includes(role))
      return next({ name: isAdminRoute ? 'LoginAdmin' : 'Login' })
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      // Если роль не соответствует требованиям маршрута
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
