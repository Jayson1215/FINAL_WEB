# Supabase Configuration Guide - Your Project

Your Supabase credentials have been provided. Here's what you need to do:

## 🔑 Your Credentials Summary

- **Project ID:** `kfjljerbuieggbgxrgww`
- **Project URL:** https://kfjljerbuieggbgxrgww.supabase.co
- **Password:** `YK%qQ5V2#d9sHZ@`
- **Anon Key:** (for frontend - React)
- **Service Role Key:** (for backend - Laravel)

---

## 📋 Step 1: Get Your Database Host

You need to find the **Database Host (Pooler)** from Supabase:

1. **Go to:** https://app.supabase.com
2. **Select your project:** `kfjljerbuieggbgxrgww`
3. **Go to:** Settings > Database (left sidebar)
4. **Look for "Connection string"** section
5. **Copy the host URL** (should look like: `aws-0-xx-yyyy.pooler.supabase.com`)

---

## 🔧 Step 2: Update Backend `.env`

Open `backend/.env` and update these lines (or create them):

```env
APP_NAME="PhotoStudio Booking"
APP_ENV=local
APP_KEY=base64:YOUR_APP_KEY
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=pgsql
DB_HOST=YOUR_POOLER_HOST_HERE
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.kfjljerbuieggbgxrgww
DB_PASSWORD=YK%qQ5V2#d9sHZ@

# Supabase Configuration (Optional)
SUPABASE_URL=https://kfjljerbuieggbgxrgww.supabase.co
SUPABASE_ANON_KEY=sb_publishable_fU-o6_5--bwgYAsV7ETw0J6Qz
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmamxqZXJidWllZ2diZ3hyZ3d3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyODQ0OSwiZXhwIjoyMDkwMzA0NDQ5fQ.xvLokmko4uQBHZtiWrnra-DZft4Ov4CAxc880XujIbk

# Other Essential Config
LOG_CHANNEL=stack
LOG_LEVEL=debug
CACHE_STORE=database
SESSION_DRIVER=database
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
```

**⚠️ Important:** Replace `YOUR_POOLER_HOST_HERE` with the actual host from Supabase Settings > Database

---

## 🌐 Step 3: Update Frontend `.env`

Open `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=https://kfjljerbuieggbgxrgww.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_fU-o6_5--bwgYAsV7ETw0J6Qz
```

---

## ✅ Step 4: Test Connection

Once you've updated `backend/.env` with the pooler host:

```bash
cd backend

# Generate app key if not set
php artisan key:generate

# Test connection
php artisan supabase:test

# Should show: ✅ Database Connection: SUCCESS
```

---

## 🗄️ Step 5: Create Database Tables

```bash
cd backend

# Run migrations
php artisan migrate

# Verify tables in Supabase
# Go to: https://app.supabase.com > Your Project > Database > Table Editor
# Should see: users, services, portfolios, bookings, payments, add_ons, booking_addons
```

---

## 🧑‍💼 Step 6: Create Test Users

```bash
cd backend

# Open interactive shell
php artisan tinker

# Create admin user
User::create([
    'name' => 'Admin User',
    'email' => 'admin@studio.com',
    'password' => Hash::make('password'),
    'role' => 'admin',
]);

# Create client user
User::create([
    'name' => 'Test Client',
    'email' => 'client@studio.com',
    'password' => Hash::make('password'),
    'role' => 'client',
]);

# Exit
exit
```

---

## 🚀 Step 7: Start Development

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```
✅ Runs on http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Runs on http://localhost:5173

---

## 🔑 Login Credentials

Use these to test:

**Admin Account:**
- Email: `admin@studio.com`
- Password: `password`

**Client Account:**
- Email: `client@studio.com`
- Password: `password`

---

## 🧪 Quick Verification

After everything is set up, verify with:

```bash
cd backend

# Test connection
php artisan supabase:test

# Should see:
# ✅ Database Connection: SUCCESS
# ✅ All required tables exist
```

---

## 📊 Next: Verify in Supabase Dashboard

1. **Go to:** https://app.supabase.com
2. **Select your project:** `kfjljerbuieggbgxrgww`
3. **Click "Database"** in sidebar
4. **Click "Table Editor"**
5. **Check tables exist:**
   - [ ] users ✅
   - [ ] services ✅
   - [ ] portfolios ✅
   - [ ] bookings ✅
   - [ ] payments ✅
   - [ ] add_ons ✅
   - [ ] booking_addons ✅

---

## ⚠️ Important Notes

1. **Security:** Never commit `.env` file to Git (it's in `.gitignore`)
2. **Password encoding:** The password `YK%qQ5V2#d9sHZ@` has special characters - copy exactly
3. **Pooler host:** Essential - don't use the direct connection host
4. **Database:** Always `postgres` for Supabase
5. **Port:** Always `6543` for Pooler, or `5432` for direct connection

---

## 🎯 Summary of Values to Use

| Field | Value |
|-------|-------|
| DB_CONNECTION | pgsql |
| DB_HOST | [Get from Supabase Settings > Database] |
| DB_PORT | 6543 |
| DB_DATABASE | postgres |
| DB_USERNAME | postgres.kfjljerbuieggbgxrgww |
| DB_PASSWORD | YK%qQ5V2#d9sHZ@ |

---

## 🐛 Troubleshooting

### "Connection refused"
- Verify the pooler host is correct (from Supabase Settings)
- Check password has no typos
- Run: `php artisan cache:clear`

### "Authentication failed"
- Double-check password: `YK%qQ5V2#d9sHZ@`
- Make sure no extra spaces in `.env`
- Username must be: `postgres.kfjljerbuieggbgxrgww`

### "Tables not created"
- Run: `php artisan migrate`
- Check for errors in output
- Verify database connection first

---

## ✨ You're All Set!

Once you complete these steps:
1. ✅ Backend connected to Supabase
2. ✅ Frontend ready to communicate
3. ✅ Test users created
4. ✅ Ready to develop!

**Start with:** http://localhost:5173 🚀
