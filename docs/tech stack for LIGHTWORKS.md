# 📸 LIGHTWORKS | Master Technology Manifest

This document outlines the high-end architecture and technology stack powering the **LIGHTWORKS Studio Portal**. The system is designed for high performance, cloud persistence, and a premium "Studio Elite" user experience.

---

### 🎨 Frontend Architecture (UI/UX)
*   **React (JavaScript)**: The core engine for the high-end, reactive user interface.
*   **Vite**: Modern frontend build tool providing lightning-fast development and optimized production bundles.
*   **TailwindCSS**: Utility-first CSS framework used to build the bespoke, "Studio Elite" design system.
*   **Framer Motion**: Powering the "Cinema Fade" and "Glass Pop" animations for a fluid, premium feel.
*   **React Router**: Handling seamless, single-page navigation (SPA) across the portal.
*   **Lucide React & Heroicons**: Providing minimalist, high-contrast iconography for the manifest and dashboard.

---

### ⚙️ Backend Infrastructure (API)
*   **Laravel (PHP)**: The robust backend framework managing business logic, security, and the API manifest.
*   **Eloquent ORM**: Providing high-speed, intuitive communication with the database.
*   **Laravel Sanctum**: Secure, token-based authentication for Users and Administrators.
*   **Laravel Socialite**: Integrated for the seamless **Google OAuth** login experience.
*   **RESTful API**: A structured communication layer between the React frontend and the Laravel backend.

---

### 🛰️ Cloud & Persistence (Database)
*   **Aiven Cloud (MySQL)**: Managed production database with secure, persistent storage and **SSL Encryption** (`ca.pem`).
*   **SQLite**: Used for rapid local development and prototyping.
*   **Redis**: Configured for high-speed caching and session management.

---

### 💳 Payment & Financials
*   **PayMongo API**: Primary payment gateway for high-end digital transactions (GCash, Maya, Credit Cards).
*   **Dynamic Manifesting**: Custom logic managing investments, paid amounts, and settlement flows.

---

### 🚀 Deployment & CI/CD
*   **Vercel**: Hosting the **Frontend**, providing global content delivery and automated deployment.
*   **Render**: Hosting the **Backend API**, ensuring the Laravel application is always responsive.
*   **GitHub**: Central repository for all source code and production deployment triggers.

---

### 📐 Design Philosophy (The "Studio Elite" System)
*   **Vogue Oyster Palette**: A curated high-contrast system (`#FAF9F6` Oyster, `#111111` Onyx, `#C5A059` Champagne Gold).
*   **Editorial Typography**: A sophisticated blend of **High-End Serif** for headings and **Arial/Sans-Serif** for manifest data.
*   **Architectural Spacing**: Focused on compact components, efficient layouts, and professional white space.

---

**© 2026 LIGHTWORKS STUDIO | Built for Professional Excellence.**
