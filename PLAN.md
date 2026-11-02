# EKsathe Bangladesh MVP Implementation Plan

## Goal

Build one responsive Next.js application with a public 13-sector directory, a shared account, and separate customer, provider, and admin workspaces. Agriculture and construction are live for the MVP; the other 11 sectors remain visible as coming soon.

## Entry points

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Platform homepage, launch sectors, and directory entry | Public |
| `/dashboard` | The 13-sector service directory | Public |
| `/dashboard/agriculture-labor` | Produce, farm-worker, and machinery services | Public browsing |
| `/dashboard/construction` | Provider/material discovery and construction projects | Public browsing |
| `/account` | Orders, bookings, projects, payments, and profile | Signed-in customer |
| `/provider` | Listings, applications, quotes, jobs, and commission | Applicant or approved provider |
| `/admin` | Provider approvals and scoped operations/finance | Authorized staff |

Ordering, quote requests, bookings, and projects require a verified email account and return the customer to the requested action after sign-in. Listing and provider pages have shareable sector URLs. Planned sectors show a consistent coming-soon page; unknown sector slugs return 404. Provider and admin links appear only when the signed-in user has access. The old `/dashboard/admin` route redirects to `/admin`.

## Shared product foundation

- Keep Next.js 16, React, PostgreSQL, Prisma 7, Better Auth, Tailwind, and shadcn. Keep one root layout and separate public, account, provider, and admin layouts.
- Define all 13 sectors in one typed registry with stable slugs, display order, Bengali and English names, icons, and rollout status. Agriculture service definitions remain distinct from top-level sectors.
- Support one customer account with multiple provider capabilities. Require admin approval for each sector capability before publishing or accepting work.
- Reuse a request, quote, order, booking, payment record, commission record, and review flow across both live sectors: request, quote, acceptance, fulfilment, completion, payment confirmation, and review.
- Snapshot accepted quantity, price, scope, schedule, and commission. Keep fulfilment and payments as separate states. Prevent duplicate quote acceptance, overselling, and conflicting worker or machine bookings.
- Customers pay providers directly. Record both parties' payment confirmation; finance staff track platform commission due and receipts. Commission defaults to 10% per sector and is recorded with the accepted order.
- Check authentication, authorization, and record ownership in server-rendered data access and every mutation. Keep privileged fields server-controlled. Add an audited first-super-admin bootstrap command; expose no public admin-creation flow.
- Use signed S3-compatible uploads and validate uploads before attaching them to products, projects, or payment records. Private documents remain access-controlled.
- Use additive Prisma migrations, idempotent seeds, and fresh Next.js data. Do not import PHP users or transactions.

## Agriculture

- Farmer profiles and storefronts with bilingual details, district, photo, product category, price/unit, quantity, and harvest availability.
- Public produce search and filters. Support buy-now requests for one listing at a time; farmers accept the terms or issue a revised quote. The parties arrange collection or transport.
- Farm-worker profiles, skills, daily rates, availability, location, and booking requests.
- Machinery hire listings with daily rates, availability, location, and operator/transport terms.
- Provide provider inventory, incoming requests, quote handling, fulfilment updates, customer order history, reviews, and payment records. Other agriculture service definitions remain unavailable for transactions during the MVP.

## Construction

- Searchable approved directories of contractors, engineers, architects, tradespeople, and material suppliers.
- Private customer projects with location, type, scope, approximate area, budget, dates, photos, and documents.
- Provider invitations and quote requests for one work package or material requirement; compare scope, price, schedule, transport charges, and provider profile.
- Accept one quote per request and link each booking or material order to its project.
- Project overview with accepted quotes, milestones, work schedule, material orders, documents, recorded expenses, and payment history. Providers post progress; customers approve milestones, changes, and handover.
- Defer automated BOQ/structural estimates, procurement automation, attendance/payroll, warranties, and full ERP features.

## Admin and launch operations

- Admin queues for provider approvals, listing moderation, requests, disputes, payment mismatches, and outstanding commission.
- Sector managers see only assigned-sector operations. Finance manages payment and commission records. Super admins manage staff access and platform settings.
- Use in-app workflow notifications, email verification, and password recovery. Add structured server logs, readiness checks, rate limiting, and database backups.
- Run a controlled provider pilot after migrations, seeds, email, and object storage work in staging.

## Implementation order and acceptance

1. **Plan, routes, identity, and access:** add this plan; establish the sector registry and page shells; finish email/password registration, verification, reset, and profile; secure admin routes/actions; add provider applications and sector-scoped grants. Acceptance: customers can access their own workspace and an admin can approve provider capabilities; unprivileged users cannot access admin data or actions.
2. **Shared data and transaction lifecycle:** add provider, product, request, quote, order, booking, payment, commission, review, notification, attachment, audit, and project models with safe migrations and seeds; implement validated server-side domain services and ownership checks. Acceptance: one seeded transaction completes with payment confirmation, review, and commission receipt while preserving an audit trail.
3. **Agriculture workflows:** deliver produce listings/orders, farm-worker bookings, and machinery hire. Acceptance: each workflow appears correctly in customer, provider, and admin views.
4. **Construction workflows:** deliver projects, provider/material directories, quote comparison, linked orders/bookings, milestones, documents, and payment history. Acceptance: a customer can create a project, engage a provider, approve a milestone, record payments, and confirm handover.
5. **Operations and release readiness:** complete scoped admin queues, notifications, readiness and backup operations, and provider pilot. Acceptance: the full customer, provider, operations, and finance paths work in Bangla and English on mobile and desktop.

## Verification

- Run lint, TypeScript, Prisma migration/seed, and production build checks.
- Add Bun domain tests and PostgreSQL integration tests for permissions, quote acceptance, stock and booking conflicts, payments, refunds, commission, and reviews.
- Add Playwright journeys for public sector discovery, registration/verification, the three agriculture flows, construction project/quotes, role boundaries, mobile layout, and Bangla/English switching.

## Defaults and boundaries

- Responsive web first; native Android and iOS follow after workflows stabilize.
- Bangla-first interface with English switching; preserve the green brand, Bengali font, and theme support.
- One provider profile per account with multiple approved sector capabilities; provider staff teams and multiple storefronts come later.
- Currency is BDT with decimal arithmetic and explicit units. The 10% commission excludes separately listed transport charges.
- Customers and providers arrange delivery and site visits themselves. No marketplace shopping cart, payment gateway, social feed, live chat, or provider fleet dispatch in the MVP.
- The other 11 sectors remain visible as coming soon; their service definitions are not transactable.
