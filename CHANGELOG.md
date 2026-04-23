# Project Changelog

## [2026-04-23] - Design Standardisation & Route Restructuring

### Added
- **Gallery Page**: Added a new client-facing Gallery route at `/client/Gallery`.
- **Contact Link**: Added "Contact" to the public homepage navigation for non-logged-in users.
- **Documentation**: Created `documentation.md` covering Tech Stack, Database Schema, and Core Functionalities.

### Changed
- **Client Landing Page**: Renamed the client starting page from `/client/dashboard` to **`/client/homepage`**.
- **Unified Hero Experience**: 
  - The client homepage now perfectly mirrors the high-impact style of the public site, using the cinematic video background by default.
  - Heading updated to: **"Manage Your Visual Story."** with the signature split-color typography.
  - Personalized welcome messages (e.g., "WELCOME BACK, [NAME]") now appear at the top of the client portal.
- **Enhanced Navigation**: 
  - Added smooth scroll-to-top behavior for the primary "Homepage" link and "LIGHT" logo.
  - Updated all login and social authentication redirects to point directly to the new `/client/homepage`.

### Fixed
- **Navigation Maps**: Updated internal route maps in `homepage.jsx` to ensure smooth scrolling and redirection after route renaming.
