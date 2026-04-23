# Project Changelog

## [2026-04-23] - Design Standardisation & Route Restructuring

### Added
- **Gallery Page**: Added a new client-facing Gallery route at `/client/Gallery`.
- **Contact Link**: Added "Contact" to the public homepage navigation for non-logged-in users.
- **Documentation**: Created `documentation.md` covering Tech Stack, Database Schema, and Core Functionalities.

### Changed
- **Route Renaming (Case-Sensitive & Plural)**:
  - `/client/services` ➔ **`/client/Packages`** (plural)
  - `/client/Portfolio`
  - `/client/Gallery`
  - `/client/MyBookings`
  - Fixed all internal navigation links (Dashboard, Checkout, My Bookings) to point to the new `/client/Packages` route.
- **Enhanced Navigation**: 
  - Added smooth scroll-to-top behavior for the primary "Homepage" link and "LIGHT" logo.
  - Updated all login and social authentication redirects to point directly to the new `/client/homepage`.

### Fixed
- **Navigation Maps**: Updated internal route maps in `homepage.jsx` to ensure smooth scrolling and redirection after route renaming.
