# 🛠️ LIGHTWORKS | Master Functionality Manifest

This document provides a comprehensive breakdown of all features and system logic implemented in the **LIGHTWORKS Studio Portal**. Every interaction has been designed to follow the "Studio Elite" aesthetic and professional operational standards.

---

### 👤 Client Experience (The Boutique Portal)

#### **1. Authentication & Identity**
*   **Google OAuth Integration**: One-tap secure login via Google accounts.
*   **Session Management**: Persistent authenticated sessions with automatic redirection.
*   **User Profiles**: Automatic avatar and name synchronization from social accounts.

#### **2. Service Discovery & Curation**
*   **Luxury Service Gallery**: Browsing signature packages (Wedding, Editorial, etc.) with high-resolution visual previews.
*   **Dynamic Package Data**: Real-time display of inclusions, duration, and downpayment requirements.
*   **Artistic Portfolios**: Viewable gallery collections organized by aesthetic category.

#### **3. The Booking Engine**
*   **Logistics Input**: Date and time selection with automated availability checks.
*   **Creative Vision Manifest**: A dedicated input for clients to define their session's artistic direction.
*   **Venue Selection**: Dynamic location input for on-site or studio destinations.
*   **Enhancement Selection**: Optional add-on selection (Drone, Photo Booth, Express Editing) with real-time price updates.

#### **4. My Bookings (The Personal Registry)**
*   **Compact Card Registry**: A sleek, editorial-style list of all past and upcoming sessions.
*   **Live Status Tracking**: Real-time badges for `Pending`, `Confirmed`, `Paid`, `Finished`, `Cancelled`, and `Rejected`.
*   **Ultra-Compact Details Popup**: A deep-dive manifest view with Arial-font vision notes and detailed price breakdowns.
*   **Smart Action Controls**: Context-aware buttons (Settle Payment, View Details) based on the current booking state.

#### **5. Financial Settlement (PayMongo)**
*   **Secure Checkout**: Integration with PayMongo for GCash, Maya, and Card payments.
*   **Downpayment Logic**: Enforced deposit requirement to secure confirmed bookings.
*   **Balance Settlement**: Ability to pay remaining balances directly from the registry.
*   **Luxury Success Overlay**: A boutique confirmation screen with cinematic animations upon successful payment.

---

### 🛡️ Admin Experience (The Command Center)

#### **1. Global Booking Manager**
*   **10-Row Pagination**: A high-performance, paginated directory for managing large volumes of reservations.
*   **Live Node Counter**: Real-time tracking of active bookings in the global system.
*   **Quick-Decision Controls**: One-tap icons to Confirm, Reject, Finish, or Cancel sessions.
*   **Decision Logging**: Ability to attach "Studio Messages" (Admin Notes) to any booking decision.

#### **2. Logistics Manifest Detail**
*   **Full Data View**: Expanded table view showing user contact, package details, and financial balances.
*   **Google Maps Navigation**: One-click link to open the session venue directly in Google Maps for studio logistics.

#### **3. Personnel & Profile Management**
*   **Boutique Directory**: Dedicated interface for managing studio personnel and clientele.
*   **Archival Logic (Soft Delete)**: Ability to "Deactivate" profiles, moving them to a secure archive rather than permanent deletion.
*   **Profile Recovery**: One-tap restoration of archived accounts to active status.
*   **Nuclear Purge**: Option for permanent database removal of decommissioned profiles.

#### **4. Revenue & Financial Intelligence**
*   **Income Analytics**: Real-time visualization of studio earnings and pending balances.
*   **Settlement Tracking**: Comprehensive log of all GCash, Maya, and Card transactions.

#### **5. Content & Package Management**
*   **Service Editor**: Full CRUD (Create, Read, Update, Delete) for luxury packages.
*   **Portfolio Management**: Ability to curate and update the artistic gallery.

---

### 🛰️ System & Branding Logic

#### **1. Notification Concierge**
*   **Real-Time Alerts**: Intelligent bell system that notifies users of booking status updates or payment confirmations.
*   **Smart Redirection**: Context-aware notifications that take users directly to the relevant booking or report.
*   **Global Registry**: Centralized management of read/unread studio communications.

#### **2. Cloud Infrastructure (Aiven)**
*   **Persistent Sync**: Real-time data storage in the Aiven Cloud MySQL database.
*   **SSL Encryption**: Secure, encrypted communication bridge for all database operations.
*   **Soft Delete Protection**: Safe archival system to preserve database integrity and historical records.

#### **2. The "Studio Elite" Design Engine**
*   **Vogue Oyster Palette**: System-wide use of Oyster (`#FAF9F6`), Onyx (`#111111`), and Champagne Gold (`#C5A059`).
*   **Cinema Animations**: Custom `animate-cinemaShow` and `animate-glassPop` transitions for all modals and overlays.
*   **Architectural UI**: Responsive, space-efficient layouts designed to feel like a high-end fashion magazine.

---

**© 2026 LIGHTWORKS STUDIO | Functional Manifest Version 3.1**
