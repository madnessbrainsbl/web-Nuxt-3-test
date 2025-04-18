import { useAuthStore } from '~/store';

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useAuthStore();
  
  // If user is not authenticated and trying to access protected route
  if (!store.isAuthenticated && to.path === '/account') {
    return navigateTo('/login');
  }
  
  // If user is authenticated and trying to access login page
  if (store.isAuthenticated && to.path === '/login') {
    return navigateTo('/account');
  }
}); 