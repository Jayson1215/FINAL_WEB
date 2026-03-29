# Supabase Quick Start - Step by Step

## 📱 Option 1: Automated Setup (Recommended for Windows)

Run this PowerShell script and it will guide you through everything:

```powershell
# Navigate to project root
cd C:\FINAL-WEBSYSTEM

# Run the setup script
.\setup-supabase.ps1
```

The script will:
- ✅ Check if PHP, Composer, Node.js are installed
- ✅ Ask for your Supabase credentials
- ✅ Update `.env` automatically
- ✅ Generate Laravel app key
- ✅ Test the connection
- ✅ Run migrations
- ✅ Install npm dependencies

---

## 🔧 Option 2: Manual Setup (Step by Step)

### Step 1: Create Supabase Account & Project

1. **Open browser:** Go to https://supabase.com
2. **Sign up** with GitHub, Google, or email
3. **Create new project:**
   - Click "New Project"
   - Project name: `photostudio-booking`
   - Database password: Create strong password (save it!)
   - Region: Select closest to you
   - Click "Create new project"
4. **Wait 2-5 minutes** for the project to initialize

### Step 2: Get Connection Details

1. **In Supabase Dashboard:**
   - Click your project
   - Go to **Settings** (bottom left)
   - Click **Database**

2. **Copy these four pieces of information:**

   | Field | Example value |
   |-------|----------------|
   | **Host (Pooler)** | `aws-0-eu-central-1.pooler.supabase.com` |
   | **Port** | `6543` |
   | **Database** | `postgres` |
   | **Username** | `postgres.abcdefghij` |
   | **Password** | `MySecureDatabase123!@#` |

> 📌 **Important:** Use the **Pooler** host for Laravel, not the direct connection host!

### Step 3: Update Backend Configuration

1. **Open this file:** `backend/.env`

2. **Find and update these lines:**

   ```env
   # BEFORE:
   DB_CONNECTION=sqlite
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=laravel
   DB_USERNAME=root
   DB_PASSWORD=
   
   # AFTER (replace with your values):
   DB_CONNECTION=pgsql
   DB_HOST=aws-0-eu-central-1.pooler.supabase.com
   DB_PORT=6543
   DB_DATABASE=postgres
   DB_USERNAME=postgres.xxxxx
   DB_PASSWORD=your-password-here
   ```

3. **Save the file**

### Step 4: Test Connection

```bash
cd backend

# Option A: Run the test command
php artisan supabase:test

# Option B: Use Tinker
php artisan tinker
>>> DB::select('SELECT 1');
>>> exit

# Option C: Try migrations
php artisan migrate --dry-run
```

You should see tables being created successfully!

### Step 5: Run Migrations

```bash
cd backend

# Create all tables
php artisan migrate

# Verify in Supabase:
# 1. Go to https://app.supabase.com/projects
# 2. Click your project
# 3. Go to "Database" > "Tables"
# 4. Should see: users, services, portfolios, bookings, payments, add_ons, booking_addons
```

### Step 6: Start Development

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
# ✅ Runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# ✅ Runs on http://localhost:5173
```

### Step 7: Create Test Users

```bash
cd backend
php artisan tinker
```

Copy-paste this code:

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::create([
    'name' => 'Admin User',
    'email' => 'admin@studio.com',
    'password' => Hash::make('password'),
    'role' => 'admin',
]);

User::create([
    'name' => 'Test Client',
    'email' => 'client@studio.com',
    'password' => Hash::make('password'),
    'role' => 'client',
]);

exit
```

### Step 8: Test the App

1. **Open:** http://localhost:5173
2. **Login with:**
   - Email: `admin@studio.com` or `client@studio.com`
   - Password: `password`
3. **Explore the dashboard!**

---

## 🚀 Verify Everything Works

### Backend Health Check

```bash
cd backend

# 1. Check database connection
php artisan supabase:test

# 2. See all routes
php artisan route:list | grep -E "POST|GET|PUT|DELETE"

# 3. Check if tables exist
php artisan tinker
>>> DB::table('users')->count();
>>> exit
```

### Frontend Health Check

```bash
cd frontend

# 1. Check if app runs
npm run dev

# 2. Check dependencies
npm list react react-router-dom axios tailwindcss

# 3. Test login/register pages work
# Open http://localhost:5173/login
# Open http://localhost:5173/register
```

---

## 🔑 Environment Variables Summary

### Backend (.env)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_HOST=your-host.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.xxxxx
DB_PASSWORD=your-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## ❓ Common Issues & Solutions

### ❌ "psycopg2 error: FATAL: remaining connection slots reserved"
**Solution:** You might have too many connections. Restart your terminal or:
```bash
cd backend
php artisan cache:clear
php artisan route:clear
```

### ❌ "Connection refused - Connection refused"
**Solution:**
1. Verify credentials in `.env` are correct (no extra spaces!)
2. Check Supabase project is active
3. Use **Pooler** host, not direct connection

### ❌ "SQLSTATE[08006] - could not connect to server"
**Solution:**
```bash
php artisan migrate --env=local --force --fresh
```

### ❌ "sslmode=require error"
**Solution:** This is normal for Supabase. It's already configured in `config/database.php`.

### ❌ Database shows 0 tables
**Solution:**
```bash
php artisan migrate reset
php artisan migrate
```

### ❌ npm ERR! code ERESOLVE
**Solution:**
```bash
cd frontend
npm install --legacy-peer-deps
# OR
npm install --force
```

---

## 📊 Check Supabase Dashboard

Once connected, you can see your data:

1. **Go to:** https://app.supabase.com
2. **Select your project**
3. **Click "Database"**
4. **Click "Table Editor"**
5. **Select table to view data:**
   - `users` - Your registered users
   - `services` - Photography services
   - `bookings` - Client bookings
   - `payments` - Payment records
   - etc.

---

## 🎉 You're Ready!

Your app is now fully connected to Supabase:
- ✅ Database created and configured
- ✅ Backend connected to PostgreSQL
- ✅ Frontend ready to use
- ✅ Authentication working
- ✅ All tables created

**Next steps:**
1. Create test data (services, portfolio items)
2. Test booking flow
3. Test admin features
4. Deploy to production

**Happy coding! 🚀**
