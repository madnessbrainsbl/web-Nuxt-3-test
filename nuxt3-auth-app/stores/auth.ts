import { defineStore } from 'pinia';
import type { UserSessionInfo } from '~/server/api/auth/login.post';

export const useAuthStore = defineStore('auth', () => {
    // Используем useCookie для сохранения сессии пользователя даже при обновлении страницы
    const user = useCookie<UserSessionInfo | null>('auth-user', { 
        maxAge: 60 * 60 * 24, // Срок действия куки в секундах (1 день)
        sameSite: 'strict'
    });
    const error = ref<string | null>(null);
    const loading = ref(false);

    // Вычисляемое свойство для проверки аутентификации
    const isAuthenticated = computed(() => !!user.value);

    async function login(credentials: { username: string; password: string }) {
        loading.value = true;
        error.value = null;
        
        try {
            // Используем $fetch для отправки запроса на API аутентификации
            const response = await $fetch('/api/auth/login', {
                method: 'POST',
                body: credentials,
            });

            if (response.user) {
                user.value = response.user; // Сохраняем данные пользователя в куки
                await navigateTo('/account'); // Перенаправляем на страницу аккаунта
            } else {
                error.value = 'Не удалось выполнить вход. Попробуйте еще раз.';
                user.value = null;
            }
        } catch (err: any) {
            console.error("Ошибка API авторизации:", err);
            // Используем сообщение об ошибке из API или стандартное
            error.value = err.data?.message || 'Введены неверные данные авторизации. Попробуйте ещё раз.';
            user.value = null; // Очищаем состояние пользователя при ошибке
        } finally {
            loading.value = false;
        }
    }

    async function logout() {
        console.log('Выход из системы...');
        user.value = null; // Очищаем куки
        await navigateTo('/login'); // Перенаправляем на страницу входа
    }

    // No explicit checkAuth needed, computed property handles it based on cookie

    return {
        user,
        isAuthenticated,
        error,
        loading,
        login,
        logout,
    };
}); 