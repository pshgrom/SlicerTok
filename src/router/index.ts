import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from "vue-router";
import LoginView from "@/views/LoginView.vue";
import LoginViewAdmin from "@/views/LoginViewAdmin.vue";
import UserInfo from "@/views/UserInfo.vue";
import Support from "@/views/SupportPage.vue";
import AdminInfo from "@/views/AdminInfo.vue";
import AdminInfoChecked from "@/views/AdminInfoChecked.vue";
import AdminPaymentsFinance from "@/views/AdminPaymentsFinance.vue";
import AdminMain from "@/views/AdminMain.vue";
import AdminMainLogs from "@/views/AdminMainLogs.vue";
import NotFound from "@/views/NotFound.vue";
import { ROLES, type RoleType } from "@/constants/roles";

// Типизация мета-полей роута
declare module "vue-router" {
  interface RouteMeta {
    requiresAuth: boolean;
    roles?: RoleType[];
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/login-admin",
    name: "LoginAdmin",
    component: LoginViewAdmin,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/admin-info",
    name: "AdminInfo",
    component: AdminInfo,
    meta: {
      requiresAuth: true,
      roles: [ROLES.ADMIN],
    },
  },
  {
    path: "/support",
    name: "Support",
    component: Support,
    meta: {
      requiresAuth: true,
      roles: [ROLES.SUPPORT],
    },
  },
  {
    path: "/admin-info-checked",
    name: "AdminInfoChecked",
    component: AdminInfoChecked,
    meta: {
      requiresAuth: true,
      roles: [ROLES.ADMIN],
    },
  },
  {
    path: "/admin-payments-finance",
    name: "AdminPaymentsFinance",
    component: AdminPaymentsFinance,
    meta: {
      requiresAuth: true,
      roles: [ROLES.ADMIN_FINANCE],
    },
  },
  {
    path: "/admin-main",
    name: "AdminMain",
    component: AdminMain,
    meta: {
      requiresAuth: true,
      roles: [ROLES.ADMIN_MAIN],
    },
  },
  {
    path: "/admin-main-logs",
    name: "AdminMainLogs",
    component: AdminMainLogs,
    meta: {
      requiresAuth: true,
      roles: [ROLES.ADMIN_MAIN],
    },
  },
  {
    path: "/user-info",
    name: "UserInfo",
    component: UserInfo,
    meta: {
      requiresAuth: true,
      roles: [ROLES.SLICER],
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL), // Используйте VITE_BASE_URL вместо VITE_API_URL для базового пути
  routes,
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role") as RoleType | null;
    const { requiresAuth, roles: allowedRoles } = to.meta;

    const adminRoles: RoleType[] = [
      ROLES.ADMIN,
      ROLES.ADMIN_FINANCE,
      ROLES.ADMIN_MAIN,
      ROLES.SUPPORT,
    ];

    if (requiresAuth && !token) {
      // Перенаправление на соответствующий логин в зависимости от требуемой роли
      const isAdminRoute = allowedRoles?.some((role) =>
        adminRoles.includes(role)
      );
      return next({ name: isAdminRoute ? "LoginAdmin" : "Login" });
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      // Если роль не соответствует требованиям маршрута
      return next({ name: "Login" });
    }

    next();
  }
);

export default router;
