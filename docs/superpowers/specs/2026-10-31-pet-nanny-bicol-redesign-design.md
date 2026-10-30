# Pet Nanny Bicol — Minimalist Website, Mobile App & Owner Dashboard Design Spec

**Date:** 2026-10-31
**Project:** Pet Nanny Bicol (`https://petnannybicol.vercel.app` & Facebook `61591940078723`)
**Skills Applied:** `superpowers:brainstorming`, `ui-ux-pro-max`, `superpowers:writing-plans`

---

## 1. Intent & Why

Pet Nanny Bicol (founded by Krizzia in Daet, Camarines Norte and Naga City, Camarines Sur) provides dog walking, day visits, 8–12 hr in-home sitting, and overnight pet care backed by NGO rescue volunteers (*Daet Saving Strays*).

### Problems Identified in Current Version
1. **Cluttered, heavy Neo-Brutalist desktop layout on phones:** Thick 3px borders, rotated cards, custom paw cursors, and a 4,700-line monolithic HTML file make reading and booking on a phone uncomfortable.
2. **Broken currency encoding (`?` instead of `₱`):** Multiple prices on both the public site and `/admin` dashboard render as `?350` or `?1,200-1,800` due to character encoding corruption.
3. **Desktop-only Owner Dashboard (`/admin`):** Fixed 240px sidebar and 8-column tables overflow on mobile screens, making it hard for owners to confirm bookings or block dates on the go.
4. **No standalone mobile app package:** Furparents and owners want a dedicated Android/iOS mobile app experience tailored for thumb navigation rather than a squished desktop webpage.

---

## 2. Goals, Non-Goals & Constraints

### Goals
- **Minimalist & Warm Visual Redesign (`ui-ux-pro-max`):** Replace heavy neo-brutalist borders and visual noise with a clean, spacious **Minimalism & Swiss Style** design system (`#FFF7ED` soft warm background, `#FFFFFF` elevated cards, `#F97316` warm amber-orange primary, `#2563EB` trust blue accent, `#0F172A` / `#9A3412` high-contrast typography in `Varela Round` + `Nunito Sans`).
- **Complete Feature & Content Parity:** Preserve all authentic Pet Nanny Bicol content:
  - 4 Core Services: Dog Walking (`₱350/pet`), Day Visit (`₱350–500/visit`), In-Home Sitting 8–12 hrs (`₱600–900/pet`), Overnight Care (`₱1,200–1,800/night`).
  - 4 Add-ons: Medication care (`₱150–300`), Premium add-ons (`₱200/day`), Pet taxi within Daet (`₱350`), Overtime (`₱200/hr`), plus Wi-Fi CCTV & smart auto-feeder setup.
  - 4-Step How It Works process with verified Gov't ID, Barangay, and NBI clearances.
  - Live "Watch the Wag" Pupdate Feed (Walk GPS, Smart Feeder, Wi-Fi CCTV, Cuddle logs).
  - Krizzia's "Dog Whisperer" & *Daet Saving Strays* rescue volunteer story.
  - "Human Says / Pet Says" dual-perspective reviews.
  - Verified Booking Flow with date closure check, 10% first-booking discount calculation, 6-digit OTP verification, and WhatsApp (`+63 956 902 5256`) handoff.
- **Full-Featured Owner Dashboard:** Bookings Queue (status workflow, search, filter, WhatsApp deep link, CSV export), Monthly Calendar & Date Closures, Financials & Analytics, Services Catalog editor, and Reviews/Content moderation.
- **Dedicated Downloadable Mobile App (`mobile/`):** React Native + Expo application configured with `app.json` and `eas.json` for downloadable Android (`.apk` / `.aab`) and iOS App Store (`.ipa`) builds, featuring a 5-tab bottom navigation bar (`Home`, `Services`, `Pupdates`, `Book`, `Owner`).

### Non-Goals
- Over-complicated multi-tenant marketplace registration (Pet Nanny Bicol is Krizzia's dedicated Bicol team).
- Using emojis as UI icons (strictly forbidden by `ui-ux-pro-max`; all icons must be crisp vector SVGs).

### Constraints
- All currency values must strictly format with `₱` (`PHP`).
- Touch targets on mobile must be `>= 44pt` (iOS) / `>= 48dp` (Android) with `>= 8px` spacing.
- Must connect to live `https://petnannybicol.vercel.app/api/*` endpoints when reachable and gracefully fall back to deterministic local storage + sandbox OTP verification so every feature works offline and in local environments.

---

## 3. Architectural Approaches Considered

1. **Approach A (Selected): Unified Monorepo with Shared Domain Core, Minimalist React + TypeScript Web/Dashboard App, and Expo React Native Mobile App (`mobile/`)**
   - **Structure:**
     - `src/core/`: Pure TypeScript domain logic, data catalog, pricing calculator, validators, OTP & booking state engine, CSV exporter, and API client with offline fallback (100% unit-tested via Vitest).
     - `src/` (Web & Owner Dashboard): Vite + React + TypeScript minimalist web application with Customer Website, Owner Dashboard (`/admin` view), and an interactive Mobile App Preview Drawer for instant desktop comparison.
     - `mobile/` (Android & iOS App): Standalone React Native (Expo) TypeScript project with native bottom tabs, thumb-zone booking wizard, mobile owner dashboard, and `eas.json` build profiles for downloadable Android `.apk`/`.aab` and iOS `.ipa` packages.
   - **Tradeoffs:** Best separation of concerns, zero duplicated business rules, instant web deployment, and standard EAS Android/iOS store packaging.

2. **Approach B: Web-only wrapper with Capacitor**
   - **Rejected because:** Wrapping a desktop layout in a WebView was the exact pain point the user experienced on their phone.

3. **Approach C: Separate disconnected repositories**
   - **Rejected because:** Pricing, service catalog, and booking logic would drift between web and mobile.

