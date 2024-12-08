import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Orders from '@/views/Orders.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/orders', name: 'Orders', component: Orders, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
