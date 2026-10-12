import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../utils/authStorage";

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/LoginView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protege las rutas que requieren autenticación. Sin token, devuelve al login.
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: "login" };
  }
});

export default router;