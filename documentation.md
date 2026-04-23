# Project Documentation: LIGHT Photography Concierge Portal

## 1. Tech Stack
The application is built using a modern decoupled architecture, ensuring high performance, scalability, and a premium user experience.

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (v18+)
- **Build Tool**: [Vite](https://vitejs.dev/) (Lightning-fast development and bundling)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) & [Tailwind CSS](https://tailwindcss.com/) (Custom design system with glassmorphism and fluid animations)
- **Routing**: [React Router DOM](https://reactrouter.com/) (Multi-page routing with lazy loading)
- **State Management**: [React Context API](https://reactjs.org/docs/context.html) (Auth and Global state)
- **HTTP Client**: [Axios](https://axios-http.com/) (Interceptors for JWT handling)
- **Maps**: [Google Maps API](https://developers.google.com/maps) (Location picking for on-call services)

### Backend
- **Framework**: [Laravel](https://laravel.com/) (v12+)
- **Language**: [PHP](https://www.php.net/) (v8.2+)
- **Authentication**: [Laravel Sanctum](https://laravel.com/docs/sanctum) (SPA/API Token auth)
- **Social Auth**: [Laravel Socialite](https://laravel.com/docs/socialite) (Google/OAuth integration)
- **Database**: [MySQL](https://www.mysql.com/) (Local/Production) or SQLite (Testing)
- **Real-time**: Custom Notification System (Admin-to-Client communication)

---

## 2. Database Schema
The database is structured to support multi-tenant-like isolation for clients and granular management for admins.

### Core Tables

#### `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Unique user identifier |
| `name` | String | Full name of the client/admin |
| `email` | String (Unique) | Login credential |
| `password` | String | Hashed password |
| `role` | Enum | `client`, `admin` |
| `google_id` | String | For OAuth authentication |

#### `services` (Packages)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Unique package identifier |
| `name` | String | Title of the photography package |
| `description`| Text | Detailed offering summary |
| `inclusions` | Text | Bulleted list of what's included |
| `price` | Decimal | Total investment amount |
| `duration` | Integer | Duration in minutes |
| `image_path` | String | Link to the package hero image |

#### `bookings` (Sessions)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Unique booking identifier |
| `user_id` | Foreign Key | Link to the client |
| `service_id` | Foreign Key | Link to the package |
| `booking_date`| Date | Scheduled session date |
| `booking_time`| Time | Scheduled start time |
| `location` | String | Venue address or Google Maps coordinates |
| `status` | Enum | `pending`, `confirmed`, `awaiting_payment`, `paid`, `rejected`, `finished` |
| `total_amount`| Decimal | Final price at time of booking |
| `admin_notes` | Text | Feedback/Reasoning from the studio manager |

#### `portfolios`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Unique identifier |
| `title` | String | Name of the masterpiece |
| `image_url` | String | Path to the high-res asset |
| `category` | String | e.g., Editorial, Wedding, Portrait |

---

## 3. Core Functionalities

### Client Experience (The Concierge Portal)
- **Premium Dashboard**: A "Command Center" featuring cinematic video backgrounds and real-time stats of their photography journey.
- **On-Call Booking**: 
  - Dynamic map integration for choosing the exact location of the shoot.
  - Smart scheduling with date/time validation.
- **Booking Registry**:
  - Real-time status tracking.
  - Detailed view of session specifics and admin feedback.
- **Masterpiece Gallery**: 
  - Categorized portfolio browsing.
  - High-res "Masterpiece View" modals for deep inspection.
- **Notification Center**: Instant alerts when a booking is approved, rejected, or requires payment.

### Admin Experience (The Studio Manager)
- **Management Dashboard**:
  - Financial overview (Total Revenue, Yield per Session).
  - Fulfilment rate tracking.
  - Recent activity feed for rapid action.
- **Service Orchestration**:
  - Create and edit packages.
  - **Portfolio-to-Package**: Ability to convert successful portfolio shots into bookable packages with one click.
- **Workflow Control**:
  - Review incoming requests.
  - Confirm availability or reject with specific notes.
  - Verify payments and update project status to "Finished".

---

## 4. Design Aesthetics
The project follows a **"Luxury Command Center"** design language:
- **Glassmorphism**: Translucent panels with background blurs.
- **Typography**: High-end Serif (Playfair Display/Outfit) paired with bold, spaced Sans-Serif.
- **Palette**: Deep Navy (`#1E293B`), Studio Orange (`#E8734A`), and Soft Mist (`#F0F2F5`).
- **Motion**: Fluid animations using CSS transitions and Intersection Observer for "reveal-on-scroll" effects.
