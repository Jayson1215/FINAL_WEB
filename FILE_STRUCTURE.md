# Complete File Structure & Contents

## 📁 Project Root Files

```
c:\FINAL-WEBSYSTEM\
├── .gitignore                    - Git ignore rules
├── README.md                     - Project overview & architecture
├── SETUP.md                      - Complete setup guide
├── PROJECT_SUMMARY.md            - This file - features & components
├── database/
│   └── schema.sql               - Raw PostgreSQL schema
└── backend/ & frontend/         - See sections below
```

---

## 🔧 Backend Files (Laravel)

### Root Configuration Files
```
backend/
├── .env                         - Environment variables (UPDATE WITH SUPABASE)
├── .env.example                 - Example environment file
├── .gitignore                   - Backend-specific git ignore
├── artisan                      - Laravel CLI
├── composer.json                - PHP dependencies
├── composer.lock                - Locked dependency versions
├── bootstrap/
│   └── app.php                 - ⭐ UPDATED: Registered middleware & routes
├── config/
│   ├── database.php            - Database configuration
│   └── ...other configs
└── ...
```

### Controllers (app/Http/Controllers/)
```
✅ AuthController.php
   - register(Request $request)
   - login(Request $request)
   - logout(Request $request)
   - index() [GET /admin/users]

✅ ServiceController.php
   - index() [List services]
   - show(Service $service)
   - store(Request $request) [Create service]
   - update(Request $request, Service $service)
   - destroy(Service $service)

✅ PortfolioController.php
   - index() [List portfolio]
   - show(Portfolio $portfolio)
   - store(Request $request) [Create item]
   - update(Request $request, Portfolio $portfolio)
   - destroy(Portfolio $portfolio)

✅ BookingController.php
   - index(Request $request) [Client's bookings]
   - indexAll() [Admin's bookings]
   - show(Booking $booking)
   - store(Request $request) [Create booking]
   - update(Request $request, Booking $booking)
   - updateStatus(Request $request, Booking $booking) [Admin only]
   - destroy(Request $request, Booking $booking) [Cancel booking]

✅ PaymentController.php
   - store(Request $request) [Create payment]
   - getAll() [Admin: Get all payments]
   - reports() [Admin: Get reports/stats]
```

### Models (app/Models/)
```
✅ User.php (Updated)
   - Relations: bookings()
   - Fields: id, name, email, password, role, created_at

✅ Service.php
   - Relations: bookings()
   - Fields: id, name, description, category, price, duration

✅ Portfolio.php
   - Fields: id, title, category, image_url, description

✅ Booking.php
   - Relations: user(), service(), payment(), addOns()
   - Fields: id, user_id, service_id, booking_date, booking_time, 
             status, total_amount, special_requests

✅ Payment.php
   - Relations: booking()
   - Fields: id, booking_id, payment_method, payment_status, 
             amount, transaction_reference

✅ AddOn.php
   - Relations: bookings() [many-to-many]
   - Fields: id, name, price
```

### Middleware (app/Http/Middleware/)
```
✅ RoleMiddleware.php
   - Checks user.role against required role
   - Returns 403 Unauthorized if role doesn't match
   - Registered in bootstrap/app.php as 'role' alias
```

### Routes (routes/api.php)
```
✅ PUBLIC ROUTES:
   POST   /register
   POST   /login

✅ CLIENT ROUTES (middleware: auth:sanctum + role:client):
   GET    /client/services
   GET    /client/services/{service}
   GET    /client/portfolio
   GET    /client/portfolio/{portfolio}
   GET    /client/bookings
   POST   /client/bookings
   GET    /client/bookings/{booking}
   PUT    /client/bookings/{booking}
   DELETE /client/bookings/{booking}
   POST   /client/payments

✅ ADMIN ROUTES (middleware: auth:sanctum + role:admin):
   GET    /admin/services
   GET    /admin/services/{service}
   POST   /admin/services
   PUT    /admin/services/{service}
   DELETE /admin/services/{service}
   
   GET    /admin/portfolio
   GET    /admin/portfolio/{portfolio}
   POST   /admin/portfolio
   PUT    /admin/portfolio/{portfolio}
   DELETE /admin/portfolio/{portfolio}
   
   GET    /admin/bookings
   GET    /admin/bookings/{booking}
   PUT    /admin/bookings/{booking}
   PATCH  /admin/bookings/{booking}/status
   
   GET    /admin/users
   GET    /admin/payments
   GET    /admin/reports

✅ PROTECTED ROUTE:
   POST   /logout (auth:sanctum)
```

### Migrations (database/migrations/)
```
✅ 0001_01_01_000000_create_users_table.php
   - Updated with: enum role (admin/client)

✅ 2024_03_29_000001_create_services_table.php
✅ 2024_03_29_000002_create_portfolios_table.php
✅ 2024_03_29_000003_create_bookings_table.php
✅ 2024_03_29_000004_create_payments_table.php
✅ 2024_03_29_000005_create_add_ons_table.php
✅ 2024_03_29_000006_create_booking_addons_table.php
```

---

## ⚛️ Frontend Files (Vite + React)

### Root Configuration Files
```
frontend/
├── .env                         - Environment variables
├── .gitignore                   - Frontend-specific git ignore
├── index.html                   - ⭐ Main HTML entry point for Vite
├── package.json                 - ⭐ Node dependencies & scripts
├── vite.config.js              - ⭐ Vite configuration
├── tailwind.config.js           - ⭐ Tailwind CSS configuration
├── postcss.config.js            - ⭐ PostCSS configuration
└── src/
    └── [See below]
```

### Main Application Files (src/)
```
✅ main.jsx                      - React entry point (renders App to #root)
✅ App.jsx                       - Main app component with routing
✅ index.css                     - Tailwind CSS imports + global styles
```

### Services (src/services/)
```
✅ api.js
   - Axios instance with baseURL pointing to API
   - Request interceptor: Adds Bearer token from localStorage
   - Response interceptor: Handles 401 errors (logout + redirect)

✅ authService.js
   - register(data) → POST /register
   - login(email, password) → POST /login
   - logout() → POST /logout
   - getProfile() → GET /profile

✅ bookingService.js
   - getMyBookings() → GET /client/bookings
   - getBookingDetail(id) → GET /client/bookings/{id}
   - createBooking(data) → POST /client/bookings
   - updateBooking(id, data) → PUT /client/bookings/{id}
   - cancelBooking(id) → DELETE /client/bookings/{id}
   - getAllBookings() → GET /admin/bookings
   - updateBookingStatus(id, status) → PATCH /admin/bookings/{id}/status

✅ serviceService.js
   - getServices() → GET /client/services
   - getServiceDetail(id) → GET /client/services/{id}
   - createService(data) → POST /admin/services
   - updateService(id, data) → PUT /admin/services/{id}
   - deleteService(id) → DELETE /admin/services/{id}
   - getAllServices() → GET /admin/services

✅ portfolioService.js
   - getPortfolio() → GET /client/portfolio
   - getPortfolioItem(id) → GET /client/portfolio/{id}
   - createPortfolioItem(data) → POST /admin/portfolio
   - updatePortfolioItem(id, data) → PUT /admin/portfolio/{id}
   - deletePortfolioItem(id) → DELETE /admin/portfolio/{id}
   - getAllPortfolio() → GET /admin/portfolio

✅ paymentService.js
   - createPayment(bookingId, paymentMethod) → POST /client/payments
   - getAllPayments() → GET /admin/payments
   - getReports() → GET /admin/reports
```

### Context (src/contexts/)
```
✅ AuthContext.jsx
   - createContext for authentication state
   - AuthProvider component with:
     * user state
     * loading state
     * error state
     * login(email, password) function
     * register(name, email, password, passwordConfirmation, role) function
     * logout() function
   - useAuth() hook for consuming context
   - Stores token & user in localStorage
```

### Layout Components (src/components/layout/)
```
✅ ClientLayout.jsx
   - Sidebar with navigation links (Dashboard, Portfolio, Services, Bookings)
   - Top bar with page title
   - Logout button
   - Responsive: sidebar hidden on mobile

✅ AdminLayout.jsx
   - Dark gray sidebar (#gray-800) with navigation links
   - (Dashboard, Services, Portfolio, Bookings, Users, Reports)
   - Top bar with page title
   - Logout button
   - Responsive: sidebar hidden on mobile
```

### Auth Pages (src/pages/auth/)
```
✅ Login.jsx
   - Email & password form
   - Login with useAuth context
   - Redirects to /admin/dashboard or /client/dashboard
   - Link to register page
   - Error display

✅ Register.jsx
   - Name, email, password, confirm password fields
   - Role selection (Client/Admin dropdown)
   - Registration with useAuth context
   - Redirects after successful registration
   - Link to login page
   - Error display
   - Password validation
```

### Client Pages (src/pages/client/)
```
✅ Dashboard.jsx
   - Stats grid: Total Bookings, Confirmed, Pending
   - Quick action buttons (Book New Session, View Portfolio)
   - Upcoming bookings list (next 5 bookings)
   - Fetches data from bookingService & paymentService
   - Uses ClientLayout wrapper

✅ PortfolioGallery.jsx
   - Portfolio grid layout (3 columns on desktop)
   - Category filter buttons (All, Portrait, Event, etc.)
   - Portfolio items with image, title, description, category
   - Hover effects on cards
   - Uses ClientLayout wrapper

✅ ServicesList.jsx
   - Service cards with image/icon, name, description
   - Shows price, duration, category
   - "Book Now" button per service
   - Navigates to BookingPage with serviceId
   - Uses ClientLayout wrapper

✅ BookingPage.jsx
   - Service details display (name, price, duration)
   - Date selection (min: tomorrow, HTML5 date input)
   - Time selection (HTML5 time input)
   - Special requests textarea
   - Order summary sidebar
   - Submits to bookingService.createBooking()
   - Stores booking in sessionStorage
   - Redirects to CheckoutPage
   - Uses ClientLayout wrapper

✅ MyBookings.jsx
   - Table/card display of user's bookings
   - Shows: Service name, Date/Time, Amount, Status
   - Special requests display
   - Cancel booking button (with confirmation)
   - Status badges (Confirmed, Pending, Cancelled)
   - Only shows cancellable bookings (future date)
   - Uses ClientLayout wrapper

✅ CheckoutPage.jsx
   - Payment method selection:
     * Online (credit/debit card)
     * In-person (pay at studio)
   - Order summary: Service, Date/Time, Special Requests, Total
   - Submit button to create payment
   - Success page with redirect to bookings
   - Uses ClientLayout wrapper
```

### Admin Pages (src/pages/admin/)
```
✅ AdminDashboard.jsx
   - Stats grid: Total Revenue, Total Bookings, Confirmed, Pending Payments
   - Recent bookings table (last 5 bookings)
   - Client name, service, date, status
   - Fetches from paymentService.getReports() & bookingService.getAllBookings()
   - Uses AdminLayout wrapper

✅ ManageServices.jsx
   - "Add New Service" button toggles form
   - Form inputs: Name, Description, Category, Price, Duration
   - Grid of service cards (3 columns)
   - Edit & Delete buttons per service
   - onDelete calls serviceService.deleteService()
   - Uses AdminLayout wrapper

✅ ManagePortfolio.jsx
   - Grid of portfolio items with images
   - Edit & Delete buttons
   - onDelete calls portfolioService.deletePortfolioItem()
   - Item shows: title, description, image
   - Uses AdminLayout wrapper

✅ BookingManager.jsx
   - Table layout with columns:
     * Client name
     * Service name
     * Date & Time
     * Amount
     * Status (dropdown with pending/confirmed/cancelled)
     * View button
   - onChange of status dropdown: calls bookingService.updateBookingStatus()
   - Uses AdminLayout wrapper

✅ ManageUsers.jsx
   - Table with columns:
     * Name
     * Email
     * Role (admin/client badge)
     * Created date
   - Fetches from api.get('/admin/users')
   - Uses AdminLayout wrapper

✅ RevenueReports.jsx
   - Key metrics cards:
     * Total Revenue ($)
     * Total Bookings (count)
     * Confirmed Bookings (count)
     * Avg Per Booking ($)
   - Revenue summary section with 4 cards
   - Quick stats:
     * Completion rate (%)
     * Average revenue per booking ($)
     * Pending payment count
   - Fetches from paymentService.getReports()
   - Uses AdminLayout wrapper
```

---

## 📊 Database Schema (database/schema.sql)

```sql
✅ users            - User accounts with roles
✅ services         - Photography services
✅ portfolios       - Portfolio items/gallery
✅ bookings         - Booking requests
✅ payments         - Payment records
✅ add_ons          - Add-on services/products
✅ booking_addons   - Many-to-many: bookings ↔ add_ons
```

All with:
- UUID primary keys
- Proper foreign keys with ON DELETE CASCADE
- Timestamps (created_at, updated_at)
- Enums for status fields
- Proper indexing

---

## 📝 File Quick Reference

### Most Important Backend Files
1. `bootstrap/app.php` - Register routes & middleware
2. `routes/api.php` - All API endpoints
3. Controllers (5 files) - Business logic
4. Models (6 files) - Data structure
5. Migrations (7 files) - Database schema

### Most Important Frontend Files
1. `App.jsx` - Routing & role-based access
2. `AuthContext.jsx` - Auth state management
3. Services (6 files) - API calls
4. Pages (11 files) - User interfaces
5. `main.jsx` & `index.html` - App entry point

### Total Files Created
- **Backend:** ~15-20 files
- **Frontend:** ~30-35 files
- **Configuration:** ~10 files
- **Documentation:** 4 files

**Total: 60+ files with 5000+ lines of code**

---

## 🎯 Testing Credentials

After setup, use these to test:

**Admin Account:**
```
Email: admin@studio.com
Password: password
```

**Client Account:**
```
Email: client@studio.com
Password: password
```

> Create these via the Register page or create Laravel seeders

---

## ✅ Quick Checklist

- [ ] Clone/download the project
- [ ] Set up Supabase account and project
- [ ] Update `backend/.env` with Supabase credentials
- [ ] Run `composer install` in backend
- [ ] Run `npm install` in frontend
- [ ] Run `php artisan migrate` in backend
- [ ] Run `php artisan serve` (backend terminal)
- [ ] Run `npm run dev` (frontend terminal)
- [ ] Access http://localhost:5173
- [ ] Register a new account or use test credentials
- [ ] Test booking flow, admin features, payment options

**All Done!** 🎉
