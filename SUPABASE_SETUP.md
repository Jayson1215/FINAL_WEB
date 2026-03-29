# Supabase Connection Guide

## 🚀 Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Project Name:** `photostudio-booking` (or your choice)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
5. Click "Create new project"
6. Wait 2-5 minutes for initialization

---

## 📋 Step 2: Get Your Connection Details

Once project is created:

1. Go to **Settings > Database**
2. Copy these details:
   - **Host (Pooler):** `aws-0-xx-yyyy.pooler.supabase.com` (or your region)
   - **Port:** `6543` (pooler) or `5432` (direct)
   - **Database:** `postgres`
   - **User:** `postgres.xxxxx` (Your project ref)
   - **Password:** The password you created

---

## 🔧 Step 3: Configure Laravel Backend

### 3a. Update `.env` file:

```bash
# Open backend/.env
nano backend/.env
# Or edit in VS Code
```

Replace these lines:
```env
DB_CONNECTION=pgsql
DB_HOST=aws-0-xx-yyyy.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.xxxxx
DB_PASSWORD=your-password-here
```

**Example:**
```env
DB_CONNECTION=pgsql
DB_HOST=aws-0-eu-central-1.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.abcdefg
DB_PASSWORD=MySecurePassword123!
```

### 3b. Verify Database Config

Open `backend/config/database.php` and ensure pgsql section has:

```php
'pgsql' => [
    'driver' => 'pgsql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public',
    'sslmode' => 'require',  // ⭐ IMPORTANT for Supabase
],
```

---

## 🗄️ Step 4: Run Migrations

```bash
cd backend

# Test the connection
php artisan tinker
# Type: DB::connection()->getPdo();
# Should connect successfully

# Run migrations
php artisan migrate

# Check if tables were created
# Go to Supabase Dashboard > Database > public schema
```

---

## 🔐 Step 5: Set Up Supabase Auth (Optional but Recommended)

### Option A: Use Supabase Auth with Laravel

1. Install Supabase PHP package:
```bash
cd backend
composer require supabase/supabase-php
```

2. Create a Supabase service in `app/Services/SupabaseService.php`:

```php
<?php

namespace App\Services;

use Supabase\SupabaseClient;

class SupabaseService
{
    private $client;

    public function __construct()
    {
        $this->client = new SupabaseClient(
            env('SUPABASE_URL'),
            env('SUPABASE_KEY')
        );
    }

    public function getClient()
    {
        return $this->client;
    }

    public function verifyToken($token)
    {
        // Verify JWT token from Supabase
        return $this->client->auth()->getUser($token);
    }
}
```

3. Get Supabase credentials:
   - Go to **Settings > API** in Supabase
   - Copy **Project URL** and **Anon Key**
   - Add to `.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc...xxxxx
```

### Option B: Continue with Laravel Sanctum (Current Setup)

Your current setup uses Laravel Sanctum which is simpler and works great. Users will:
1. Register/Login with email/password via Laravel
2. Receive a Sanctum token
3. Send token to all API requests

This is **fully compatible** with Supabase PostgreSQL!

---

## ✅ Step 6: Test the Connection

### 6a. Via Terminal:

```bash
cd backend

# Test database connection
php artisan tinker

# Inside tinker:
>>> DB::select('SELECT 1');
>>> \App\Models\User::count();
>>> exit

# Test migrations
php artisan migrate:status
```

### 6b. Via Supabase Dashboard:

1. Log into [supabase.com](https://supabase.com)
2. Go to your project
3. Click **Database** (left sidebar)
4. Click **Schemas** > **public**
5. Check if tables exist:
   - `users`
   - `services`
   - `portfolios`
   - `bookings`
   - `payments`
   - `add_ons`
   - `booking_addons`

---

## 🎯 Step 7: Start Development

```bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend
cd frontend
npm run dev

# Access http://localhost:5173
```

---

## 🔑 Create Test Users

### Via Laravel Tinker:

```bash
php artisan tinker
```

```php
>>> use App\Models\User;
>>> use Illuminate\Support\Facades\Hash;

>>> User::create([
    'name' => 'Admin User',
    'email' => 'admin@studio.com',
    'password' => Hash::make('password'),
    'role' => 'admin',
]);

>>> User::create([
    'name' => 'Test Client',
    'email' => 'client@studio.com',
    'password' => Hash::make('password'),
    'role' => 'client',
]);

>>> exit
```

### Or via Web App:

1. Go to http://localhost:5173/register
2. Create account with role selection
3. Login and test features

---

## 🚀 Production Deployment

When deploying to production:

### Frontend (Vercel/Netlify):
```env
VITE_API_URL=https://your-production-api.com/api
```

### Backend (Railway/Render):
```env
APP_URL=https://your-production-api.com
DB_CONNECTION=pgsql
DB_HOST=aws-0-xx-yyyy.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.xxxxx
DB_PASSWORD=your-password
```

---

## 🐛 Troubleshooting

### "Connection refused"
- Check if Supabase project is active
- Verify credentials in `.env`
- Ensure you're using **Pooler** host for Laravel

### "SSL error"
- Ensure `sslmode => 'require'` in `config/database.php`
- Some local dev: use `sslmode => 'disable'` temporarily

### "Tables not created"
- Run: `php artisan migrate`
- Check Supabase > Database > public schema

### "Authentication failed"
- Verify password is correct (no typos)
- Reset password in Supabase > Database > Settings
- Check if user is `postgres.xxxxx` format

---

## 📊 Useful Supabase URLs

Once your project is created:

- **Project URL:** `https://xxxxx.supabase.co`
- **Dashboard:** `https://app.supabase.com/projects`
- **API Docs:** Dashboard > Documentation (auto-generated)
- **Database Editor:** Dashboard > Table Editor
- **SQL Editor:** Dashboard > SQL Editor

---

## ✨ Quick Checklist

- [ ] Create Supabase account
- [ ] Create new project
- [ ] Copy connection details
- [ ] Update `backend/.env` with credentials
- [ ] Test: `php artisan tinker` → `DB::select('SELECT 1');`
- [ ] Run: `php artisan migrate`
- [ ] Verify tables in Supabase dashboard
- [ ] Create test users (Admin & Client)
- [ ] Start backend: `php artisan serve`
- [ ] Start frontend: `npm run dev`
- [ ] Test login at http://localhost:5173

**You're ready to go! 🎉**
