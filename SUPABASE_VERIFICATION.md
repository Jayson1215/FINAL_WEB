# Supabase Connection Verification Checklist

## ✅ Pre-Connection Checklist

Before connecting, make sure you have:

- [ ] Created a Supabase account at https://supabase.com
- [ ] Created a new project (noted the password)
- [ ] Copied database connection details from Settings > Database
- [ ] Have these 5 pieces of information:
  - [ ] DB_HOST (Pooler URL ending in pooler.supabase.com)
  - [ ] DB_PORT (usually 6543 for Pooler)
  - [ ] DB_DATABASE (usually "postgres")
  - [ ] DB_USERNAME (format: postgres.xxxxx)
  - [ ] DB_PASSWORD (the password you created)

---

## 🔧 Connection Setup Checklist

### Backend Configuration
- [ ] Opened `backend/.env` file
- [ ] Updated `DB_CONNECTION=pgsql`
- [ ] Updated `DB_HOST` with Pooler URL
- [ ] Updated `DB_PORT=6543`
- [ ] Updated `DB_DATABASE=postgres`
- [ ] Updated `DB_USERNAME=postgres.xxxxx`
- [ ] Updated `DB_PASSWORD=your-password`
- [ ] Saved `.env` file
- [ ] Verified no extra spaces in `.env` values

### Laravel Setup
- [ ] Opened terminal in `backend` folder
- [ ] Ran `php artisan key:generate` (if APP_KEY is empty)
- [ ] Ran `php artisan supabase:test` (should show SUCCESS)
- [ ] Ran `php artisan migrate` (should create tables)

### Frontend Configuration
- [ ] Updated `frontend/.env` with:
  ```env
  VITE_API_URL=http://localhost:8000/api
  ```
- [ ] Ran `npm install` in `frontend` folder
- [ ] No error messages during npm install

---

## 🧪 Connection Test Checklist

### Method 1: Using the Test Command
```bash
cd backend
php artisan supabase:test
```
Expected output:
- [ ] "✅ Database Connection: SUCCESS"
- [ ] Database version displayed
- [ ] All required tables listed as "✅ Exists"

### Method 2: Using Tinker
```bash
cd backend
php artisan tinker
```
Then run each command:

1. **Test connection:**
   ```
   >>> DB::select('SELECT 1');
   ```
   Expected: Array with result showing "1"

2. **Check users table:**
   ```
   >>> \App\Models\User::count()
   ```
   Expected: Number (0 if new, or user count if you added users)

3. **Check services table:**
   ```
   >>> \App\Models\Service::count()
   ```
   Expected: 0 (or service count if you added services)

4. **Exit Tinker:**
   ```
   >>> exit
   ```

### Method 3: Check Data in Supabase Dashboard
1. [ ] Go to https://app.supabase.com
2. [ ] Select your project
3. [ ] Click "Database" in sidebar
4. [ ] Click "Table Editor"
5. [ ] Should see these tables exist:
   - [ ] users
   - [ ] services
   - [ ] portfolios
   - [ ] bookings
   - [ ] payments
   - [ ] add_ons
   - [ ] booking_addons

---

## 🚀 Development Environment Checklist

### Terminal 1 - Backend Server
```bash
cd backend
php artisan serve
```
- [ ] Shows "Laravel development server started..."
- [ ] No error messages
- [ ] Running on http://localhost:8000
- [ ] Accessible in browser with no errors

### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```
- [ ] Shows "VITE vX.X.X ready in X ms"
- [ ] Local: http://localhost:5173/
- [ ] No error messages in terminal
- [ ] Application loads in browser

### Testing Frontend Connection to Backend
1. [ ] Open http://localhost:5173 in browser
2. [ ] Try to register new account
3. [ ] Check browser console for API errors (F12)
4. [ ] Should be able to create an account
5. [ ] Should be able to login after registration

---

## 🧑‍💼 Test User Creation Checklist

Create test users for development:

```bash
cd backend
php artisan tinker
```

### Admin User
```php
User::create([
    'name' => 'Admin User',
    'email' => 'admin@studio.com',
    'password' => Hash::make('password'),
    'role' => 'admin',
]);
```
- [ ] User created successfully
- [ ] Message shows with user ID

### Client User
```php
User::create([
    'name' => 'Test Client',
    'email' => 'client@studio.com',
    'password' => Hash::make('password'),
    'role' => 'client',
]);
```
- [ ] User created successfully
- [ ] Message shows with user ID

### Verify Users in Database
```php
User::all();
```
- [ ] Shows both users
- [ ] Each has correct role (admin/client)
- [ ] Passwords are hashed (not plain text)

---

## 🎯 Features Verification Checklist

### Client Dashboard Features
Right after login with client account:

- [ ] Dashboard page loads with stats
- [ ] Can see "Dashboard" menu item
- [ ] Can see "Portfolio" menu item
- [ ] Can see "Services" menu item
- [ ] Can see "My Bookings" menu item
- [ ] Can logout successfully
- [ ] After logout, redirected to login page

### Admin Dashboard Features
After login with admin account:

- [ ] Admin dashboard shows stats
- [ ] Can see "Services" menu item
- [ ] Can see "Portfolio" menu item
- [ ] Can see "Bookings" menu item
- [ ] Can see "Users" menu item
- [ ] Can see "Reports" menu item
- [ ] Can logout successfully

### Services Management (Admin)
In admin dashboard:

- [ ] Click "Services"
- [ ] See "Add New Service" button
- [ ] Can create a new service
- [ ] Service appears in the list
- [ ] Can edit service (button visible)
- [ ] Can delete service (button visible)

### Bookings (Client)
In client dashboard:

- [ ] Click "Services"
- [ ] See list of available services
- [ ] Click "Book Now" on a service
- [ ] Can select date (future date only)
- [ ] Can select time
- [ ] Can add special requests
- [ ] See order summary
- [ ] Can proceed to checkout

### Checkout & Payment (Client)
After creating booking:

- [ ] See payment method options
- [ ] Can select "Online Payment"
- [ ] Can select "Pay at Studio"
- [ ] Can see order summary
- [ ] Can complete payment
- [ ] After payment, redirected to "My Bookings"
- [ ] Booking appears in "My Bookings"

---

## 🔍 Troubleshooting Verification

If something doesn't work, check these:

### Backend Issues
- [ ] `.env` file has correct credentials (no typos)
- [ ] No extra spaces in `.env` values (spaces = errors!)
- [ ] `DB_HOST` uses Pooler URL (ends in **pooler**.supabase.com)
- [ ] `DB_PORT=6543` (not 5432)
- [ ] Password is correct (copy from Supabase, not typed)
- [ ] Run `php artisan cache:clear`
- [ ] Run `php artisan route:clear`

### Database Connection Issues
```bash
cd backend

# Test each step
php artisan supabase:test

# Check tables
php artisan tinker
>>> DB::table('users')->count();

# Fresh migrations (WARNING: Clears data!)
php artisan migrate:reset
php artisan migrate
```

### Frontend Issues
- [ ] `frontend/.env` has correct API URL
- [ ] API URL matches where backend is running
- [ ] Browser console shows no CORS errors
- [ ] Check network tab in DevTools: API calls should return 200/201
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Try incognito/private window

### npm Issues
```bash
cd frontend

# Clear cache
npm cache clean --force

# Reinstall
rm -r node_modules package-lock.json
npm install

# Or use legacy peer deps
npm install --legacy-peer-deps
```

---

## 📊 Data Verification

### Check Users Table
```bash
cd backend
php artisan tinker
>>> \App\Models\User::with('role')->get();
```
Should show your admin and client users

### Check Services Table
```php
>>> \App\Models\Service::all();
```
Should be empty initially (create via admin panel)

### Check Bookings Table
```php
>>> \App\Models\Booking::with(['user', 'service'])->get();
```
Should show bookings created through client dashboard

### Check from Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Database > Table Editor
4. Click each table to view data

---

## ✨ All Good? 

If you've checked all items above and everything is:
- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:5173
- ✅ Can login with test users
- ✅ Can see admin/client features
- ✅ Can create bookings
- ✅ Can process payments

**You're all set!** 🎉

Move on to:
1. Create sample services
2. Upload portfolio images
3. Test complete booking flow
4. Deploy to production

---

## 🆘 Still Having Issues?

1. **Check logs:**
   ```bash
   cd backend
   tail -f storage/logs/laravel.log
   ```

2. **Check browser console:** F12 > Console tab
   - Look for API errors (red text)
   - Network tab to see API requests

3. **Check Supabase status:**
   - Go to https://status.supabase.com
   - Make sure no outages

4. **Verify credentials again:**
   - Copy directly from Supabase > Settings > Database
   - No copy-paste mistakes
   - No extra spaces or characters

5. **Create a new test file:**
   ```bash
   cd backend
   # Create test.php with connection code
   php test.php
   ```

---

**Need more help?** Check:
- GitHub Issues: https://github.com/supabase/supabase/issues
- Supabase Docs: https://supabase.com/docs
- Laravel Docs: https://laravel.com/docs
- Project SUPABASE_SETUP.md file
