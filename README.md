# Nuxt 3 Authentication App

A web application built with Nuxt 3 featuring user authentication and product/order data management.

## Features

- User authentication with session persistence
- Account dashboard with user data display
- Data filtering by creation date and product name
- Responsive design using SCSS
- TypeScript for enhanced development
- Pinia for state management

## Demo

- Login page: User enters credentials, system validates data
- Account dashboard: Displays list of orders/products with filtering capabilities
- Session persists after page refresh
- Logout functionality removes user session

## Installation

```bash
# Clone the repository
git clone https://github.com/madnessbrainsbl/web-Nuxt-3-test.git

# Navigate to project directory
cd web-Nuxt-3-test

# Install dependencies
npm install

# Launch development server
npm run dev
```

## Production Setup

```bash
# Build for production
npm run build

# Launch production server
npm run start
```

## Tech Stack

- [Nuxt 3](https://nuxt.com/) - Vue.js framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Pinia](https://pinia.vuejs.org/) - State management
- [SCSS](https://sass-lang.com/) - CSS preprocessor
- [Nuxt UI](https://ui.nuxt.com/) - UI components for Nuxt

## Deployment Process

To deploy the application on a production server:

1. Configure environment variables (.env)
2. Build the project (`npm run build`)
3. Use PM2 or another process manager to manage the application
4. Configure Nginx as a reverse proxy

## Implemented Functions

- User authentication with session storage in cookies
- Protected routes using middleware
- Client-side data filtering
- Record sorting by various fields
- Responsive design for mobile devices

## License

[MIT](https://opensource.org/licenses/MIT)
