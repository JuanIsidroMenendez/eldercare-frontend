import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../utils/authStorage";

const routes = [
  { path: "/", redirect: "/residents" },

  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/LoginView.vue"),
  },

  {
    path: "/",
    component: () => import("../layouts/AdminLayout.vue"),
    children: [
      {
        path: "residents",
        name: "residents",
        component: () => import("../views/residents/ResidentsView.vue"),
        meta: { requiresAuth: true },
      },
    ],   
  },     
];      

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: "login" };
  }
});

export default router;