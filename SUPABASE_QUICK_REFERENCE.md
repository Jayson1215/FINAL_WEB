# 🚀 Supabase Connection - Quick Reference

## 📝 Your Supabase Credentials (Keep Safe!)

Save this somewhere safe:
```
Project URL: https://xxxxx.supabase.co
Project Ref: xxxxx

Database Details:
- Host (Pooler): aws-0-xx-yyyy.pooler.supabase.com
- Port: 6543
- Database: postgres
- Username: postgres.xxxxx
- Password: [YOUR PASSWORD]
```

Get these from: https://app.supabase.com > Your Project > Settings > Database

---

## ⚡ 3-Minute Setup

### Step 1: Update Backend (.env)
Edit `backend/.env` and update:
```env
DB_CONNECTION=pgsql
DB_HOST=aws-0-xx-yyyy.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.xxxxx
DB_PASSWORD=your-password-here
```

### Step 2: Run Migrations
```bash
cd backend
php artisan migrate
```

### Step 3: Start Servers
```bash
# Terminal 1
cd backend && php artisan serve

# Terminal 2
cd frontend && npm run dev
```

### Step 4: Test
Visit http://localhost:5173

---

## 🧪 Verify Connection

```bash
cd backend

# Automatic test
php artisan supabase:test

# Or manual test
php artisan tinker
>>> DB::select('SELECT 1');
>>> exit
```

Expected: ✅ Connection SUCCESS

---

## 🎯 Create Test Users

```bash
cd backend
php artisan tinker
```

Paste this:
```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::create(['name'=>'Admin','email'=>'admin@studio.com','password'=>Hash::make('password'),'role'=>'admin']);
User::create(['name'=>'Client','email'=>'client@studio.com','password'=>Hash::make('password'),'role'=>'client']);

exit
```

Login with: `admin@studio.com` / `password`

---

## 📖 Full Guides Available

- **SUPABASE_SETUP.md** - Complete setup guide
- **SUPABASE_QUICKSTART.md** - Step-by-step manual setup
- **SUPABASE_VERIFICATION.md** - Verification checklist
- **setup-supabase.ps1** - Automated PowerShell script

---

## 🔥 Common Commands

```bash
# Test connection
php artisan supabase:test

# Create tables
php artisan migrate

# Reset database (⚠️ deletes data!)
php artisan migrate:reset && php artisan migrate

# See all routes
php artisan route:list

# Clear cache
php artisan cache:clear && php artisan route:clear

# Interactive shell
php artisan tinker

# Run dev servers
php artisan serve          # Backend
npm run dev               # Frontend
```

---

## ❓ Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Check `.env` credentials (copy from Supabase) |
| SSL error | Make sure `sslmode => 'require'` in config/database.php (already done) |
| Tables not created | Run `php artisan migrate` |
| Can't login | Create users with `php artisan tinker` |
| API errors in browser | Check browser console (F12) and backend logs |
| npm errors | Run `npm install --legacy-peer-deps` |

---

## 📊 Useful Links

- **Supabase Dashboard:** https://app.supabase.com
- **Your Project Database:** https://app.supabase.com/projects → Select Project → Database
- **API Documentation:** In Supabase Dashboard > Documentation
- **Supabase Docs:** https://supabase.com/docs

---

## 🎉 Next Steps

Once connected:
1. ✅ Create services (Admin > Services)
2. ✅ Upload portfolio items (Admin > Portfolio)
3. ✅ Test booking flow (Client > Services > Book)
4. ✅ Test admin features (Admin > Bookings, Reports)
5. ✅ Deploy to production

---

## 💡 Pro Tips

1. **Use Supabase Dashboard** to view/edit data directly
2. **Check backend logs** for debugging: `tail -f backend/storage/logs/laravel.log`
3. **Use browser DevTools** (F12) to check API responses
4. **Keep API_URL updated** when deploying frontend elsewhere
5. **Save your DB password** somewhere secure for production

---

**You're all set! Start with:** `php artisan supabase:test` ✨
