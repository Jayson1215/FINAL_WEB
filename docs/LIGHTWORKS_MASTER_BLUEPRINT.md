# 📸 LIGHTWORKS | The Complete Studio Blueprint

This is the absolute master document for the **LIGHTWORKS Studio Portal**. It combines the technical architecture, the database DNA, and the complete functional roadmap into one unified manifest.

---

## 🛠️ I. TECHNOLOGY STACK
The high-end architecture powering the LIGHTWORKS experience.

### 🎨 Frontend (UI/UX)
*   **React (JavaScript)**: The core engine for the high-end, reactive user interface.
*   **Vite**: Modern build tool for fast development and optimized production bundles.
*   **TailwindCSS**: Utility-first CSS framework for our bespoke "Studio Elite" design system.
*   **Framer Motion**: Fluid cinema-style animations (Cinema Fade, Glass Pop).
*   **React Router**: Seamless client-side navigation.
*   **Lucide React & Heroicons**: Minimalist, high-contrast iconography.

### ⚙️ Backend (API & Logic)
*   **Laravel (PHP)**: Robust backend framework for business logic and security.
*   **Eloquent ORM**: Intuitive database communication.
*   **Laravel Sanctum**: Secure API authentication.
*   **Laravel Socialite**: Google OAuth integration.

### 🛰️ Infrastructure & Database
*   **Aiven Cloud (MySQL)**: Managed cloud database with **SSL Encryption**.
*   **PayMongo API**: Integrated digital payments (GCash, Maya, Cards).
*   **Vercel & Render**: Production hosting for Frontend and Backend.

---

## 📊 II. DATABASE SCHEMA
The structural DNA of the studio data stored in the Aiven Cloud.

### 1. Identity: `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Auto-increment primary key |
| `name` | String | Full name |
| `email` | String | Login identifier |
| `role` | Enum | `client`, `admin` |
| `google_id` | String | Social auth ID |

### 2. Product: `services`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique package identifier |
| `name` | String | Package Name (e.g., The Signature Wedding) |
| `price` | Decimal | Base price of the package |
| `downpayment_amount` | Decimal | Required deposit |
| `image_path` | String | Signature package image URL |

### 3. Manifest: `bookings`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique booking identifier |
| `user_id` | FK | Links to Client |
| `service_id` | FK | Links to Package |
| `status` | Enum | `pending`, `confirmed`, `paid`, `finished`, `cancelled`, `rejected` |
| `location` | String | Venue or studio destination |
| `total_amount` | Decimal | Final price including add-ons |
| `paid_amount` | Decimal | Amount settled via PayMongo |
| `special_requests` | Text | Client's Creative Vision (Arial Font) |

### 4. Transactions: `payments`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique transaction ID |
| `booking_id` | FK | Parent booking link |
| `amount` | Decimal | Transaction amount |
| `transaction_reference`| String | PayMongo reference ID |

---

## 🛠️ III. FUNCTIONALITY MANIFEST
Every interaction and logic path implemented in the portal.

### 👤 Client Experience
*   **Google OAuth**: Seamless social authentication.
*   **Luxury Service Gallery**: Browsing packages with high-res previews.
*   **Dynamic Booking Engine**: Date/Time/Venue selection + Creative Vision input.
*   **Enhancement Selection**: Real-time Add-on pricing (Drone, Photo Booth).
*   **Manifest Registry (My Bookings)**: Compact card view with status tracking.
*   **Ultra-Compact Popup**: Deep-dive manifest view with detailed breakdowns.
*   **Boutique Checkout**: PayMongo integration for downpayments and balances.
*   **Success Confirmation**: Luxury glassmorphic overlay upon payment.

### 🛡️ Admin Experience
*   **10-Row Pagination**: High-performance directory for global booking management.
*   **Live Node Counter**: Real-time tracking of active system bookings.
*   **Quick-Decision Controls**: One-tap Confirm, Reject, Finish, or Cancel.
*   **Decision Logging**: Attaching studio messages to booking actions.
*   **Logistics Sync**: Direct Google Maps link for venue navigation.

### ✨ Luxury Branding Engine
*   **Vogue Oyster Palette**: Oyster (`#FAF9F6`), Onyx (`#111111`), Champagne Gold (`#C5A059`).
*   **Cinema Transitions**: Custom `animate-cinemaShow` and `animate-glassPop`.
*   **Editorial Layouts**: Compact, space-efficient, and professional typography.

---

**© 2026 LIGHTWORKS STUDIO | Complete Master Blueprint v4.0 (Cloud Verified)**
