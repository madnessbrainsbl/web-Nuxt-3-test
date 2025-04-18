<template>
  <div class="account-container">
    <!-- Шапка с кнопкой выхода -->
    <header class="account-header">
      <h1>Личный кабинет</h1>
      <div v-if="authStore.user" class="user-info">
        <p>Добро пожаловать, {{ authStore.user.name }} {{ authStore.user.surname }}</p>
        <p>Логин: {{ authStore.user.username }}</p>
        <p>Дата регистрации: {{ authStore.user.created }}</p>
        <button class="logout-btn" @click="handleLogout">Выход</button>
      </div>
    </header>

    <!-- Блок статистики заказов -->
    <div class="stats-section" v-if="ordersStore.ordersCount > 0">
      <div class="stat-card">
        <h3>Всего заказов</h3>
        <p class="stat-value">{{ ordersStore.ordersCount }}</p>
      </div>
      <div class="stat-card">
        <h3>Общая сумма</h3>
        <p class="stat-value">{{ formatPrice(ordersStore.totalOrdersAmount) }}</p>
      </div>
    </div>

    <!-- Блок фильтрации -->
    <div class="filter-section" v-if="ordersStore.ordersCount > 0">
      <h2 class="filter-title">ФИЛЬТР ЗАКАЗОВ</h2>
      <div class="filter-content">
        <!-- Фильтр по статусу заказа -->
        <div class="filter-group">
          <label for="status-filter">Статус заказа:</label>
          <select 
            id="status-filter" 
            v-model="filterStatus" 
            class="status-input"
          >
            <option value="">Все статусы</option>
            <option value="pending">В обработке</option>
            <option value="processing">Обработка</option>
            <option value="shipped">Отправлен</option>
            <option value="delivered">Доставлен</option>
          </select>
        </div>

        <!-- Фильтр по дате (от-до) -->
        <div class="filter-group">
          <label for="date-filter-from">Период:</label>
          <div class="date-range">
            <input 
              type="date" 
              id="date-filter-from" 
              v-model="filterDateFrom" 
              class="date-input"
              placeholder="От"
            />
            <span>—</span>
            <input 
              type="date" 
              id="date-filter-to" 
              v-model="filterDateTo" 
              class="date-input"
              placeholder="До"
            />
          </div>
        </div>

        <!-- Кнопка сброса фильтров -->
        <div class="filter-group">
          <button @click="clearFilters" class="reset-btn">
            Сбросить фильтры
          </button>
        </div>
      </div>
    </div>

    <!-- Таблица с заказами -->
    <div class="table-section">
      <div v-if="ordersStore.loading" class="loading">
        <p>Загрузка данных о заказах...</p>
      </div>
      <div v-else-if="ordersStore.error" class="error-message">
        <p>{{ ordersStore.error }}</p>
      </div>
      <div v-else-if="ordersStore.orders.length === 0" class="empty-message">
        <p>У вас пока нет заказов</p>
      </div>
      <div v-else-if="filteredOrders.length === 0" class="empty-message">
        <p>Нет заказов, соответствующих выбранным фильтрам</p>
      </div>
      <div v-else>
        <!-- Таблица заказов -->
        <table class="data-table">
          <thead>
            <tr>
              <th>ID заказа</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Товары</th>
              <th>Сумма</th>
              <th>Доставка</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id" :class="getOrderStatusClass(order.status)">
              <td>{{ order.id }}</td>
              <td>{{ formatDate(order.order_date) }}</td>
              <td>{{ translateStatus(order.status) }}</td>
              <td>
                <ul class="order-items">
                  <li v-for="item in order.items" :key="item.product_id">
                    {{ item.product_name }} ({{ item.quantity }} шт.)
                  </li>
                </ul>
              </td>
              <td>{{ formatPrice(order.grand_total) }}</td>
              <td>
                <span v-if="order.tracking_number">
                  Трек: {{ order.tracking_number }}
                </span>
                <span v-else>
                  {{ order.shipping_address.city }}, {{ order.shipping_address.street }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useOrdersStore } from '~/stores/orders';

definePageMeta({
  middleware: ['auth-only'] // Защита страницы
});

const authStore = useAuthStore();
const ordersStore = useOrdersStore();

// Состояние фильтров
const filterStatus = ref('');
const filterDateFrom = ref('');
const filterDateTo = ref('');

// Загрузка данных при монтировании компонента
onMounted(async () => {
  await ordersStore.fetchUserOrders();
});

// Фильтрация заказов
const filteredOrders = computed(() => {
  let filtered = [...ordersStore.sortedOrders];
  
  // Фильтр по статусу
  if (filterStatus.value) {
    filtered = filtered.filter(order => order.status === filterStatus.value);
  }
  
  // Фильтр по дате (от)
  if (filterDateFrom.value) {
    const fromDate = new Date(filterDateFrom.value + 'T00:00:00Z');
    filtered = filtered.filter(order => new Date(order.order_date) >= fromDate);
  }
  
  // Фильтр по дате (до)
  if (filterDateTo.value) {
    const toDate = new Date(filterDateTo.value + 'T23:59:59Z');
    filtered = filtered.filter(order => new Date(order.order_date) <= toDate);
  }
  
  return filtered;
});

// Сброс всех фильтров
const clearFilters = () => {
  filterStatus.value = '';
  filterDateFrom.value = '';
  filterDateTo.value = '';
};

// Обработчик выхода из системы
const handleLogout = async () => {
  await authStore.logout();
};

// Перевод статуса заказа на русский
const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'В обработке',
    'processing': 'Обработка',
    'shipped': 'Отправлен',
    'delivered': 'Доставлен'
  };
  return statusMap[status] || status;
};

// Получение класса в зависимости от статуса заказа
const getOrderStatusClass = (status: string): string => {
  return `order-status-${status}`;
};

// Форматирование даты для отображения
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Некорректная дата';
  }
};

// Форматирование цены
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  }).format(price);
};
</script>

<style lang="scss" scoped>
.account-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

// Стили для шапки и информации о пользователе
.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 24px;
    margin: 0;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    
    p {
      margin: 0 0 10px;
    }
  }
  
  .logout-btn {
    background-color: #c82333;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #a71d2a;
    }
  }
}

// Стили для блока статистики
.stats-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  
  .stat-card {
    flex: 1;
    background-color: #f0f8e6;
    border: 1px solid #9cc11c;
    border-radius: 6px;
    padding: 15px;
    text-align: center;
    
    h3 {
      margin-top: 0;
      color: #4a6212;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #9cc11c;
      margin: 10px 0 0;
    }
  }
}

// Стили для блока фильтрации
.filter-section {
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  
  .filter-title {
    background-color: #9cc11c;
    color: white;
    margin: 0;
    padding: 10px 15px;
    font-size: 18px;
    text-align: center;
  }
  
  .filter-content {
    display: flex;
    flex-wrap: wrap;
    padding: 15px;
    background-color: #f9f9f9;
    
    .filter-group {
      flex: 1 1 250px;
      margin: 0 10px 15px;
      
      label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
      }
      
      .status-input, .date-input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .date-range {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .date-input {
          flex: 1;
        }
      }
      
      .reset-btn {
        padding: 8px 16px;
        background-color: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 25px;
        
        &:hover {
          background-color: #5a6268;
        }
      }
    }
  }
}

// Стили для таблицы данных
.table-section {
  .loading, .error-message, .empty-message {
    text-align: center;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }
  
  .error-message {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 12px 15px;
      text-align: left;
      border: 1px solid #e0e0e0;
    }
    
    th {
      background-color: #9cc11c;
      color: white;
      font-weight: bold;
    }
    
    .order-status-pending {
      background-color: #fff3cd;
    }
    
    .order-status-processing {
      background-color: #d1ecf1;
    }
    
    .order-status-shipped {
      background-color: #e8f0db;
    }
    
    .order-status-delivered {
      background-color: #d4edda;
    }
    
    tr:hover {
      filter: brightness(0.95);
    }
    
    .order-items {
      margin: 0;
      padding-left: 18px;
      
      li {
        margin-bottom: 4px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// Адаптивность для мобильных устройств
@media (max-width: 768px) {
  .account-header {
    flex-direction: column;
    align-items: flex-start;
    
    .user-info {
      margin-top: 15px;
      align-items: flex-start;
    }
  }
  
  .stats-section {
    flex-direction: column;
  }
  
  .filter-content {
    flex-direction: column;
    
    .filter-group {
      margin: 0 0 15px;
    }
  }
  
  .data-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style> 