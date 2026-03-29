# Authentication Investigation: Invalid Login Credentials Error

## Executive Summary
The "invalid login credentials" error is likely caused by **credentials mismatch between test scripts and actual database users**. The test login scripts attempt to use credentials (`admin@gmail.com` / `admin123`) that don't exist in the seeded database.

---

## 1. LOGIN ENDPOINT ANALYSIS

### Location: [AuthController.php](backend/app/Http/Controllers/AuthController.php#L35-L50)

**Login Flow:**
```php
public function login(Request $request)
{
    // 1. Validate input
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    // 2. Find user by email
    $user = User::where('email', $validated['email'])->first();

    // 3. Verify password (CRITICAL LINE)
    if (!$user || !Hash::check($validated['password'], $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // 4. Create API token
    $token = $user->createToken('auth_token')->plainTextToken;

    // 5. Return user + token
    return response()->json([
        'user' => $user,
        'token' => $token,
    ]);
}
```

**Validation Details:**
- ✅ Email validation is correct
- ✅ Password comparison uses `Hash::check()` (correct for bcrypt passwords)
- ✅ Token creation uses Laravel Sanctum (correct)
- ✅ Returns proper JSON responses

---

## 2. ROOT CAUSE: CREDENTIALS MISMATCH ⚠️

### Test Scripts Use Wrong Credentials

**File: [test_login.php](backend/test_login.php)**
```
Email: admin@gmail.com
Password: admin123
```

**File: [test_login_raw.php](backend/test_login_raw.php)**
```
Email: admin@gmail.com
Password: admin123
```

### Actual Database Users (From Seeder)

**File: [DatabaseSeeder.php](backend/database/seeders/DatabaseSeeder.php)**
```php
User::factory()->create([
    'name' => 'Admin User',
    'email' => 'admin@studio.com',     // ❌ Different email!
    'role' => 'admin',
]);

User::factory()->create([
    'name' => 'Test Client',
    'email' => 'client@example.com',   // ❌ Different email!
    'role' => 'client',
]);
```

### Default Password

**File: [UserFactory.php](backend/database/factories/UserFactory.php#L28)**
```php
'password' => static::$password ??= Hash::make('password'),
// ❌ Password is 'password', NOT 'admin123'
```

### Alternative Users (From create_users.php)

**File: [create_users.php](backend/create_users.php)**
- admin@studio.com / password
- client@studio.com / password

---

## 3. DATABASE SETUP VERIFICATION

### User Table Migration
✅ [create_users_table.php](backend/database/migrations/0001_01_01_000000_create_users_table.php) is properly defined:
```sql
CREATE TABLE users (
    id bigint PRIMARY KEY,
    name varchar,
    email varchar UNIQUE,
    password varchar,
    role enum('admin', 'client') DEFAULT 'client',
    timestamps
);
```

### Database Connection
✅ Connected to Supabase PostgreSQL:
```
DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-southeast-2.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.kfjljerbuieggbgxrgww
```

### Required Tables Status
- ✅ `users` table (migration: 0001_01_01_000000)
- ✅ `personal_access_tokens` table (for Sanctum - migration: 2026_03_29_035106)

---

## 4. AUTHENTICATION FLOW ARCHITECTURE

### Frontend → Backend Flow

**Frontend: [Login.jsx](frontend/src/pages/auth/Login.jsx)**
```javascript
const handleSubmit = async (e) => {
  const user = await login(email, password);
  // Routes to dashboard based on user.role
}
```

**Frontend: [authService.js](frontend/src/services/authService.js)**
```javascript
login: (email, password) => api.post('/login', { email, password })
```

**Frontend: [api.js](frontend/src/services/api.js)**
```javascript
baseURL: 'http://localhost:8000/api'
// ✅ Correct API endpoint
```

**API Route: [routes/api.php](backend/routes/api.php#L13)**
```php
Route::post('/login', [AuthController::class, 'login']);
```

✅ All connections properly configured, CORS enabled for localhost:5173

---

## 5. IDENTIFIED ISSUES

### 🔴 CRITICAL: Credential Discrepancy

| Source | Email | Password |
|--------|-------|----------|
| **Test Scripts** | admin@gmail.com | admin123 |
| **DatabaseSeeder** | admin@studio.com | password |
| **create_users.php** | admin@studio.com | password |
| **Frontend Form** | (user input) | (user input) |

**Impact:** Any login attempt using `admin@gmail.com` or `admin123` will fail with "Invalid credentials"

### ⚠️ IMPORTANT: Possible User Table Empty

If migrations haven't been run or seeding hasn't been executed:
- No users exist in the database
- ALL login attempts will fail
- Check if migrations were run: `php artisan migrate`
- Check if seeding was run: `php artisan db:seed`

### ⚠️ Database Instance Status

No connection tests found. Confirm:
- Supabase PostgreSQL is accessible at `aws-1-ap-southeast-2.pooler.supabase.com:6543`
- Credentials in `.env` are correct and not expired
- Network connectivity to Supabase is available

---

## 6. PASSWORD HASHING VERIFICATION

User table includes `password` column configured for hashing:

**File: [User.php](backend/app/Models/User.php#L42-L46)**
```php
protected function casts(): array
{
    return [
        'password' => 'hashed',  // ✅ Automatically hashes on save
    ];
}
```

When users are created, passwords are automatically hashed using bcrypt with `BCRYPT_ROUNDS=12`.

---

## 7. AUTHENTICATION MIDDLEWARE & TOKENS

**Token Generation:** Uses Laravel Sanctum
- ✅ Tokens created via `$user->createToken('auth_token')->plainTextToken`
- ✅ Stored in `personal_access_tokens` table
- ✅ Frontend stores token in localStorage and sends via `Authorization: Bearer {token}` header

**CORS Configuration:** [config/cors.php](backend/config/cors.php)
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
]
```
✅ Frontend origins are whitelisted

---

## 8. SUMMARY OF PROBLEMS

### Problem 1: Test Scripts Use Non-Existent User ⚠️
- Test scripts try: `admin@gmail.com` / `admin123`
- Database has: `admin@studio.com` / `password`
- **Solution:** Update test scripts or create matching user

### Problem 2: Possible Empty User Table ⚠️
- If migrations haven't been run, no users exist
- If seeding hasn't been run, default test users aren't created
- **Solution:** Run `php artisan migrate` and `php artisan db:seed`

### Problem 3: Unknown Database State ⚠️
- No way to verify current user records from investigation
- Supabase connection may have issues
- **Solution:** Connect to database and verify users exist and passwords are hashed

---

## 9. RECOMMENDATIONS

### Immediate Actions
1. **Verify Database State**
   ```bash
   php artisan tinker
   > User::count()  // Should show users exist
   > User::all()    // Check what users exist
   ```

2. **Fix Test Scripts**
   Update `test_login.php` and `test_login_raw.php` to use correct credentials:
   ```php
   'email' => 'admin@studio.com',
   'password' => 'password'
   ```

3. **Ensure Database is Seeded**
   ```bash
   php artisan migrate:fresh --seed
   ```

4. **Test Login with Known Good Credentials**
   - Email: `admin@studio.com` or `client@example.com`
   - Password: `password`

### Debugging Commands
```bash
# Check if user exists
php artisan tinker
> User::where('email', 'admin@gmail.com')->first()  // Will return null

# Verify password hashing
php artisan tinker
> use Illuminate\Support\Facades\Hash;
> Hash::check('password', $user->password)  // Should return true
```

### If Still Failing
1. Check Laravel logs: `storage/logs/laravel.log`
2. Verify Supabase PostgreSQL connection
3. Test directly with curl:
   ```bash
   curl -X POST http://localhost:8000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@studio.com","password":"password"}'
   ```

---

## 10. CONCLUSION

**ROOT CAUSE:** The test scripts and actual database credentials do not match. The AuthController login logic is **correct**, but it correctly rejects logins with non-existent or mismatched credentials.

**NEXT STEP:** Verify the actual users in the database and ensure frontend/test scripts use matching credentials from that database.
