# 📊 LIGHTWORKS | Master Database Schema Blueprint

This document defines the structural DNA of the **LIGHTWORKS Studio Portal**. The database uses **MySQL (Aiven Cloud)** with **UUIDs** for high-security, unique record identification.

---

### 👤 Identity Layer: `users`
Manages clients and administrative access.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Auto-increment primary key |
| `name` | String | Full name of the user |
| `email` | String (Unique) | Primary contact and login identifier |
| `role` | Enum | `client`, `admin` (Default: `client`) |
| `google_id` | String | Unique identifier for Google OAuth |
| `avatar` | String | URL to the user's profile image |
| `email_verified_at` | Timestamp | Date of email verification |
| `deleted_at` | SoftDelete | Standard Laravel soft deletion |

---

### 💎 Product Layer: `services`
Defines the luxury packages and studio offerings.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique package identifier |
| `name` | String | Package Name (e.g., The Signature Wedding) |
| `description` | Text | Detailed breakdown of the service |
| `category` | String | Wedding, Portrait, Commercial, etc. |
| `price` | Decimal(10,2) | Base price of the package |
| `downpayment_amount`| Decimal(10,2) | Required deposit to secure the date |
| `duration` | Integer | Duration in minutes |
| `image_path` | String | URL to the signature package image |
| `inclusions` | JSON | List of package features and deliverables |

---

### 📐 Manifest Layer: `bookings`
The core engine tracking all studio reservations.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique booking identifier |
| `user_id` | BigInt (FK) | Reference to the Client |
| `service_id` | UUID (FK) | Reference to the Package |
| `booking_date` | Date | Scheduled date of the session |
| `booking_time` | Time | Scheduled start time |
| `location` | String | Venue or studio destination |
| `status` | Enum | `pending`, `confirmed`, `paid`, `finished`, `cancelled`, `rejected` |
| `total_amount` | Decimal(10,2) | Final calculated price including add-ons |
| `paid_amount` | Decimal(10,2) | Total amount settled via PayMongo |
| `special_requests` | Text | Client's Creative Vision / Notes |
| `admin_notes` | Text | Studio's internal notes and replies |

---

### 💳 Transaction Layer: `payments`
Detailed records of all PayMongo financial interactions.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique transaction identifier |
| `booking_id` | UUID (FK) | Reference to the parent booking |
| `amount` | Decimal(10,2) | Amount settled in this transaction |
| `payment_method` | String | GCash, Maya, Card, etc. |
| `transaction_reference`| String | PayMongo reference ID |
| `status` | String | `succeeded`, `failed`, `pending` |

---

### 📸 Visual Layer: `portfolios`
Manages the artistic galleries displayed on the portal.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique portfolio identifier |
| `title` | String | Gallery Title (e.g., Ethereal Grace) |
| `category` | String | Artistic category |
| `image_path` | String | URL to the high-resolution artwork |

---

### 🔗 Relationship Layer: `booking_add_on`
Pivot table connecting bookings to their enhancements.
| Column | Type | Description |
| :--- | :--- | :--- |
| `booking_id` | UUID (FK) | Links to the main booking |
| `add_on_id` | UUID (FK) | Links to the specific enhancement |

---

**© 2026 LIGHTWORKS STUDIO | Master Schema Version 2.4 (Cloud Optimized)**
