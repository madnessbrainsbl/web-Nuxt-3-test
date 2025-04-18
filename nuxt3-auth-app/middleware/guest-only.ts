import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return;

    const authStore = useAuthStore();

    if (authStore.isAuthenticated) {
        console.log('Guest middleware: Authenticated, redirecting to /account');
        return navigateTo('/account');
    }
    console.log('Guest middleware: Not authenticated, allowing access to', to.path);
}); 