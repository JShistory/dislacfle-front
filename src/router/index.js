import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/user/LoginView.vue';
import Signup from '@/views/user/SignupView.vue';
import { useAuthStore } from '@/store';

const routes = [
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // ✅ 토큰이 있고, user가 없으면 복구 시도
  if (authStore.token && !authStore.user) {
    authStore.setUserFromToken();
  }

  // ✅ 인증이 필요한 페이지 접근 시 체크
  if (to.meta.requiresAuth && !authStore.token) {
    next('/'); // 🔒 로그인 안 된 경우 로그인 페이지로 이동
  } 
  // ✅ 회원가입 페이지는 로그인 체크 예외 처리
  else if (to.path === '/signup') {
    next();
  } 
  else {
    next();
  }
});

export default router;
