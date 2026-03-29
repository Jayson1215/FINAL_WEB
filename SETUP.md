# Complete Setup Guide

## 📋 System Requirements

### Backend (Laravel)
- PHP 8.1 or higher
- Composer
- PostgreSQL 12+ (via Supabase)
- OpenSSL extension

### Frontend (Vite + React)
- Node.js 18+ or higher
- npm 9+

---

## 🚀 Step-by-Step Setup

### 1️⃣ Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for the project to initialize
4. Go to **Settings > Database** to get your connection details:
   - Host (Pooler)
   - Port
   - Database name
   - Username (with project reference)
   - Password

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Update .env with Supabase credentials
# DB_CONNECTION=pgsql
# DB_HOST=your-supabase-host.pooler.supabase.com
# DB_PORT=6543
# DB_DATABASE=postgres
# DB_USERNAME=postgres.your-project-ref
# DB_PASSWORD=your-password

# Run migrations to create tables
php artisan migrate

# (Optional) Seed sample data
# php artisan db:seed

# Start the development server
php artisan serve
```

Server will run at: **http://localhost:8000**

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults to http://localhost:8000/api)
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Start development server
npm run dev
```

Application will run at: **http://localhost:5173**

---

## 🔑 Default Login Credentials

After running migrations, use these credentials to test:

**Admin Account:**
- Email: `admin@studio.com`
- Password: `password`

**Client Account:**
- Email: `client@studio.com`
- Password: `password`

> **Note:** Add these manually via the Register page or create a seeder for them.

---

## 📁 Project Structure

```
FINAL-WEBSYSTEM/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Http/Middleware/
│   ├── routes/api.php      # API routes
│   ├── database/migrations/
│   ├── .env               # Environment variables
│   └── artisan
│
├── frontend/               # Vite + React App
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env              # Frontend env variables
│   └── package.json
│
├── database/
│   └── schema.sql        # Raw SQL schema (reference)
│
└── README.md
```

---

## 🔄 Available Routes

### Authentication
- `POST /api/register` - Create new account
- `POST /api/login` - User login
- `POST /api/logout` - User logout (requires auth)

### Client Routes
- `GET /api/client/services` - Get all services
- `GET /api/client/portfolio` - Get portfolio
- `GET /api/client/bookings` - Get my bookings
- `POST /api/client/bookings` - Create booking
- `PUT /api/client/bookings/{id}` - Update booking
- `DELETE /api/client/bookings/{id}` - Cancel booking
- `POST /api/client/payments` - Process payment

### Admin Routes
- `CRUD /api/admin/services` - Manage services
- `CRUD /api/admin/portfolio` - Manage portfolio
- `GET /api/admin/bookings` - View all bookings
- `PATCH /api/admin/bookings/{id}/status` - Update booking status
- `GET /api/admin/users` - List all users
- `GET /api/admin/payments` - View payments
- `GET /api/admin/reports` - Get reports/stats

---

## 🧪 Testing the System

### Register a New Account
1. Go to http://localhost:5173
2. Click "Register"
3. Fill in details and select role (Client or Admin)
4. You'll be redirected to your dashboard

### As a Client
1. Browse services and portfolio
2. Click "Book Now" on a service
3. Select date and time
4. Proceed to checkout
5. Complete payment (online or in-person)

### As an Admin
1. View statistics on dashboard
2. Manage services (CRUD operations)
3. View and confirm bookings
4. Monitor payments and revenue

---

## 🛠️ Development Tips

### Useful Laravel Commands
```bash
# Create a new model with migration
php artisan make:model ServiceCategory -m

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh install (caution: deletes all data)
php artisan migrate:fresh

# Create a new controller
php artisan make:controller API/ServiceController

# List all routes
php artisan route:list

# Clear cache
php artisan cache:clear
php artisan route:clear
```

### Useful React Commands
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install axios

# Uninstall package
npm uninstall axios
```

---

## 🚀 Deployment

### Deploy Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect your Vercel/Netlify account
3. Set environment variables
4. Deploy automatically on push

### Deploy Backend (Railway/Render)
1. Create account on Railway or Render
2. Connect your GitHub repository
3. Set environment variables (especially DB_* variables)
4. Deploy and get your production API URL
5. Update frontend `.env` with production API URL

---

## ❓ Common Issues & Solutions

### "Failed to open stream: No such file or directory"
**Solution:** Run `composer install` in the backend directory

### "CORS errors when calling API"
**Solution:** Update backend `.env` with:
```
APP_URL=http://localhost:8000
SESSION_DOMAIN=localhost
```

### "Database connection refused"
**Solution:** 
1. Verify Supabase credentials in `.env`
2. Check if Supabase project is active
3. Ensure SSL is enabled (`sslmode=require`)

### "Port 8000 already in use"
**Solution:** Use a different port:
```bash
php artisan serve --port=8001
```

### "Module not found in React"
**Solution:** 
1. Run `npm install` to ensure dependencies are installed
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

---

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review logs in `backend/storage/logs/laravel.log`
3. Check browser console for frontend errors
4. Refer to official documentation of respective frameworks

Happy Coding! 🎉
