import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
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
import { ROLES } from "@/constants/roles";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  { path: "/login", name: "Login", component: LoginView },
  { path: "/login-admin", name: "LoginAdmin", component: LoginViewAdmin },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/admin-info",
    name: "AdminInfo",
    component: AdminInfo,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN] },
  },
  {
    path: "/support",
    name: "Support",
    component: Support,
    meta: { requiresAuth: true, roles: [ROLES.SUPPORT] },
  },
  {
    path: "/admin-info-checked",
    name: "AdminInfoChecked",
    component: AdminInfoChecked,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN] },
  },
  {
    path: "/admin-payments-finance",
    name: "AdminPaymentsFinance",
    component: AdminPaymentsFinance,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_FINANCE] },
  },
  {
    path: "/admin-main",
    name: "AdminMain",
    component: AdminMain,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_MAIN] },
  },
  {
    path: "/admin-main-logs",
    name: "AdminMainLogs",
    component: AdminMainLogs,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN_MAIN] },
  },
  {
    path: "/user-info",
    name: "UserInfo",
    component: UserInfo,
    meta: { requiresAuth: true, roles: [ROLES.SLICER] },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  const requiresAuth = to.meta.requiresAuth as boolean;
  const allowedRoles = to.meta.roles as string[] | undefined;
  const rolesToCheck = [
    ROLES.ADMIN,
    ROLES.ADMIN_FINANCE,
    ROLES.ADMIN_MAIN,
    ROLES.SUPPORT,
  ];

  if (requiresAuth && !token) {
    // Если страница требует авторизации, но юзер не залогинен
    if (allowedRoles?.some((role) => rolesToCheck.includes(role))) {
      return next({ name: "LoginAdmin" });
    }
    return next({ name: "Login" });
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    // Если роль не подходит
    return next({ name: "Login" });
  }

  return next();
});

export default router;
