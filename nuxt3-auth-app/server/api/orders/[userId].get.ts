import { defineEventHandler, getRouterParam, createError } from 'h3';
import ordersData from '~/server/data/orders.json';
import productsData from '~/server/data/products.json';

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  product_name?: string;
}

export interface Order {
  id: number;
  user_id: number;
  order_date: string;
  status: string;
  items: OrderItem[];
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment_method: string;
  total: number;
  shipping_fee: number;
  tax: number;
  grand_total: number;
  tracking_number?: string;
}

export interface OrderWithProductNames extends Order {
  items: (OrderItem & { product_name: string })[];
}

export default defineEventHandler((event): OrderWithProductNames[] => {
  // Получаем ID пользователя из URL
  const userId = getRouterParam(event, 'userId');
  
  if (!userId || isNaN(Number(userId))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Недопустимый ID пользователя'
    });
  }

  // Фильтруем заказы по ID пользователя
  const userOrders = ordersData.filter(order => order.user_id === Number(userId));
  
  // Если заказов нет, возвращаем пустой массив
  if (userOrders.length === 0) {
    return [];
  }

  // Добавляем имена продуктов к каждому заказу
  const ordersWithProductNames = userOrders.map(order => {
    const orderWithNames = { ...order } as OrderWithProductNames;
    
    // Добавляем имена продуктов к элементам заказа
    orderWithNames.items = order.items.map(item => {
      const product = productsData.find(p => p.id === item.product_id);
      return {
        ...item,
        product_name: product ? product.name : 'Неизвестный продукт'
      };
    });
    
    return orderWithNames;
  });

  return ordersWithProductNames;
}); 