# WebPhotography Studio Booking, Portfolio & Payment System

A complete, production-ready web application for photography studios to manage bookings, display portfolios, and process payments. Built with **Laravel API**, **Vite + React**, and **Supabase PostgreSQL**.

## 🎯 Quick Start

### Prerequisites
- PHP 8.1+
- Node.js 18+
- PostgreSQL (Supabase)
- Composer
- npm

### Backend Setup (Laravel)
```bash
cd backend
composer install

# Update .env with your Supabase credentials
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations (when connected to Supabase)
php artisan migrate

# Seed sample data (optional)
php artisan db:seed

# Start Laravel server
php artisan serve
# Opens on http://localhost:8000
```

### Frontend Setup (Vite + React)
```bash
cd frontend
npm install

# Update .env with API URL if different
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
# Opens on http://localhost:5173
```

### Build for Production
```bash
# Frontend
npm run build
# Outputs to dist/

# Backend
# Deploy using standard Laravel hosting (Laravel Forge, Heroku, etc.)
```

---

## Full Technical Documentation

## 1. Database Schema
Please refer to `database/schema.sql` for the complete Supabase PostgreSQL schema. The schema covers `users`, `services`, `portfolios`, `bookings`, `payments`, `add_ons`, and `booking_addons` with appropriate normalized relationships using UUIDs.

## 2. Backend Architecture (Laravel API)

### Structure
```
app/
 ├── Http/
 │    ├── Controllers/
 │    │    ├── AuthController.php
 │    │    ├── BookingController.php
 │    │    ├── PaymentController.php
 │    │    ├── PortfolioController.php
 │    │    └── ServiceController.php
 │    ├── Middleware/
 │    │    ├── AdminMiddleware.php (Role check)
 │    │    └── ClientMiddleware.php
 │    └── Requests/
 │         ├── StoreBookingRequest.php
 │         └── UpdateBookingRequest.php
 ├── Models/
 │    ├── User.php
 │    ├── Booking.php
 │    ├── Service.php
 │    ├── Portfolio.php
 │    ├── Payment.php
 │    └── AddOn.php
```

### Route Design (`routes/api.php`)
```php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Client specific
    Route::middleware('role:client')->group(function () {
        Route::get('/client/portfolio', [PortfolioController::class, 'index']);
        Route::get('/client/services', [ServiceController::class, 'index']);
        Route::apiResource('/client/bookings', BookingController::class);
        Route::post('/client/payments', [PaymentController::class, 'store']);
    });
    
    // Admin specific
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('/admin/services', ServiceController::class);
        Route::apiResource('/admin/portfolio', PortfolioController::class);
        Route::get('/admin/bookings', [BookingController::class, 'indexAll']);
        Route::patch('/admin/bookings/{id}/status', [BookingController::class, 'updateStatus']);
        Route::get('/admin/users', [AuthController::class, 'index']);
        Route::get('/admin/reports', [PaymentController::class, 'reports']);
    });
});
```

## 3. Frontend Architecture (Vite + React)

### Folder Structure
```
src/
 ├── assets/
 ├── components/
 │    ├── common/ (Button, Input, Modal, Loader)
 │    ├── layout/ (Sidebar, Topbar)
 │    └── booking/ (CalendarPicker, ServiceCard, CheckoutSummary)
 ├── contexts/ (AuthContext)
 ├── hooks/ (useAuth, useBookings, useApi)
 ├── pages/
 │    ├── auth/
 │    │    ├── Login.jsx
 │    │    └── Register.jsx
 │    ├── client/
 │    │    ├── Dashboard.jsx
 │    │    ├── PortfolioGallery.jsx
 │    │    ├── Services.jsx
 │    │    ├── MyBookings.jsx
 │    │    └── Checkout.jsx
 │    └── admin/
 │         ├── AdminDashboard.jsx
 │         ├── ManageServices.jsx
 │         ├── ManagePortfolio.jsx
 │         ├── BookingManager.jsx
 │         └── RevenueReports.jsx
 ├── services/ (api.js - Axios config)
 ├── utils/ (dateFormatter.js, priceCalc.js)
 ├── App.jsx
 └── main.jsx
```

## 4. API Integration (React Axios)

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to attach JWT token (or Supabase Token)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

```javascript
// src/services/bookingService.js
import api from './api';

export const createBooking = async (bookingData) => {
    const response = await api.post('/client/bookings', bookingData);
    return response.data;
};

export const fetchClientBookings = async () => {
    const response = await api.get('/client/bookings');
    return response.data;
};
```

## 5. UI Layout Structure (Tailwind CSS)

**Client Dashboard Layout (`src/components/layout/ClientLayout.jsx`):**
```jsx
export const ClientLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col hidden md:flex">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">PhotoStudio</h2>
        <nav className="flex-1 space-y-4">
          <Link to="/client/dashboard" className="block text-gray-600 hover:text-blue-600">Dashboard</Link>
          <Link to="/client/portfolio" className="block text-gray-600 hover:text-blue-600">Portfolio</Link>
          <Link to="/client/bookings" className="block text-gray-600 hover:text-blue-600">My Bookings</Link>
        </nav>
        <button className="mt-auto bg-red-500 text-white py-2 px-4 rounded-lg">Logout</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
```

**Admin Dashboard Layout differences:**
The Admin Layout follows the exact same 2-column flex design but lists admin-specific routes (Manage Services, Bookings, Users, Reports) in the sidebar.

## 6. Integrating Laravel Backend with Supabase PostgreSQL

Supabase provides standard PostgreSQL connection details which makes connecting a Laravel application straightforward.

1. Locate your Database Connection details in your Supabase project settings (`Settings -> Database`).
2. Update your Laravel `.env` file:

```env
DB_CONNECTION=pgsql
DB_HOST=aws-0-eu-central-1.pooler.supabase.com # (Example) Your Supabase Pooler host
DB_PORT=6543 # Pooler port (prefer IPv4 for local dev) or 5432
DB_DATABASE=postgres
DB_USERNAME=postgres.YOUR_PROJECT_REF
DB_PASSWORD=YOUR_SUPABASE_PASSWORD
```

3. Configure SSL (Required for Supabase)
In `config/database.php` under `pgsql`:

```php
'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DATABASE_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public',
    'sslmode' => 'require', // Add this to require SSL connections
],
```

4. You can now use standard Laravel Eloquent ORM and Migrations exactly as you would with a local PostgreSQL server.

## Supabase Auth vs Laravel Auth Note

Since you requested **Supabase Auth (email/password)** and a **Laravel Backend**, you have two architectural choices:
1. **Frontend-Driven Auth:** The React app handles log in via the `supabase-js` client. Upon successful authentication, Supabase issues a JWT. The React app sends this JWT as a Bearer token to Laravel. Laravel verifies this JWT (using an extension or custom middleware to parse Supabase's JWT signatures) before executing controller logic.
2. **Backend-Driven Auth (Laravel Sanctum):** The React app sends email/password to a Laravel `/login` route. Laravel performs standard auth against the `users` table synced to Supabase PostgreSQL, creating a Sanctum token. *This is simpler if you want to rely heavily on Laravel's built-in role system safely without bridging external JWTs.*
