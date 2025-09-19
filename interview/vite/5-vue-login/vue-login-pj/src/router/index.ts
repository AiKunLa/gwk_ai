import { useUserStore } from "@/stores/userStore";
import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: {
      requireAuth: true,
    },
  },
];



const router = createRouter({
  history: createWebHistory(),
  routes,
});


// 全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requireAuth && !userStore.isLogin) {
    next("/login");
  } else {
    next();
  }
});

export default router;
