---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories-epic-1, step-03-create-stories-epic-2, step-03-create-stories-epic-3, step-04-final-validation]
inputDocuments: ["prd.md", "architecture.md", "ux-design-specification.md"]
---

# wedding - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for wedding, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-01: Guest can access the application via a unique URL token without a password.
FR-02: System must validate the token and retrieve the specific Guest or Household profile.
FR-03: Guest can view a personalized greeting displaying their name(s).
FR-04: System must redirect invalid tokens to a generic support/contact page.
FR-05: Guest can view the "Love Story" section with text and photos.
FR-06: Guest can view Event Details (Date, Time, Venue Location).
FR-07: Guest can tap a "Map" action to open the location in their native map app.
FR-08: Guest can view a Countdown Timer ticking down to the event start.
FR-09: Guest can view a list of all members associated with their Household group.
FR-10: Head of Household can toggle "Attending" status (Yes/No) for each member individually.
FR-11: System must prevent "Submit" if no options are selected (validation).
FR-12: Guest receives immediate visual feedback (Confetti/Success state) upon successful submission.
FR-13: Guest can change their RSVP response at any time by revisiting the link (until a locked date).
FR-14: Host can access a secured Admin Dashboard (via password or separate admin token).
FR-15: Host can view aggregate counts: Total Invited, Confirmed Yes, Confirmed No, Pending.
FR-16: Host can filter the guest list by status (Attending/Not Attending).
FR-17: Host can view individual household responses and dietary notes.

### NonFunctional Requirements

NFR-01: Landing page Time to Interactive (TTI) must be < 1.5 s on standard 4G networks.
NFR-02: Total initial page weight (JS+CSS) must not exceed 150KB (gzipped).
NFR-03: RSVP submission round-trip must complete in < 500ms.
NFR-04: System must support 200 concurrent users with 0% error rate (burst traffic support).
NFR-05: Database must have daily automated backups during the active RSVP window.
NFR-06: Guest URLs must use cryptographically strong random tokens (UUIDv4) to prevent ID guessing.
NFR-07: "NoIndex" headers must be present to prevent search engine indexing.
NFR-08: Admin Dashboard must be protected by a secure authentication mechanism ("Security through obscurity" + cookie).
NFR-09: All body text must be minimum 18px equivalent on visual render.
NFR-10: Interactive touch targets must be minimum 48x48px.
NFR-11: Contrast ratio for text must meet WCAG AA standards (4.5:1).

### Additional Requirements

FROM ARCHITECTURE:
- Starter Template: `npx create-next-app@latest wedding --typescript --tailwind --eslint` + `npm install mongoose mongodb` (Critical for Epic 1 Story 1).
- Stack: Next.js 15, Tailwind CSS, MongoDB with Mongoose (Strict Mode), Vercel Hosting.
- Auth: Guest via UUID token in URL; Admin via `/admin?key=SECRET` setting a cookie.
- API: Server Actions returning `ActionResponse<T>`.
- State Management: URL-driven + Server Components.
- Directory Structure: `src/app/(admin)` and `src/app/(public)` split.
- Models: `Household` (with Guest array) and `Guest` schemas.
- Testing: Co-located tests pattern (deferred for MVP).

FROM UX DESIGN:
- Language: Russian (`lang="ru"`).
- Fonts: Cormorant Garamond (Headings), Inter/Open Sans (Body).
- Layout: Single-page vertical scroll with sticky header.
- Components: HeroSection (Personalized), ScheduleTimeline, RSVPCard (Emoji buttons), GuestWall, CountdownTimer.
- Visuals: "Romantic Block Story" theme, Blush/Gold/Cream palette.
- Responsive: Mobile-first (<640px full width), Desktop (>1024px centered 720px max).
- Interaction: No forms, emoji taps, confetti feedback, One-tap "Add to Calendar".

### FR Coverage Map

FR-01: Epic 1 - Access via Token
FR-02: Epic 1 - Token Validation
FR-03: Epic 1 - Personalized Greeting
FR-04: Epic 1 - Invalid Token Handling
FR-05: Epic 1 - Love Story Content
FR-06: Epic 1 - Event Details
FR-07: Epic 1 - Map Link
FR-08: Epic 1 - Countdown Timer
FR-09: Epic 2 - Household Members List
FR-10: Epic 2 - Toggle Attendance
FR-11: Epic 2 - Validation of Selection
FR-12: Epic 2 - Success Feedback (Confetti)
FR-13: Epic 2 - Edit Response
FR-14: Epic 3 - Admin Access
FR-15: Epic 3 - Aggregate Counts
FR-16: Epic 3 - Filter Guest List
FR-17: Epic 3 - View Details

## Epic List

### Epic 1: Invitation Access & Core Experience

**Goal:** Guests can securely access their unique invitation link, viewing personalized greetings and all essential wedding details without barriers.

### Story 1.1: Project Initialization & Data Models

As a Developer,
I want to initialize the project and define the data structure,
So that I have a foundation for building the application features.

**Acceptance Criteria:**

**Given** The developer has the architecture document
**When** They run the initialization commands and create Mongoose schemas
**Then** A Next.js 15 project with Tailwind is running
**And** `Household` and `Guest` schemas are defined in TypeScript
**And** MongoDB connection logic is implemented in `/lib`

### Story 1.2: Guest Identity Middleware

As a Guest,
I want to access the site via my unique token,
So that the system knows who I am without requiring a login.

**Acceptance Criteria:**

**Given** A user visits `/?token=UUID`
**When** The Middleware intercepts the request
**Then** It validates the UUID against the database
**And** If valid, allows access to the landing page
**And** If invalid, redirects to a generic `/error` page

### Story 1.3: Landing Page & Personalized Greeting

As a Guest,
I want to see my name immediately upon loading the page,
So that I know this invitation is specifically for me.

**Acceptance Criteria:**

**Given** A valid guest token
**When** The Landing Page loads (Server Component)
**Then** The Guest's name is displayed prominently in the Hero section
**And** The "Love Story" introductory text is visible
**And** The page uses the defined typography and color palette

### Story 1.4: Core Content Sections

As a Guest,
I want to see the event details, map, and countdown,
So that I get excited and know the logistics.

**Acceptance Criteria:**

**Given** The user is on the landing page
**When** They scroll down
**Then** They see the "Event Details" card
**And** They can tap a "View Map" link
**And** They see a live Countdown Timer ticking down to the event date

### Story 1.5: Interactive Location Roadmap

As a Guest,
I want to see a simplified map of Azov that moves through wedding venues as I scroll,
So that I can visually explore the wedding day journey in an engaging, interactive way.

**Acceptance Criteria:**

**Given** The user is on the landing page
**When** They scroll to the Map section
**Then** The map section is sticky and pans between venues as user scrolls:
- ЗАГС (ул. Мира, 19/31) → Храм Азовской иконы (~5 мин пешком) → Ресторан «Шер Хоф» (~15 мин на машине)
**And** Each venue shows photo, name, time, address, "Показать на Я.Картах" button
**And** The map is simplified — minimal labels, clean romantic design

### Epic 2: RSVP & Household Management

**Goal:** Guests can intuitively confirm or decline attendance for themselves and their entire household in a single session.

### Story 2.1: RSVP UI Component & Interactions

As a Guest,
I want to easily select who is attending from my family,
So that I can respond for everyone in one go.

**Acceptance Criteria:**

**Given** The user sees the RSVP section
**When** They toggle "Yes" or "No" for a family member
**Then** The UI visually indicates the selection (e.g., color change)
**And** The "Submit" button becomes active only when all members have a selection

### Story 2.2: RSVP Submission Server Action

As a Developer,
I want a secure way to save RSVP responses,
So that the database reflects the accurate guest count.

**Acceptance Criteria:**

**Given** Valid RSVP data sent from the client
**When** The `submitRsvp` action is called
**Then** It validates the input against the schema
**And** It updates the `isAttending` status for each guest in the household
**And** It returns a success response to the client
**And** It handles database errors gracefully

### Story 2.3: Success Feedback & Optimistic Updates

As a Guest,
I want immediate feedback that my RSVP was received,
So that I feel confident and celebrated.

**Acceptance Criteria:**

**Given** The user taps "Submit"
**When** The server returns a success response
**Then** A confetti animation plays on the screen
**And** The form is replaced by a "Thank you" confirmation message
**And** If there is an error, a friendly message is shown instead

### Story 2.4: Guest Questionnaire

As a Guest,
I want to answer additional questions about my preferences (menu, allergies, alcohol, transfer),
So that the hosts can plan the event according to my needs.

**Acceptance Criteria:**

**Given** The user confirms "Yes" for at least one household member
**When** They scroll past the RSVP section
**Then** They see a "Questionnaire" section with additional questions
**And** They can select menu choice per guest (Meat/Fish/Vegetarian)
**And** They can specify allergies (checkboxes + free text)
**And** They can select alcohol preferences (Wine/Champagne/Spirits/Non-alcoholic)
**And** They can indicate transfer needs per household (Yes/No)

### Epic 3: Host Dashboard & Guest Management

**Goal:** The Host can securely access a private dashboard to monitor real-time attendance and manage guest details.

### Story 3.1: Admin Authentication Middleware

As a Host,
I want to securely access the admin area without a complex login system,
So that I can quickly check the status while keeping guest data private.

**Acceptance Criteria:**

**Given** A user visits `/admin` without a cookie
**Then** They are redirected to the home page or a 404
**Given** A user visits `/admin?key=MY_SECRET`
**Then** A secure, HTTP-only cookie is set
**And** They are redirected to the `/admin` dashboard
**And** Future requests to `/admin` are allowed by middleware

### Story 3.2: Admin Dashboard & Stats

As a Host,
I want to see the high-level attendance statistics,
So that I know how many people have confirmed.

**Acceptance Criteria:**

**Given** The host is on the Admin Dashboard
**When** The page loads
**Then** They see "Total Guest Count", "Confirmed Yes", "Confirmed No", and "Pending"
**And** The data is accurate based on current database state

### Story 3.3: Guest List & Details View

As a Host,
I want to see exactly who has RSVP'd and their dietary notes,
So that I can plan the catering and seating.

**Acceptance Criteria:**

**Given** The host is on the Admin Dashboard
**When** They view the Guest List section
**Then** They see a table of all guests with their status
**And** They can filter by "Attending" or "Needs Action"
**And** They can see any "Dietary Requirements" entered by guests


