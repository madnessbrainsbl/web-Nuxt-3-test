import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return;

    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
        console.log('Auth middleware: Not authenticated, redirecting to /login');
        return navigateTo('/login');
    }
    console.log('Auth middleware: Authenticated, allowing access to', to.path);
}); 