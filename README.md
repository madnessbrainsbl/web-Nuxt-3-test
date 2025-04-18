# Nuxt 3 Authentication - Personal Account

This is a web application developed using Nuxt 3, TypeScript, and SCSS. It demonstrates user authentication functionality and a personal account dashboard with order display and filtering capabilities.

## Functionality

### Login Page
- Authentication form with field validation
- Authentication error handling
- Protection against multiple login attempts

### User Dashboard
- Display of user information
- Order history view
- Order filtering by status and date
- Statistics display (total number of orders, total amount)
- Logout functionality
- Route protection for unauthorized users

### Sessions and Authorization
- Session state persistence between page reloads
- User data management through Pinia store
- API for credential authentication

## Technologies
- **Nuxt 3**: Full-featured framework for Vue.js
- **TypeScript**: Static typing for improved code quality
- **SCSS**: Advanced component styling capabilities
- **Pinia**: Application state management
- **JSON**: Using static JSON files as data storage

## Installation and Launch

### Prerequisites
- Node.js (version 16 or higher recommended)
- npm or yarn

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/madnessbrainsbl/web-Nuxt-3-test.git
cd nuxt3-auth-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the application in development mode
```bash
npm run dev
# or
yarn dev
```

4. Open http://localhost:3000 in your browser

### Production Build
```bash
npm run build
# or
yarn build
```

## Test Credentials

The following test accounts are configured in the application:

| Login                 | Password     | Role      |
|-----------------------|--------------|-----------|
| david.jones@creds.com | 8u3&s-1uda   | User      |
| sam.robertson@creds.com | 0k91sa639  | Manager   |
| nic.crew@creds.com    | 1atr48asf03  | User (inactive) |

## Project Structure

```
nuxt3-auth-app/
├── components/       # Vue components
├── pages/            # Application pages
│   ├── index.vue     # Home page
│   ├── login.vue     # Login page
│   └── account.vue   # Personal account
├── public/           # Static resources
│   └── data/         # Public JSON data
├── server/           # Server functions
│   ├── api/          # API endpoints
│   └── data/         # Server-accessible data
├── stores/           # Pinia stores
│   ├── auth.ts       # Authentication store
│   ├── products.ts   # Products store
│   └── orders.ts     # Orders store
├── middleware/       # Nuxt middleware
└── nuxt.config.ts    # Nuxt configuration
```

## API Endpoints

- **POST /api/auth/login** - Authenticates a user and returns session info
- **GET /api/products** - Returns a list of products with filtering capabilities
- **GET /api/orders/[userId]** - Returns orders for a specific user

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
  Created a robust filtering system for orders that allows filtering by status and date range.

- **Responsive Design**: 
  The application is fully responsive and works on both desktop and mobile devices, with appropriate UI adjustments.

- **Type Safety**: 
  Used TypeScript throughout the application to ensure type safety and better developer experience.

- **Session Persistence**: 
  Implemented session persistence using Nuxt's useCookie composable to maintain authenticated state across page refreshes.
