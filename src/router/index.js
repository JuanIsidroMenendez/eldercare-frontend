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
      // NO HABÍA ENRUTADO!
      {
        path: "residents/new",
        name: "resident-new",
        component: () => import("../views/residents/ResidentFormView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "residents/:id",
        name: "resident-detail",
        component: () => import("../views/residents/ResidentDetailView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "residents/:id/edit",
        name: "resident-edit",
        component: () => import("../views/residents/ResidentFormView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "rooms",
        name: "rooms",
        component: () => import("../views/rooms/RoomsView.vue"),
        meta: { requiresAuth: true },
      }
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