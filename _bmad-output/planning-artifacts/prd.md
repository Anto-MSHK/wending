---
stepsCompleted: [step-01-init, step-02-discovery, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish]
inputDocuments: ["brainstorming-session-2026-01-15.md", "ux-design-specification.md"]
workflowType: 'prd'
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - wedding

**Author:** Anton
**Date:** 2026-01-15
**Status:** DRAFT

## 1. Executive Summary & Success Criteria

A personalized, zero-friction wedding invitation web app designed to evoke emotion and simplify attendance tracking. The core promise is "Open a link, see your name, tap to confirm," removing all barriers for guests ranging from tech-savvy friends to elderly relatives.

### Success Criteria

| Category | Success Metric |
| :--- | :--- |
| **User** | Guests feel "awe and warmth" (qualitative) and recognize "this is for me" within 2 seconds. |
| **Business** | **100% Data Accuracy** (Zero manual entry for Host) and **>90% Response Rate** within 7 days. |
| **Technical** | **Zero Friction** (RSVP in <3 taps) and **100% Accessibility** for the "Grandma Persona". |

---

## 2. User Journeys

The product is designed around these core narratives to ensure all user types are served.

### J1: The "Grandma" Journey (Tech-Challenged Relative)
*   **Persona:** Vera, 72. Anxious about passwords and forms.
*   **Flow:** Receives WhatsApp link -> Taps -> Sees "Dear Vera" + Photo -> Taps big "Yes" button -> Confetti!
*   **Key Requirement:** No login, large text, immediate visual feedback.

### J2: The "Family Head" Journey (Group Management)
*   **Persona:** Sergey, 45. Managing RSVP for wife and 2 kids.
*   **Flow:** Opens link -> Sees "Ivanov Family" -> Toggles: Sergey (Yes), Elena (Yes), Kids (No) -> Submits 1 form.
*   **Key Requirement:** Household grouping logic, single submission for multiple IDs.

### J3: The "Host" Journey (Admin/Monitoring)
*   **Persona:** Anton (You). Stressed about logistics.
*   **Flow:** Checks secure /admin link -> Sees "74 Confirmed, 14 Pending" -> Checks Dietary restrictions -> Feels in control.
*   **Key Requirement:** Real-time data aggregation, read-only dashboard.

---

## 3. Functional Requirements (Capability Contract)

### 3.1 Guest Identity & Access
*   **FR-01:** Guest can access the application via a unique URL token without a password.
*   **FR-02:** System must validate the token and retrieve the specific Guest or Household profile.
*   **FR-03:** Guest can view a personalized greeting displaying their name(s).
*   **FR-04:** System must redirect invalid tokens to a generic support/contact page.

### 3.2 Content Experience
*   **FR-05:** Guest can view the "Love Story" section with text and photos.
*   **FR-06:** Guest can view Event Details (Date, Time, Venue Location).
*   **FR-07:** Guest can tap a "Map" action to open the location in their native map app.
*   **FR-08:** Guest can view a Countdown Timer ticking down to the event start.

### 3.3 RSVP & Attendance Engine
*   **FR-09:** Guest can view a list of all members associated with their Household group.
*   **FR-10:** Head of Household can toggle "Attending" status (Yes/No) for each member individually.
*   **FR-11:** System must prevent "Submit" if no options are selected (validation).
*   **FR-12:** Guest receives immediate visual feedback (Confetti/Success state) upon successful submission.
*   **FR-13:** Guest can change their RSVP response at any time by revisiting the link (until a locked date).

### 3.4 Admin & Data Management
*   **FR-14:** Host can access a secured Admin Dashboard (via password or separate admin token).
*   **FR-15:** Host can view aggregate counts: Total Invited, Confirmed Yes, Confirmed No, Pending.
*   **FR-16:** Host can filter the guest list by status (Attending/Not Attending).
*   **FR-17:** Host can view individual household responses and dietary notes.

---

## 4. Non-Functional Requirements (Quality Attributes)

### 4.1 Performance (Zero Friction)
*   **NFR-01:** Landing page Time to Interactive (TTI) must be **< 1.5 s** on standard 4G networks.
*   **NFR-02:** Total initial page weight (JS+CSS) must not exceed **150KB** (gzipped).
*   **NFR-03:** RSVP submission round-trip must complete in **< 500ms**.

### 4.2 Reliability
*   **NFR-04:** System must support **200 concurrent users** with 0% error rate (burst traffic support).
*   **NFR-05:** Database must have daily automated backups during the active RSVPrwindow.

### 4.3 Security & Privacy ("Obscurity" Model)
*   **NFR-06:** Guest URLs must use **cryptographically strong random tokens** (UUIDv4) to prevent ID guessing.
*   **NFR-07:** "NoIndex" headers must be present to prevent search engine indexing.
*   **NFR-08:** Admin Dashboard must be protected by a secure authentication mechanism.

### 4.4 Accessibility ("Grandma" Standard)
*   **NFR-09:** All body text must be minimum **18px** equivalent on visual render.
*   **NFR-10:** Interactive touch targets must be minimum **48x48px**.
*   **NFR-11:** Contrast ratio for text must meet **WCAG AA** standards (4.5:1).

---

## 5. Technical Architecture

*   **Project Type:** Web Application (Mobile-First SPA/Hybrid).
*   **Framework:** Next.js (React) + Tailwind CSS.
*   **Browser Support:** Primary focus on Mobile Web (iOS Safari, Android Chrome).
*   **Responsiveness:** Mobile-first implementation (`<640px` optimized, `>1024px` centered container).
*   **SEO/Social:** Dynamic OpenGraph tags required for rich link previews in Telegram/WhatsApp.

---

## 6. Roadmap & Scope

### Phase 1: MVP (The "Must Haves")
*   **Goal:** Enable reliable invitations and RSVPs.
*   **Features:**
    *   Personalized Landing Page (Hero, Greeting, Story).
    *   RSVP Engine (Guest/Group toggles, Yes/No logic).
    *   Guest Data Model (Households).
    *   Admin Dashboard (Read-only counts).

### Phase 2: Growth (Content & Social)
*   **Goal:** Increase engagement and excitement.
*   **Features:**
    *   Interactive Dress Code cards.
    *   Public Guest Wall (Who's coming).
    *   Guest Message Timeline.
    *   Swipeable Photo Gallery.

### Phase 3: Expansion (Post-Wedding)
*   **Goal:** Preserve memories.
*   **Features:**
    *   Photo upload for guests.
    *   Seating chart visualization.

### Risks & Mitigations
*   **Deep Linking Failures:** Mitigation - Use robust error redirection to a generic "Contact Host" page.
*   **Grandma Confusion:** Mitigation - Strict accessibility testing and fallback typography scaling.
*   **Resource Constraints:** Mitigation - Strict adherence to MVP scope; cut Phase 2 social features if timeline slips.
