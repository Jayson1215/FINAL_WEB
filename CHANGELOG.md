# Project Changelog

## [2026-04-23] - Design Standardisation & Route Restructuring

### Added
- **Gallery Page**: Added a new client-facing Gallery route at `/client/Gallery`.
- **Contact Link**: Added "Contact" to the public homepage navigation for non-logged-in users.
- **Documentation**: Created `documentation.md` covering Tech Stack, Database Schema, and Core Functionalities.

### Changed
- **"Book Now" Standardization**: 
  - Replaced all "Request Session →" and "Submit Booking" buttons with consistent **"Book Now"** text.
  - Removed all legacy arrow icons and text overlays from service images.
- **Route Renaming (Case-Sensitive)**:
  - `/client/services` ➔ `/client/Package`
  - `/client/portfolio` ➔ `/client/Portfolio`
  - `/client/bookings` ➔ `/client/MyBookings`
- **Homepage Navigation**:
  - "Atelier" ➔ **"About Us"**.
  - Reordered navigation links for better UX.
- **Dashboard Experience**:
  - Replaced the static gradient banner with a **Cinematic Video Background** using the provided camera lens footage.
  - Updated typography and layout for a "Command Center" aesthetic.
- **Package Management**:
  - Renamed `ServicesList.jsx` components to `PackageList.jsx` for consistency with the new naming convention.

### Fixed
- **Navigation Maps**: Updated internal route maps in `homepage.jsx` to ensure smooth scrolling and redirection after route renaming.
