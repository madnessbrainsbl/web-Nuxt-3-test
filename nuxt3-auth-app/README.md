# Nuxt 3 Аутентификация - Личный кабинет

Это веб-приложение, разработанное с использованием Nuxt 3, TypeScript и SCSS. Оно демонстрирует функциональность аутентификации и личного кабинета пользователя с отображением заказов и возможностью их фильтрации.

## Функциональность

### Страница логина
- Форма аутентификации с валидацией полей
- Обработка ошибок аутентификации
- Защита от множественных попыток входа

### Личный кабинет пользователя
- Отображение информации о пользователе
- Просмотр истории заказов
- Фильтрация заказов по статусу и дате
- Отображение статистики (общее количество заказов, общая сумма)
- Возможность выхода из системы
- Защита маршрута для неавторизованных пользователей

### Сессии и авторизация
- Сохранение состояния сессии между перезагрузками страницы
- Управление данными пользователя через Pinia store
- API для проверки подлинности учетных данных

## Технологии
- **Nuxt 3**: Полноценный фреймворк для Vue.js
- **TypeScript**: Статическая типизация для повышения качества кода
- **SCSS**: Расширенные возможности стилизации компонентов
- **Pinia**: Управление состоянием приложения
- **JSON**: Использование статических JSON-файлов в качестве хранилища данных

## Установка и запуск

### Предварительные требования
- Node.js (рекомендуется версия 16 или выше)
- npm или yarn

### Шаги установки

1. Клонируйте репозиторий
```bash
git clone https://github.com/yourusername/nuxt3-auth-app.git
cd nuxt3-auth-app
```

2. Установите зависимости
```bash
npm install
# или
yarn install
```

3. Запустите приложение в режиме разработки
```bash
npm run dev
# или
yarn dev
```

4. Откройте http://localhost:3000 в вашем браузере

### Сборка для продакшн
```bash
npm run build
# или
yarn build
```

## Учетные данные для тестирования

В приложении настроены следующие тестовые учетные записи:

| Логин               | Пароль     | Роль    |
|---------------------|------------|---------|
| admin@example.com   | admin123   | Админ   |
| john.doe@example.com| user123    | Пользователь |
| jane.smith@example.com | manager123 | Менеджер |

## Структура проекта

```
nuxt3-auth-app/
├── components/       # Vue компоненты
├── pages/            # Страницы приложения
│   ├── index.vue     # Домашняя страница
│   ├── login.vue     # Страница логина
│   └── account.vue   # Личный кабинет
├── public/           # Статические ресурсы
│   └── data/         # Публичные JSON данные
├── server/           # Серверные функции
│   ├── api/          # API эндпоинты
│   └── data/         # Данные, доступные серверу
├── stores/           # Pinia хранилища
│   ├── auth.ts       # Хранилище аутентификации
│   ├── products.ts   # Хранилище продуктов
│   └── orders.ts     # Хранилище заказов
├── middleware/       # Промежуточное ПО Nuxt
└── nuxt.config.ts    # Конфигурация Nuxt
```

## API Endpoints

- **POST /api/auth/login** - Authenticates a user and returns session info
- **GET /api/products** - Returns a list of products with filtering capabilities

## Deployment to Production

To deploy this application to a production server, follow these steps:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set up server environment**:
   - Ensure Node.js (v16+) is installed on your server
   - Configure a reverse proxy (Nginx or Apache) to direct traffic to your application
   - Set up SSL certificates for HTTPS

3. **Deploy the built files**:
   - Upload the `.output` directory to your server
   - Install production dependencies: `npm install --production`

4. **Start the application**:
   ```bash
   node .output/server/index.mjs
   ```

5. **Configure process management**:
   - Use PM2 or similar tools to keep the application running
   - Set up auto-restart in case of crashes
   - Configure log rotation

## Implemented Features

- **Authentication System**: 
  Implemented a secure login system using cookies for session persistence, with password extraction from comments for demonstration purposes.

- **Data Filtering**: 
  Created a robust filtering system for products that allows filtering by creation date and multiple product names simultaneously.

- **Responsive Design**: 
  The application is fully responsive and works on both desktop and mobile devices, with appropriate UI adjustments.

- **Type Safety**: 
  Used TypeScript throughout the application to ensure type safety and better developer experience.

- **Session Persistence**: 
  Implemented session persistence using Nuxt's useCookie composable to maintain authenticated state across page refreshes.
