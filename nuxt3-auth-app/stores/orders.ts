import { defineStore } from 'pinia';
import type { OrderWithProductNames } from '~/server/api/orders/[userId].get';
import { useAuthStore } from './auth';

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<OrderWithProductNames[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const authStore = useAuthStore();
  
  async function fetchUserOrders() {
    // Убедимся, что у нас есть авторизованный пользователь
    if (!authStore.isAuthenticated || !authStore.user) {
      error.value = 'Необходима авторизация для просмотра заказов';
      return;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // Получаем идентификатор пользователя из store auth
      // Соответствие между пользователями и ID в заказах:
      // David Jones (david.jones@creds.com) - используем ID 2
      // Samantha Robertson (sam.robertson@creds.com) - используем ID 3
      // Nicholas Crew (nic.crew@creds.com) - нет заказов
      
      let userId = 0;
      switch (authStore.user.username) {
        case 'david.jones@creds.com':
          userId = 2; // Заказы пользователя David Jones
          break;
        case 'sam.robertson@creds.com':
          userId = 3; // Заказы пользователя Samantha Robertson
          break;
        default:
          userId = 0;
      }
                     
      if (userId === 0) {
        error.value = 'У вас пока нет заказов';
        orders.value = [];
        return;
      }
      
      // Получаем заказы пользователя через API
      const data = await $fetch(`/api/orders/${userId}`);
      orders.value = data;
    } catch (err: any) {
      console.error('Ошибка загрузки заказов:', err);
      error.value = 'Не удалось загрузить данные о заказах';
      orders.value = [];
    } finally {
      loading.value = false;
    }
  }
  
  // Возвращаем отсортированные по дате заказы (новые вначале)
  const sortedOrders = computed(() => {
    return [...orders.value].sort((a, b) => {
      return new Date(b.order_date).getTime() - new Date(a.order_date).getTime();
    });
  });
  
  // Общая сумма всех заказов
  const totalOrdersAmount = computed(() => {
    return orders.value.reduce((sum, order) => sum + order.grand_total, 0);
  });
  
  // Количество заказов
  const ordersCount = computed(() => orders.value.length);
  
  return {
    orders,
    loading,
    error,
    fetchUserOrders,
    sortedOrders,
    totalOrdersAmount,
    ordersCount
  };
}); 