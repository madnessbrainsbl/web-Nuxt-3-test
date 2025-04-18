import { defineEventHandler } from 'h3'
import products from '~/server/data/products.json'

export interface Product {
  id: number;
  status: string;
  date_created: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export default defineEventHandler((): Product[] => {
  // Имитация задержки API для демонстрации состояния загрузки
  // В реальном проекте здесь был бы запрос к базе данных или внешнему API
  return products;
}); 