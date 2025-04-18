import { defineStore } from 'pinia';
import type { Product } from '~/server/api/products.get';

export const useProductsStore = defineStore('products', () => {
    const allProducts = ref<Product[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Состояние фильтров
    const filterDate = ref<string | null>(null); // Хранит дату в формате YYYY-MM-DD
    const filterNames = ref<string[]>([]); // Хранит выбранные названия продуктов

    async function fetchProducts() {
        if (allProducts.value.length > 0) return; // Избегаем повторной загрузки

        loading.value = true;
        error.value = null;
        try {
            const data = await $fetch('/api/products');
            allProducts.value = data;
        } catch (err: any) {
            console.error("Ошибка загрузки продуктов:", err);
            error.value = 'Не удалось загрузить данные о продуктах.';
            allProducts.value = [];
        } finally {
            loading.value = false;
        }
    }

    // Получение уникальных имен продуктов для селектора
    const uniqueProductNames = computed(() => {
        const names = new Set(allProducts.value.map(p => p.name));
        return Array.from(names).sort();
    });

    // Фильтрация продуктов на основе выбранных фильтров
    const filteredProducts = computed(() => {
        let products = [...allProducts.value];

        // Применение фильтра по дате (сравниваем только часть с датой, игнорируем время)
        if (filterDate.value) {
            const filterDateObj = new Date(filterDate.value + 'T00:00:00Z');
            const filterDateOnly = filterDateObj.toISOString().split('T')[0];
            products = products.filter(p => {
                try {
                    const productDateOnly = new Date(p.date_created).toISOString().split('T')[0];
                    return productDateOnly === filterDateOnly;
                } catch (e) {
                    console.warn(`Некорректный формат даты для продукта ${p.id}: ${p.date_created}`);
                    return false;
                }
            });
        }

        // Применение фильтра по названию (мульти-выбор)
        if (filterNames.value.length > 0) {
            const selectedNamesSet = new Set(filterNames.value);
            products = products.filter(p => selectedNamesSet.has(p.name));
        }

        return products;
    });

    // Сброс всех фильтров
    function clearFilters() {
        filterDate.value = null;
        filterNames.value = [];
    }

    return {
        allProducts,
        loading,
        error,
        filteredProducts,
        fetchProducts,
        // Фильтры
        filterDate,
        filterNames,
        uniqueProductNames,
        clearFilters,
    };
}); 