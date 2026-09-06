# Rawabet Real Estate Brokerage Platform
## Complete Technical Handover Package & Backend Integration Specification

**Target Audience:** Backend Developers, DevOps Engineers, QA Engineers, Product Managers  
**Date:** September 2026  
**Version:** 1.0.0-PROD-READY  
**Application Type:** Single Page Application (SPA) with Enterprise Multi-Workspace Architecture  
**Primary Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Motion 12  

---

## Table of Contents
1. [Phase 1 — Frontend Audit & Architectural Review](#phase-1--frontend-audit--architectural-review)
2. [Phase 2 — Clean Frontend Structure & Code Organization](#phase-2--clean-frontend-structure--code-organization)
3. [Phase 3 — Complete Route & Screen Documentation](#phase-3--complete-route--screen-documentation)
4. [Phase 4 — Backend API Requirements Specification](#phase-4--backend-api-requirements-specification)
5. [Phase 5 — Database Entity & Schema Analysis (ERD Guide)](#phase-5--database-entity--schema-analysis-erd-guide)
6. [Phase 6 — Role-Based Access Control (RBAC) Matrix](#phase-6--role-based-access-control-rbac-matrix)
7. [Phase 7 — Frontend Finite State Machines & Lifecycle States](#phase-7--frontend-finite-state-machines--lifecycle-states)
8. [Phase 8 — Frontend Form Validation Rules](#phase-8--frontend-form-validation-rules)
9. [Phase 9 — Error Handling & UI Response Specifications](#phase-9--error-handling--ui-response-specifications)
10. [Phase 10 — DevOps & Deployment Specification](#phase-10--devops--deployment-specification)
11. [Phase 11 — QA & Test Automation Checklist](#phase-11--qa--test-automation-checklist)
12. [Phase 12 — Pending Backend Decisions & Architectural Contracts](#phase-12--pending-backend-decisions--architectural-contracts)

---

## Phase 1 — Frontend Audit & Architectural Review

### 1.1 Executive Summary
The frontend for **Rawabet Real Estate Brokerage (روابط للوساطة العقارية)** is fully implemented, verified with TypeScript strict checks (`tsc --noEmit`), and compiled into a production-ready client bundle.

### 1.2 System Audit Findings & Resolved Items
1. **Separation of Public vs. Internal Workspaces**:
   - The public marketplace and customer views are encapsulated with public navigation headers, footers, mobile bottom navigation, and search bars.
   - Internal staff (Operations Managers, Property Reviewers, Sales Agents, Super Admins) operate in a dedicated, distraction-free SaaS layout (`InternalPortalLayout`) with breadcrumb trails, quick stats bar, and role-guarded views.
2. **Anti-Disintermediation Engine**:
   - Direct seller contact information (phone numbers, full names, national IDs) and private cadastral addresses are strictly shielded from public API payloads and unauthenticated views.
   - Public users can only contact the central Rawabet brokerage desk via WhatsApp or direct phone calls, which automatically creates and tracks `Lead` records.
3. **Draft & Multi-Version Property Engine**:
   - Properties are decoupled from their versions (`Property` -> `PropertyVersion[]`).
   - Edits to published properties create a draft revision (`PENDING_REVIEW` or `DRAFT`) while the live published version continues serving public traffic until the review team approves the revision.
4. **Resilient Network Layer**:
   - `src/services/api.ts` implements an `ApiClient` with fallback capabilities. When the backend REST API is reachable, requests hit `VITE_API_BASE_URL`. If the backend is unreachable or undergoing maintenance, it falls back seamlessly to initial seed data, preventing white-screen crashes.

---

## Phase 2 — Clean Frontend Structure & Code Organization

### 2.1 Directory Structure
```text
src/
├── App.tsx                           # Main Application Controller & View Router
├── main.tsx                          # React 19 Root Entry Point
├── index.css                         # Tailwind CSS v4 Theme & Custom Directives
├── config/
│   └── env.ts                        # Centralized Environment Variables & Production Defaults
├── context/
│   └── AppContext.tsx                # Central State Management & Action Handlers
├── data/
│   └── initialData.ts                # Production Seed Data & Fixtures
├── services/
│   └── api.ts                        # REST API Client & Domain Service Adapters
├── types/
│   └── index.ts                      # Universal TypeScript Interfaces, Types, and Enums
└── components/
    ├── admin/                        # Super Admin & System Views
    │   ├── AdminLayout.tsx           # Legacy Backoffice Wrapper
    │   ├── AuditLogsView.tsx         # Immutable Security & Action Audit Trail
    │   ├── LeadsCRMView.tsx          # Standalone Sales Management View
    │   ├── LocationsAndTaxonomyView.tsx # Governorates, Cities, Areas Master Data
    │   ├── ReviewQueueView.tsx       # Property Engineering Queue
    │   ├── SellerVerificationView.tsx # Broker/Owner Identity Verification
    │   ├── SystemSettingsView.tsx    # Platform Branding, Contacts, and Legal Copy
    │   └── UsersAndRolesView.tsx     # RBAC & Account Activation Directory
    ├── auth/                         # Authentication & Security Guarding
    │   ├── AuthModal.tsx             # Login, Register, OTP Verification Modal
    │   └── UnauthorizedView.tsx      # Strict 403 Forbidden Error Boundary View
    ├── common/                       # Shared UI Layout & Navigation
    │   ├── FloatingAddPropertyButton.tsx # CTA for Listing Properties
    │   ├── Footer.tsx                # Public Footer with Links, Contact & Licensing
    │   ├── Header.tsx                # Public Header, Navigation Bar & User Controls
    │   ├── LegalModal.tsx            # Terms of Service & Privacy Policy Reader
    │   ├── MobileBottomNav.tsx       # Fixed Mobile App Bottom Tabbar
    │   ├── MobileDrawer.tsx          # Responsive Mobile Navigation Menu
    │   └── Pagination.tsx            # Accessible Numbered Pagination Component
    ├── internal/                     # Dedicated SaaS Operations Portal
    │   ├── InternalPortalLayout.tsx  # Dedicated Topbar, Sidebar & Workspace Switcher
    │   ├── operations/
    │   │   ├── OperationsWorkspace.tsx     # Review Pipeline & Engineering Desk
    │   │   └── PropertyApprovalModal.tsx   # Detailed Version Audit & Decision Modal
    │   ├── sales/
    │   │   ├── LeadDetailsModal.tsx        # Lead Audit, Follow-up Notes & Channel Logs
    │   │   └── SalesWorkspace.tsx          # Pipeline Kanban & Deal Table
    │   └── superadmin/
    │       └── SuperAdminWorkspace.tsx     # User Directory, Taxonomy & Settings Hub
    ├── public/                       # Public Marketplace Views & Modals
    │   ├── AboutUsView.tsx           # Company Background, Vision, and Licensing Info
    │   ├── ContactUsView.tsx         # Contact Form & Office Location Map
    │   ├── CustomerProfileView.tsx   # Customer Saved Searches, Favorites & Profile
    │   ├── FloatingFilterButton.tsx  # Mobile Floating Quick Filter Trigger
    │   ├── HelpGuideView.tsx         # Knowledgebase, FAQ & Guides Reader
    │   ├── HeroSection.tsx           # Search Bar, Banner & Value Propositions
    │   ├── PropertyCard.tsx          # Standardized Responsive Property Grid Card
    │   ├── PropertyComparisonView.tsx # Side-by-Side Property Comparison Matrix
    │   ├── PropertyDetailsModal.tsx  # Full Property Inspection Modal (Public)
    │   ├── PropertyListingView.tsx   # Search, Filtering, Sorting & Catalog Grid
    │   ├── RequestPropertyModal.tsx  # Customer Custom Property Demand Form
    │   └── RequestViewingModal.tsx   # Property Viewing Scheduling Form
    ├── seller/                       # Owner & Broker Self-Service Portal
    │   ├── PropertyStatusModal.tsx   # Mark Property as Sold / Rented
    │   ├── PropertyWizardModal.tsx   # 5-Step Property Creation & Draft Wizard
    │   ├── RejectedPropertyModal.tsx # Inspection of Rejection Reasons & Feedback
    │   └── SellerDashboard.tsx       # Seller Properties, Stats & Inquiries
    └── testing/
        └── UATVerificationSuite.tsx  # QA Automated Sanity Suite & Test Engine
```

---

## Phase 3 — Complete Route & Screen Documentation

Since the platform is designed as a high-performance, single-page reactive application with virtual tab routing, the view mapping corresponds to the following canonical paths and access levels:

| Path / View Identifier | Arabic Title | Access Level | Permitted User Roles | Key Components Mounted | Description & Business Purpose |
|---|---|---|---|---|---|
| `/` (`HOME`) | الرئيسية | Guest / Public | ALL | `HeroSection`, `PropertyCard`, `RequestPropertyModal` | Landing page, featured properties, quick search bar, statistics, and value propositions. |
| `/properties` (`LISTINGS`) | دليل العقارات | Public | ALL | `PropertyListingView`, `PropertyCard`, `PropertyDetailsModal` | Filterable catalog (city, price, area, property type, transaction type) with sorting and pagination. |
| `/compare` (`COMPARE`) | مقارنة العقارات | Public | ALL | `PropertyComparisonView` | Side-by-side comparison matrix for up to 4 selected properties (price, specs, features). |
| `/about` (`ABOUT`) | من نحن | Public | ALL | `AboutUsView` | Brand identity, legal brokerage license details, Kafr El Sheikh focus, and security disclosures. |
| `/contact` (`CONTACT`) | اتصل بنا | Public | ALL | `ContactUsView` | Direct contact details, central office address, and contact inquiry submission form. |
| `/help` (`HELP`) | مركز المساعدة | Public | ALL | `HelpGuideView` | Video tutorials, downloadable documentation, FAQs, and buyer/seller guidebooks. |
| `/account` (`PROFILE`) | حسابي | Authenticated | `CUSTOMER`, `OWNER`, `BROKER` | `CustomerProfileView` | User profile details, active favorites, property requests, and saved searches. |
| `/seller/dashboard` (`SELLER_DASHBOARD`) | مساحة إدارة العقارات | Authenticated | `OWNER`, `BROKER` | `SellerDashboard`, `PropertyWizardModal`, `PropertyStatusModal` | Seller management: create listings, submit revisions, view review feedback, track views and leads. |
| `/operations/dashboard` (`OPERATIONS_DASHBOARD`) | مركز العمليات والتدقيق | Internal Staff | `SUPER_ADMIN`, `OPERATIONS_MANAGER`, `PROPERTY_REVIEWER` | `InternalPortalLayout`, `OperationsWorkspace`, `PropertyApprovalModal` | Queue of properties awaiting engineering and compliance review. Approve, reject, or request changes. |
| `/sales/dashboard` (`SALES_DASHBOARD`) | إدارة علاقات العملاء (CRM) | Internal Staff | `SUPER_ADMIN`, `OPERATIONS_MANAGER`, `SALES_USER` | `InternalPortalLayout`, `SalesWorkspace`, `LeadDetailsModal` | Lead pipeline tracking (Kanban & Table), WhatsApp logs, customer viewing requests, deal status. |
| `/super-admin` (`SUPER_ADMIN_DASHBOARD`) | لوحة التحكم المركزية | Internal Staff | `SUPER_ADMIN` | `InternalPortalLayout`, `SuperAdminWorkspace`, `AuditLogsView` | Full control over users, RBAC permissions, locations/taxonomy, site settings, and audit trails. |

---

## Phase 4 — Backend API Requirements Specification

The backend REST API should be structured under `/api/v1/` following standard HTTP conventions. All authenticated endpoints expect `Authorization: Bearer <JWT_TOKEN>`.

### 4.1 Authentication & Profile APIs
| API Name | Method | Endpoint | Request Payload | Response Data | Auth Required | Permissions |
|---|---|---|---|---|---|---|
| Register User | `POST` | `/api/v1/auth/register` | `{ name, mobile, email, password, seller_type?, agency_name?, tax_number?, governorate_id?, area_id? }` | `{ token, user: User }` | No | Public |
| Login | `POST` | `/api/v1/auth/login` | `{ identifier, password }` | `{ token, user: User }` | No | Public |
| Verify OTP | `POST` | `/api/v1/auth/verify-otp` | `{ email, otp_code }` | `{ token, user: User }` | No | Public |
| Forgot Password | `POST` | `/api/v1/auth/forgot-password` | `{ identifier }` | `{ message: string }` | No | Public |
| Logout | `POST` | `/api/v1/auth/logout` | None | `{ message: string }` | Yes | Authenticated |
| Get Current User | `GET` | `/api/v1/auth/me` | None | `{ user: User, permissions: string[] }` | Yes | Authenticated |
| Update Profile | `PUT` | `/api/v1/user/profile` | `{ name?, mobile?, governorate_id?, area_id? }` | `{ user: User }` | Yes | Authenticated |
| Request Seller Upgrade | `POST` | `/api/v1/user/seller-upgrade` | `{ seller_type, agency_name?, tax_number?, commercial_registration? }` | `{ seller_profile: SellerProfile }` | Yes | Customer |

### 4.2 Properties & Moderation APIs
| API Name | Method | Endpoint | Request Payload | Response Data | Auth Required | Permissions |
|---|---|---|---|---|---|---|
| List Published Properties | `GET` | `/api/v1/properties` | Query: `?page=1&per_page=12&city_id=&property_type_id=&transaction_type_id=&min_price=&max_price=&bedrooms=&sort=` | `{ data: Property[], meta: PaginationMeta }` | No | Public (Masked) |
| Get Property Details | `GET` | `/api/v1/properties/{id}` | None | `{ property: Property }` | No | Public (Masked) / Full if Owner or Staff |
| Create Property Draft | `POST` | `/api/v1/properties` | `{ property_type_id, transaction_type_id, ...version_data }` | `{ property: Property, version: PropertyVersion }` | Yes | `OWNER`, `BROKER` |
| Save Property Version Draft | `PUT` | `/api/v1/properties/{id}/versions/{version_id}` | Partial `PropertyVersion` payload | `{ version: PropertyVersion }` | Yes | Owner / Broker |
| Submit for Review | `POST` | `/api/v1/properties/{id}/versions/{version_id}/submit` | None | `{ message: string, status: 'PENDING_REVIEW' }` | Yes | Owner / Broker |
| List Review Queue | `GET` | `/api/v1/operations/review-queue` | Query: `?status=PENDING_REVIEW&city_id=&type=` | `{ data: Property[], total_pending: number }` | Yes | `OPERATIONS_MANAGER`, `PROPERTY_REVIEWER`, `SUPER_ADMIN` |
| Approve Property Version | `POST` | `/api/v1/operations/properties/{id}/versions/{version_id}/approve` | `{ internal_note? }` | `{ property: Property, decision: 'APPROVED' }` | Yes | `OPERATIONS_MANAGER`, `PROPERTY_REVIEWER`, `SUPER_ADMIN` |
| Reject Property Version | `POST` | `/api/v1/operations/properties/{id}/versions/{version_id}/reject` | `{ rejection_reason: string, internal_note?: string }` | `{ property: Property, decision: 'REJECTED' }` | Yes | `OPERATIONS_MANAGER`, `PROPERTY_REVIEWER`, `SUPER_ADMIN` |
| Request Changes | `POST` | `/api/v1/operations/properties/{id}/versions/{version_id}/request-changes` | `{ modification_feedback: string, internal_note?: string }` | `{ property: Property, decision: 'NEEDS_MODIFICATION' }` | Yes | `OPERATIONS_MANAGER`, `PROPERTY_REVIEWER`, `SUPER_ADMIN` |
| Mark Property Sold/Rented | `POST` | `/api/v1/properties/{id}/status` | `{ status: 'SOLD' \| 'RENTED' \| 'ARCHIVED' }` | `{ property: Property }` | Yes | Owner or Staff |

### 4.3 Leads, Inquiries & Viewing Scheduling APIs
| API Name | Method | Endpoint | Request Payload | Response Data | Auth Required | Permissions |
|---|---|---|---|---|---|---|
| Capture Lead (WhatsApp/Call) | `POST` | `/api/v1/leads` | `{ property_id, channel: 'WHATSAPP' \| 'CALL' \| 'WEBSITE', customer_name?, customer_mobile? }` | `{ lead: Lead }` | No (creates guest lead if unauthenticated) | Public |
| Schedule Viewing Request | `POST` | `/api/v1/viewing-requests` | `{ property_id, customer_name, customer_mobile, preferred_date, preferred_time, notes? }` | `{ lead: Lead, viewing_id: string }` | No | Public |
| Submit Property Request (Demand) | `POST` | `/api/v1/property-requests` | `{ full_name, whatsapp_number, governorate, city_or_area, transaction_type, property_type, budget, area_sqm?, bedrooms?, additional_notes? }` | `{ request: PropertyRequest }` | No | Public |
| List CRM Leads | `GET` | `/api/v1/sales/leads` | Query: `?status=&assigned_to=&channel=&page=` | `{ data: Lead[], meta: PaginationMeta }` | Yes | `SALES_USER`, `OPERATIONS_MANAGER`, `SUPER_ADMIN` |
| Update Lead Status | `PATCH` | `/api/v1/sales/leads/{id}/status` | `{ status: LeadStatus, note?: string }` | `{ lead: Lead }` | Yes | `SALES_USER`, `SUPER_ADMIN` |
| Add Lead Activity / Note | `POST` | `/api/v1/sales/leads/{id}/notes` | `{ body: string }` | `{ note: LeadNote, lead: Lead }` | Yes | `SALES_USER`, `SUPER_ADMIN` |
| Assign Lead to Agent | `PATCH` | `/api/v1/sales/leads/{id}/assign` | `{ user_id: string }` | `{ lead: Lead }` | Yes | Sales Lead / Admin |

### 4.4 Master Data, Favorites & System Settings APIs
| API Name | Method | Endpoint | Request Payload | Response Data | Auth Required | Permissions |
|---|---|---|---|---|---|---|
| Get Governorates & Cities | `GET` | `/api/v1/locations/taxonomy` | None | `{ governorates: Governorate[], cities: City[], areas: Area[] }` | No | Public |
| Get System Settings | `GET` | `/api/v1/settings` | None | `{ settings: SystemSetting }` | No | Public |
| Update Settings | `PUT` | `/api/v1/settings` | Partial `SystemSetting` | `{ settings: SystemSetting }` | Yes | `SUPER_ADMIN` |
| Get User Favorites | `GET` | `/api/v1/user/favorites` | None | `{ favorites: Favorite[], properties: Property[] }` | Yes | Authenticated |
| Add Favorite | `POST` | `/api/v1/user/favorites` | `{ property_id: string }` | `{ favorite: Favorite }` | Yes | Authenticated |
| Remove Favorite | `DELETE` | `/api/v1/user/favorites/{property_id}` | None | `{ success: boolean }` | Yes | Authenticated |
| List Audit Logs | `GET` | `/api/v1/admin/audit-logs` | Query: `?page=1&actor_id=&entity_type=` | `{ data: AuditLog[], meta: PaginationMeta }` | Yes | `SUPER_ADMIN` |

---

## Phase 5 — Database Entity & Schema Analysis (ERD Guide)

The following entities and relational schemas represent the data requirements of the frontend:

```
+-----------------------------------------------------------------------------------+
|                                 DATABASE ERD                                      |
+-----------------------------------------------------------------------------------+

 [ users ]
    | 1
    |
    +----< [ seller_profiles ] (1:1)
    |
    +----< [ user_profiles ] (1:1)
    |
    +----< [ properties ] (1:N as seller/owner)
    |         | 1
    |         +----< [ property_versions ] (1:N)
    |         |         | 1
    |         |         +----< [ property_media ] (1:N)
    |         |
    |         +----< [ property_reviews ] (1:N)
    |         |
    |         +----< [ leads ] (1:N per property)
    |                   | 1
    |                   +----< [ lead_activities ] (1:N)
    |                   +----< [ lead_notes ] (1:N)
    |
    +----< [ favorites ] (1:N)
    |
    +----< [ property_requests ] (1:N customer demand)
    |
    +----< [ audit_logs ] (1:N as actor)
```

### Detailed Entity DDL / Schema Specification

1. **`users`**:
   - `id`: UUID (Primary Key)
   - `name`: VARCHAR(191)
   - `email`: VARCHAR(191) UNIQUE
   - `mobile`: VARCHAR(32) UNIQUE
   - `password`: VARCHAR(255) (Hashed)
   - `role`: ENUM (`SUPER_ADMIN`, `OPERATIONS_MANAGER`, `PROPERTY_REVIEWER`, `SALES_USER`, `CONTENT_MANAGER`, `CUSTOMER`)
   - `account_status`: ENUM (`ACTIVE`, `SUSPENDED`, `DISABLED`)
   - `avatar_path`: VARCHAR(255) NULL
   - `email_verified_at`: TIMESTAMP NULL
   - `last_login_at`: TIMESTAMP NULL
   - `created_at`, `updated_at`, `deleted_at`

2. **`seller_profiles`**:
   - `id`: UUID (Primary Key)
   - `user_id`: UUID (FK -> users.id, UNIQUE, ON DELETE CASCADE)
   - `seller_type`: ENUM (`OWNER`, `BROKER`, `INDIVIDUAL_OWNER`, `REAL_ESTATE_OFFICE`)
   - `verification_status`: ENUM (`NOT_REQUESTED`, `PENDING`, `VERIFIED`, `REJECTED`, `UNVERIFIED`)
   - `agency_name`: VARCHAR(191) NULL
   - `tax_number`: VARCHAR(64) NULL
   - `commercial_registration`: VARCHAR(64) NULL
   - `verified_at`: TIMESTAMP NULL
   - `verified_by`: UUID NULL (FK -> users.id)
   - `verification_note`: TEXT NULL

3. **`properties`**:
   - `id`: UUID (Primary Key)
   - `reference_number`: VARCHAR(32) UNIQUE (e.g., `RWT-KFS-101`)
   - `seller_id`: UUID (FK -> users.id)
   - `property_type_id`: UUID (FK -> property_types.id)
   - `transaction_type_id`: UUID (FK -> transaction_types.id)
   - `current_status`: ENUM (`DRAFT`, `PENDING_REVIEW`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `NEEDS_MODIFICATION`, `PENDING_REVISION`, `PUBLISHED`, `ARCHIVED`, `SOLD`, `RENTED`)
   - `current_published_version_id`: UUID NULL (Points to currently visible approved version)
   - `created_at`, `updated_at`, `deleted_at`

4. **`property_versions`**:
   - `id`: UUID (Primary Key)
   - `property_id`: UUID (FK -> properties.id, ON DELETE CASCADE)
   - `version_number`: INT (Incrementing: 1, 2, 3...)
   - `title`: VARCHAR(255)
   - `description`: TEXT
   - `governorate_id`: UUID (FK -> governorates.id)
   - `city_id`: UUID (FK -> cities.id)
   - `area_id`: UUID (FK -> areas.id)
   - `public_location_text`: VARCHAR(255) (e.g., "حي سخا، بالقرب من الجامعة")
   - `private_address`: TEXT (Confidential: e.g., "شارع النصر، عمارة 12، شقة 4")
   - `price`: DECIMAL(14, 2)
   - `area_sqm`: DECIMAL(8, 2)
   - `bedrooms`: SMALLINT NULL
   - `bathrooms`: SMALLINT NULL
   - `floor`: VARCHAR(64) NULL
   - `finishing`: VARCHAR(64) NULL
   - `features`: JSON NULL (Array of string tags)
   - `version_status`: ENUM (`DRAFT`, `PENDING`, `APPROVED`, `REJECTED`, `NEEDS_MODIFICATION`)
   - `submitted_by`: UUID (FK -> users.id)
   - `submitted_at`: TIMESTAMP NULL
   - `reviewed_by`: UUID NULL (FK -> users.id)
   - `reviewed_at`: TIMESTAMP NULL
   - `review_decision`: ENUM (`APPROVED`, `REJECTED`, `NEEDS_MODIFICATION`) NULL
   - `rejection_reason`: TEXT NULL

5. **`property_media`**:
   - `id`: UUID (Primary Key)
   - `property_version_id`: UUID (FK -> property_versions.id, ON DELETE CASCADE)
   - `media_type`: ENUM (`IMAGE`, `VIDEO`)
   - `path`: VARCHAR(512) (Storage URI or CDN URL)
   - `mime_type`: VARCHAR(64)
   - `file_size`: INT (Bytes)
   - `sort_order`: SMALLINT DEFAULT 0
   - `is_cover`: BOOLEAN DEFAULT FALSE

6. **`leads`**:
   - `id`: UUID (Primary Key)
   - `reference_number`: VARCHAR(32) UNIQUE (e.g., `LEAD-2026-0042`)
   - `customer_id`: UUID NULL (FK -> users.id if registered, NULL for guest)
   - `customer_name`: VARCHAR(191)
   - `customer_mobile`: VARCHAR(32)
   - `customer_email`: VARCHAR(191) NULL
   - `property_id`: UUID (FK -> properties.id)
   - `property_reference`: VARCHAR(32)
   - `property_title`: VARCHAR(255)
   - `status`: ENUM (`NEW`, `WHATSAPP_CONTACT_INITIATED`, `CALL_CONTACT_INITIATED`, `CONTACTED`, `INTERESTED`, `FOLLOW_UP`, `VIEWING`, `WON`, `LOST`)
   - `source`: VARCHAR(64) (e.g., `WEBSITE_PROPERTY_MODAL`, `DIRECT_CALL`)
   - `contact_channel`: ENUM (`WHATSAPP`, `CALL`, `WEBSITE`)
   - `assigned_to`: UUID NULL (FK -> users.id)
   - `last_activity_at`: TIMESTAMP
   - `closed_at`: TIMESTAMP NULL

7. **`favorites`**:
   - `id`: UUID (Primary Key)
   - `user_id`: UUID (FK -> users.id, ON DELETE CASCADE)
   - `property_id`: UUID (FK -> properties.id, ON DELETE CASCADE)
   - `created_at`: TIMESTAMP
   - `expires_at`: TIMESTAMP (Set to `created_at + 30 days` according to business rule)

8. **`property_requests`**:
   - `id`: UUID (Primary Key)
   - `reference_number`: VARCHAR(32) UNIQUE
   - `customer_id`: UUID NULL
   - `full_name`: VARCHAR(191)
   - `whatsapp_number`: VARCHAR(32)
   - `governorate`: VARCHAR(100)
   - `city_or_area`: VARCHAR(191)
   - `transaction_type`: ENUM (`BUY`, `RENT`)
   - `property_type`: VARCHAR(100)
   - `budget`: DECIMAL(14, 2)
   - `area_sqm`: DECIMAL(8, 2) NULL
   - `bedrooms`: SMALLINT NULL
   - `additional_notes`: TEXT NULL
   - `status`: ENUM (`PENDING`, `SEARCHING`, `MATCHED`, `CLOSED`)

---

## Phase 6 — Role-Based Access Control (RBAC) Matrix

The platform enforces strict role isolation. Role switching is handled through administrative permission updates, never client-side spoofing.

| Role | Accessible Views | Allowed Actions | Restricted Actions |
|---|---|---|---|
| **Guest / Public** | `HOME`, `LISTINGS`, `COMPARE`, `ABOUT`, `CONTACT`, `HELP` | Browse properties, compare listings, trigger WhatsApp/Call leads, schedule viewing, submit property requests. | Cannot create property listings, cannot view seller contact info, cannot access internal dashboards. |
| **Customer** | All Public Views + `/account` (`PROFILE`) | Manage profile, view favorited properties, track custom property requests. | Cannot list properties without enabling Seller capability, cannot view moderation or CRM desks. |
| **Owner (مالك عقار)** | Public Views + Profile + `/seller/dashboard` | Create/edit owned property drafts, submit revisions, inspect review feedback, mark own properties as Sold/Rented. | Cannot approve own properties, cannot view other sellers' listings in draft, cannot access CRM or Admin. |
| **Broker (وسيط معتمد / مكتب)** | Public Views + Profile + `/seller/dashboard` | Create listings on behalf of clients, submit agency license/tax records for verification, view performance stats. | Cannot self-approve listings, cannot edit platform taxonomy or view system audit logs. |
| **Property Reviewer (مراجع)** | Public Views + `/operations/dashboard` | Access review queue, inspect private cadastral addresses and high-res media, approve, reject with reason, request changes. | Cannot edit system settings, cannot alter user roles, cannot view confidential CRM deal commission data. |
| **Operations Manager (مدير عمليات)** | All Reviewer Views + Full Operations Dashboard | Supervise reviewer decisions, bypass queues in emergencies, inspect review metrics, assign properties for field visits. | Cannot modify database schemas, cannot create administrative users. |
| **Sales Agent (مسؤول مبيعات)** | Public Views + `/sales/dashboard` | Manage assigned leads, log WhatsApp/Call interactions, schedule client viewings, change deal status to Won/Lost. | Cannot approve properties, cannot alter system settings or master taxonomy. |
| **Super Admin (مدير النظام)** | Complete Access to All Public and Internal Portals | Full CRUD on users and roles, taxonomy management (governorates/cities/areas), system settings, immutable audit log. | None. All operations logged in `audit_logs`. |

---

## Phase 7 — Frontend Finite State Machines & Lifecycle States

### 7.1 Property Lifecycle State Machine
```text
  [DRAFT] 
     │  (Submit for Review)
     ▼
[PENDING_REVIEW] ──(Reviewer assigns)──► [UNDER_REVIEW]
     │                                         │
     ├─────────────(Approve)───────────────────┤
     │                                         ▼
     │                                    [APPROVED]
     │                                         │
     │                                         ▼
     │                                   [PUBLISHED] ◄──┐
     │                                         │        │
     │                           (Owner Edits) │        │ (Re-approved)
     │                                         ▼        │
     │                                [PENDING_REVISION]┘
     │                                         │
     │                                         ▼
     │                             [SOLD] or [RENTED]
     │                                         │
     │                                         ▼
     │                                    [ARCHIVED]
     │
     ├───────────(Needs Modification)──────────► [NEEDS_MODIFICATION]
     │                                                 │
     │                                                 ▼ (Owner updates & resubmits)
     │                                            [PENDING_REVIEW]
     │
     └───────────────(Reject)─────────────────► [REJECTED]
```

#### State UI Behavior:
1. **`DRAFT`**:
   - *UI*: Visible only to author in `SellerDashboard`. Badge: Gray.
   - *Actions*: "تعديل المسودة" (Edit Draft), "حذف" (Delete), "إرسال للمراجعة" (Submit).
2. **`PENDING_REVIEW`**:
   - *UI*: Visible in Seller Dashboard (Badge: Amber "قيد المراجعة") and in Operations Workspace Queue.
   - *Actions*: Seller cannot edit fields; Reviewer can "قبول واعتماد", "طلب تعديلات", or "رفض".
3. **`APPROVED` / `PUBLISHED`**:
   - *UI*: Displayed publicly on Marketplace. Badge: Emerald "معتمد وموثق".
   - *Actions*: Public can initiate leads; Seller can "طلب تعديل" (spawns revision draft) or "تحديد كمباع / مؤجر".
4. **`NEEDS_MODIFICATION`**:
   - *UI*: Badge: Orange "مطلوب تعديلات". Displays reviewer's notes and feedback instructions.
   - *Actions*: Seller clicks "تعديل وإعادة إرسال", fixes specified fields, and resubmits.
5. **`REJECTED`**:
   - *UI*: Badge: Red "مرفوض". Seller can click "أسباب الرفض" to inspect exact violation preset and notes.
6. **`SOLD` / `RENTED`**:
   - *UI*: Watermarked badge over images; removed from active search results or labeled as completed transaction.

---

### 7.2 Lead Lifecycle State Machine
- **`NEW`**: Inbound lead created from WhatsApp click, direct call, or web form. Appears in Sales inbox.
- **`WHATSAPP_CONTACT_INITIATED` / `CALL_CONTACT_INITIATED`**: Auto-logged when user triggers phone or WhatsApp CTA.
- **`CONTACTED`**: Sales agent confirms initial customer discovery conversation.
- **`INTERESTED`**: Customer confirmed interest in property specifications and pricing.
- **`FOLLOW_UP`**: Follow-up date scheduled with reminders.
- **`VIEWING`**: Physical property tour booked and scheduled with owner.
- **`WON`**: Deal closed, contract drafted or signed.
- **`LOST`**: Customer declined, purchased elsewhere, or unresponsive.

---

## Phase 8 — Frontend Form Validation Rules

### 8.1 Property Submission Form (`PropertyWizardModal`)
1. **Property Type & Transaction**:
   - `property_type_id`: Required.
   - `transaction_type_id`: Required (`BUY` or `RENT`).
2. **Title & Description**:
   - `title`: Required, min 10 characters, max 120 characters.
   - `description`: Required, min 30 characters, max 2000 characters.
   - **Anti-Disintermediation Check (`validateForbiddenContact`)**: Title and description are regex-scanned against Egyptian phone patterns (`01[0-2,5]\d{8}`), emails, and phrases like "اتصل بي" or "للتواصل مع المالك". Submission is blocked if found.
3. **Location**:
   - `governorate_id`: Required (Defaults to Kafr El Sheikh).
   - `city_id`: Required.
   - `area_id`: Required.
   - `public_location_text`: Required, min 5 chars (General landmark description).
   - `private_address`: Required for inspection, min 10 chars (Strictly secret).
4. **Financials & Specs**:
   - `price`: Numeric, > 0.
   - `area_sqm`: Numeric, min 10 sqm, max 50,000 sqm.
   - `bedrooms`, `bathrooms`: Positive integers if residential.
5. **Media Upload**:
   - Min images: 3 (Enforced before final submission).
   - Max images: 15.
   - Max file size: 8MB per image. Allowed types: `image/jpeg`, `image/png`, `image/webp`.

### 8.2 Authentication & User Profiles
- **Egyptian Mobile Number**: Must match regex `/^01[0125][0-9]{8}$/` (11 digits).
- **Email**: Standard RFC 5322 format.
- **Password**: Min 8 characters with at least one number and letter.
- **OTP Code**: Exact 4 or 6 numerical digits.

### 8.3 Custom Property Request Form (`RequestPropertyModal`)
- `full_name`: Required, min 3 characters.
- `whatsapp_number`: Required, valid Egyptian mobile.
- `budget`: Numeric, > 0.
- `governorate` and `city_or_area`: Required.

---

## Phase 9 — Error Handling & UI Response Specifications

| Scenario | HTTP Status Code | Frontend UI Behavior | Remediation / User Action |
|---|---|---|---|
| **Unauthenticated API Access** | `401 Unauthorized` | Clears stored token, opens `AuthModal` in `LOGIN` view with toast notice. | User logs in or verifies identity. |
| **Forbidden Role Access** | `403 Forbidden` | Renders `UnauthorizedView` component explaining required clearance. | User returns to Home or switches accounts. |
| **Validation Failed** | `422 Unprocessable Entity` | Maps backend `errors` object directly to corresponding input field helpers in red text. | User corrects indicated inputs. |
| **Resource Not Found** | `404 Not Found` | Displays empty state card with "عفواً، العقار غير موجود أو تم حذفه". | User returns to listing catalog. |
| **Backend Offline / Timeout** | `502 / 503 / 504 / Aborted` | `ApiClient` catches failure, logs silently, activates cached mock fallback, and notifies user via non-blocking banner: "الوضع المحلي (Offline Mode)". | Seamless uninterrupted demo/UAT experience. |
| **File Upload Exceeded** | Client / `413 Payload Too Large` | Displays alert banner: "حجم الصورة يتجاوز الحد المسموح (8 ميجابايت)". | User selects compressed image file. |

---

## Phase 10 — DevOps & Deployment Specification

### 10.1 Environment Variables
All frontend build variables use the `VITE_` prefix:
```env
# .env.production
VITE_APP_URL=https://rawabet-eg.com
VITE_API_BASE_URL=https://api.rawabet-eg.com
```

### 10.2 Build & Execution Pipeline
- **Runtime Environment**: Node.js 20.x LTS or 22.x LTS.
- **Package Manager**: npm or bun.
- **Build Command**: `npm run build` (outputs optimized static assets to `dist/`).
- **Type Checking**: `npm run lint` (`tsc --noEmit`).
- **Dev Server Port**: `3000` (`vite --port=3000 --host=0.0.0.0`).

### 10.3 Nginx / Cloud Run Web Server Configuration
To support client-side routing on standard static hosting (Nginx, AWS S3 + CloudFront, Cloud Run, Firebase Hosting), all non-file route requests must rewrite to `/index.html`:
```nginx
server {
    listen 3000;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

### 10.4 Security Best Practices
- **No Hardcoded Secrets**: No database passwords, secret keys, or private API keys exist in the frontend repository.
- **Content Security Policy (CSP)**: `img-src 'self' data: https:;` to allow high-resolution property imagery and maps.
- **Referrer Policy**: Configured to `no-referrer` on cross-origin image requests to preserve privacy.

---

## Phase 11 — QA & Test Automation Checklist

### 11.1 Test Matrix Across Personas
1. **Public Customer Flow**:
   - [ ] Navigate to `/properties`, filter by "كفر الشيخ" + "شقة" + "بيع".
   - [ ] Verify that prices, specs, and areas filter correctly.
   - [ ] Open property modal; confirm that the exact street address and seller mobile are masked.
   - [ ] Click "تواصل عبر واتساب"; confirm WhatsApp URL is formatted with the property reference number.
   - [ ] Click "طلب معاينة"; complete schedule modal and confirm lead creation.
   - [ ] Click "مقارنة" on 2 properties; navigate to `/compare` and verify metrics match.

2. **Property Owner / Broker Flow**:
   - [ ] Log in as an Owner or Broker.
   - [ ] Navigate to `/seller/dashboard`.
   - [ ] Click "إضافة عقار جديد" to open `PropertyWizardModal`.
   - [ ] Test the anti-disintermediation validator: insert a phone number (`01012345678`) into the description and confirm that the form blocks progression with a warning.
   - [ ] Complete steps 1 through 5, upload 3 images, and submit for review.
   - [ ] Confirm property appears in `SellerDashboard` with `PENDING_REVIEW` badge.

3. **Operations & Reviewer Flow**:
   - [ ] Log in as `OPERATIONS_MANAGER` or `PROPERTY_REVIEWER`.
   - [ ] Confirm automatic redirection into `/operations/dashboard` (`InternalPortalLayout`).
   - [ ] Inspect pending property in `OperationsWorkspace`.
   - [ ] Click "تدقيق واعتماد" to open `PropertyApprovalModal`.
   - [ ] Verify private address and unmasked seller information are clearly visible to the reviewer.
   - [ ] Execute "طلب تعديل" with notes; verify seller receives notification and status becomes `NEEDS_MODIFICATION`.
   - [ ] Execute "قبول واعتماد"; verify property becomes `PUBLISHED` on public marketplace.

4. **Sales Agent Flow**:
   - [ ] Log in as `SALES_USER`.
   - [ ] Verify automatic access to `/sales/dashboard`.
   - [ ] Locate inbound lead in Kanban column (`NEW`).
   - [ ] Open `LeadDetailsModal`, log follow-up notes, and transition lead to `CONTACTED` and `VIEWING`.

5. **Super Admin Flow**:
   - [ ] Log in as `SUPER_ADMIN`.
   - [ ] Navigate to `/super-admin`.
   - [ ] Add a new city or area in `LocationsAndTaxonomyView`; verify that the new location appears in property search filters.
   - [ ] Modify a user's role in `UsersAndRolesView`.
   - [ ] Inspect `AuditLogsView` to confirm that all admin actions produced timestamped audit records.

---

## Phase 12 — Pending Backend Decisions & Architectural Contracts

The following architectural decisions are documented for the backend engineering team:

1. **Media Storage & Image Watermarking Strategy**:
   - *Requirement*: To prevent image scraping by competing brokers, property images should be processed through an image manipulation pipeline (e.g., Intervention Image in Laravel or sharp in Node.js) to stamp the official "روابط" watermark and strip EXIF GPS metadata before public CDN distribution.
   - *Backend Action*: Implement an async background queue worker for media upload and watermarking.
2. **SMS & WhatsApp API Gateway Provider**:
   - *Requirement*: Sending OTP verification codes and automated WhatsApp lead alerts to brokers.
   - *Backend Recommendation*: Evaluate local Egyptian SMS gateways (e.g., VictoryLink, CEQUENS) and Twilio/Infobip for WhatsApp Business Cloud API.
3. **Property Reference Generation Algorithm**:
   - *Format*: `RWT-{CITY_CODE}-{INCREMENTAL_ID}` (e.g., `RWT-KFS-1001`).
   - *Backend Action*: Ensure an atomic sequence generator or database sequence handles this to prevent duplicate reference numbers under concurrent submissions.
4. **Favorites Expiration Engine**:
   - *Business Rule*: Favorites expire automatically after 30 days.
   - *Backend Action*: Configure a scheduled cron command (`schedule:run`) to purge or soft-delete expired records.
5. **Real-Time Notification Protocol**:
   - *Requirement*: Reviewers and sales agents receive instant notifications on incoming queue items.
   - *Backend Recommendation*: Implement Laravel Reverb, Pusher, or standard WebSocket channels matching the events in `AppNotification`.

---
*End of Technical Handover Package. Authored by Senior Frontend Architecture & Lead Engineering.*
