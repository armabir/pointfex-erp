# Pointfex ERP — Project Status & Architecture Documentation

> **Document Version:** 2.0.0  
> **Last Updated:** November 2026  
> **Target Audience:** Engineering Team & AI Assistants  
> **Status:** Phase 1 Complete (Developer Workspace) · Phase 2 Complete (Project Manager Workspace) · Phase 3 Pending (C-Suite Workspaces)

---

## 1. Project Overview

### 1.1 Purpose & Mission
Pointfex ERP is an internal Enterprise Resource Planning system prototype designed for a simulated software development company (**Pointfex**). The application provides an integrated digital workspace for engineers, managers, and executives to track sprint progress, task management, code deliverables, developer earnings, performance metrics, and inter-departmental communications across a 5-week simulated development lifecycle.

### 1.2 Current Architectural Approach
- **Prototype-First / Frontend-Only:** The application is built entirely on the client side using React 19 and Vite. There is **no backend server, no connected database, no API endpoints, and no real authentication**.
- **In-Memory Reactive State with Persistence:** All company records (teams, projects, tasks, wallets, etc.) are seeded from structured mock data files and managed via React Context (`AppContext.jsx`). State changes (e.g., dragging tasks across Kanban columns, adding new project idea proposals, filing grievances, toggling notification read status, updating skills) mutate the active in-memory state during the session.
- **Local Persistence & URL Hash Sync:** Core preferences and navigation states are persisted across page reloads using browser `localStorage` and `window.location.hash`:
  - `pointfex_role`: Active user role (defaults to `developer`).
  - `pointfex_route`: Active workspace view (e.g., `dashboard`, `tasks`, `projects`, etc.).
  - `pointfex_theme`: Visual theme preference (`light` or `dark`).
  - `window.location.hash`: Tracks the active route (`#dashboard`, `#tasks`, `#earnings`), enabling browser reload, back, and forward navigation without losing the active view.

### 1.3 Technology Stack & Dependencies
Inspect `package.json`:
- **Core Framework:** React `19.3.1` / React DOM `19.3.1`
- **Build Tool & Bundler:** Vite `8.3.5` with `@vitejs/plugin-react` `6.1.2`
- **Styling & CSS:** Tailwind CSS `4.3.4` with `@tailwindcss/vite`
- **Iconography:** Lucide React `1.67.0`
- **Linter & Code Quality:** Oxlint `1.89.0`
- **Zero Heavy External State Libraries:** Lightweight native React Context + Hooks; no Redux, Zustand, or router packages.

### 1.4 Directory Structure
```
z:\Pointfex\erp\
├── .oxlintrc.json                      # Oxlint linter configuration
├── index.html                          # Single-page HTML shell with Google Fonts
├── package.json                        # Dependencies, scripts (dev, start, build, lint, preview)
├── vite.config.js                      # Vite configuration with React & Tailwind plugins
├── README.md                           # Quickstart guide
├── PROJECT_STATUS.md                   # This project status and architecture document
├── src/
│   ├── App.css                         # App-level styling
│   ├── App.jsx                         # Root application component & role router
│   ├── index.css                       # Global Tailwind CSS @theme and scrollbar rules
│   ├── main.jsx                        # React 19 root bootstrap
│   ├── assets/                         # Static assets (logos, images)
│   ├── components/
│   │   ├── common/                     # Reusable UI primitives
│   │   │   ├── Badge.jsx               # Color-coded pill badge
│   │   │   ├── Breadcrumbs.jsx         # Header navigation trail
│   │   │   ├── Button.jsx              # Reusable button with variants & sizes
│   │   │   ├── Card.jsx                # Ambient elevated container with rounded-3xl
│   │   │   ├── EmptyState.jsx          # Visual empty state display
│   │   │   ├── Modal.jsx               # Accessible dialog shell with ESC/backdrop click
│   │   │   ├── ProjectDetailModal.jsx  # Full project inspection & SRS display modal
│   │   │   ├── QuickSearchModal.jsx    # Global Cmd+K / Ctrl+K search dialog
│   │   │   ├── StatusPill.jsx          # Status pill with colored dot indicator
│   │   │   └── TaskDetailModal.jsx     # Full task inspection & comments modal
│   │   ├── dashboard/                  # Developer Dashboard specific widgets
│   │   │   ├── AnnouncementsWidget.jsx # Collapsible announcement cards
│   │   │   ├── MyProjectsOverview.jsx  # Active project progress cards
│   │   │   ├── MyTasksOverview.jsx     # Tasks overview with sorting buttons
│   │   │   ├── PerformanceSummary.jsx  # Starline-style SVG Donut Ring & metrics
│   │   │   ├── QuickTaskCreateModal.jsx# (Detached) Task creation modal
│   │   │   ├── RecentActivityFeed.jsx  # (Detached) Engineering activity log feed
│   │   │   ├── StatsSection.jsx        # 4 soft pastel stat cards (Peach, Lilac, Mint, Blue)
│   │   │   ├── UpcomingDeadlines.jsx   # Deadline tracking & overdue alerts
│   │   │   └── WelcomeBanner.jsx       # Personal greeting & sprint subtitle
│   │   └── layout/                     # Application shell layout
│   │       ├── Header.jsx              # Top bar with breadcrumbs & floating pill capsule
│   │       ├── NotificationDropdown.jsx# Dropdown list with unread counter & read toggles
│   │       ├── RoleSwitcher.jsx        # Temporary 6-role switcher dropdown
│   │       ├── Shell.jsx               # Master layout wrapper (Sidebar + Header + Main)
│   │       ├── Sidebar.jsx             # Collapsible navigation drawer with lime pill active state
│   │       └── UserMenu.jsx            # User avatar menu & reset demo data trigger
│   ├── config/
│   │   └── navigation.js               # Role-specific navigation maps and items
│   ├── context/
│   │   └── AppContext.jsx              # Global state provider, resolvers & handlers
│   ├── data/                           # Relational mock data store (16 files)
│   │   ├── activityLogs.js             # Audit trail & engineering events
│   │   ├── announcements.js            # Broadcast notices from executives & PMs
│   │   ├── attachments.js              # Mock task attachments metadata
│   │   ├── comments.js                 # Task comment threads
│   │   ├── index.js                    # Aggregator, deep-clone seed generator & resolvers
│   │   ├── milestones.js               # Sprint milestones & payout criteria
│   │   ├── notifications.js            # User alerts & notifications
│   │   ├── performance.js              # Developer quality scores & awards
│   │   ├── projects.js                 # 12 company projects & SRS specifications
│   │   ├── reports.js                  # New project ideas & employee grievances
│   │   ├── repositories.js             # Git repositories, branches & commit logs
│   │   ├── roles.js                    # 6 company roles & descriptions
│   │   ├── tasks.js                    # Detailed sprint tasks
│   │   ├── teams.js                    # 6 development squads (4 devs + 1 PM each)
│   │   ├── transactions.js             # Financial ledger (milestone payouts, penalties)
│   │   ├── users.js                    # 24 Developers, 6 PMs, 4 C-Level Executives
│   │   └── wallets.js                  # Developer virtual wallet balances & escrow
│   ├── hooks/
│   │   ├── useApp.js                   # Convenience hook for AppContext
│   │   ├── useDeveloperData.js         # Domain-level aggregation hook for developer data
│   │   └── usePmData.js                # Domain-level aggregation hook for PM data & team oversight
│   ├── pages/
│   │   ├── developer/                  # Phase 1: Fully functional Developer workspace
│   │   │   ├── DeveloperDashboard.jsx  # Main developer dashboard
│   │   │   ├── DeveloperEarningsPage.jsx# 4 metric cards, ledger table & penalties
│   │   │   ├── DeveloperProjectsPage.jsx# Assigned projects board & SRS links
│   │   │   ├── DeveloperReportPage.jsx # Project idea submissions & complaint filing
│   │   │   ├── DeveloperSettingsPage.jsx# Identity view & interactive skill tag management
│   │   │   ├── DeveloperTasksPage.jsx  # 5-column Kanban board with Drag-and-Drop
│   │   │   └── DeveloperTeamPage.jsx   # Team 1 Quantum Core squad & PM roster
│   │   ├── pm/                         # Phase 2: Fully functional Project Manager workspace
│   │   │   ├── PmDashboard.jsx         # PM Cockpit, pending approvals, team performance
│   │   │   ├── PmTasksPage.jsx         # PM personal tasks assigned by C-suite
│   │   │   ├── PmTaskManagementPage.jsx# Team 5-column Kanban, task creation, approval/rejection
│   │   │   ├── PmProjectsPage.jsx      # Team projects board, milestones, SRS specifications
│   │   │   ├── PmTeamManagementPage.jsx# Squad capacity, workload, task reassignment
│   │   │   ├── PmBudgetFinancePage.jsx # CFO authorized budgets, developer allocations, escrow
│   │   │   ├── PmEarningsPage.jsx      # PM personal earnings & team delivery scorecard
│   │   │   ├── PmReportsPage.jsx       # Reports & budget increase requests to C-Suite
│   │   │   └── PmSettingsPage.jsx      # PM identity, competencies, demo reset
│   │   └── placeholders/
│   │       └── RolePlaceholderPage.jsx # Universal placeholder for non-implemented roles
│   └── utils/
│       └── formatters.js               # Currency, date, deadline & badge helpers
```

---

## 2. Design System and Visual Identity

### 2.1 Design Philosophy: Functional Minimalism & Soft Aesthetic
The visual language is inspired by clean, modern business applications and softened by a relaxing, low-fatigue dashboard aesthetic (reference: Starline UI).
- **Core Tenet:** High information density without visual clutter or overwhelming decorative elements.
- **Elevation:** Soft, feathered ambient drop shadows instead of harsh, high-contrast borders:
  `shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03),0_2px_6px_-1px_rgba(15,23,42,0.02)]`
- **Border Radius:** Generous `rounded-3xl` (24px) for cards, `rounded-2xl` (16px) for inner containers, `rounded-xl` (12px) for buttons, and `rounded-full` for badges/capsules.
- **Accents:** Restrained pastel surface tints paired with high-contrast slate text and a signature chartreuse/soft lime active accent.

### 2.2 Color Palette (Exact HEX Values)
| Token / Element | Light Mode HEX | Dark Mode HEX | Notes |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#eaeef2` | `#090c14` | Soft cool-tinted putty grey in light mode; deep navy-black in dark mode |
| **Card Surface** | `#ffffff` | `#0f1422` | Pure white cards with ambient elevation |
| **Sub-Card / Inset Background** | `#f8fafc` (`slate-50`) | `#131a2b` | Inset tables, toolbars, and modal headers |
| **Primary Text** | `#0f172a` (`slate-900`) | `#f8fafc` (`slate-50`) | Sharp typography contrast |
| **Secondary Text** | `#64748b` (`slate-500`) | `#94a3b8` (`slate-400`) | Clean subtitles and secondary labels |
| **Subtle Borders** | `#e2e8f0` (`slate-200/60`)| `#1e293b` (`slate-800/80`)| Whisper-soft dividers |
| **Signature Active Accent (Lime)**| `#e2f952` / `#e5fc52` | `#e2f952` / `#e5fc52` | Used for active sidebar pills, brand spark, and primary actions |
| **Peach Pastel Card** | `#fff4ea` (border: `#fee3cc`) | `#201815` (border: `amber-900/40`) | Used for Wallet Balance stat card |
| **Lavender Pastel Card** | `#f4f0fe` (border: `#e7dcfb`) | `#1a1427` (border: `purple-900/40`)| Used for Active Tasks stat card |
| **Mint Pastel Card** | `#eafaf7` (border: `#cbf3eb`) | `#0e211f` (border: `emerald-900/40`)| Used for Sprint Completion stat card |
| **Powder Blue Pastel Card** | `#eff6ff` (border: `#dbeafe`) | `#101b2d` (border: `sky-900/40`) | Used for Active Projects stat card |
| **Status: In Progress** | Text: `#0284c7`, Dot: `#0ea5e9` | Text: `#38bdf8`, Dot: `#38bdf8` | Sky/Blue indicator |
| **Status: In Review** | Text: `#7c3aed`, Dot: `#8b5cf6` | Text: `#a78bfa`, Dot: `#a78bfa` | Purple indicator |
| **Status: Completed** | Text: `#15803d`, Dot: `#22c55e` | Text: `#4ade80`, Dot: `#4ade80` | Emerald/Green indicator |
| **Status: Blocked / Overdue** | Text: `#b91c1c`, Dot: `#ef4444` | Text: `#f87171`, Dot: `#f87171` | Rose/Red indicator |

### 2.3 Typography
Imported via Google Fonts in [index.html](file:///z:/Pointfex/erp/index.html):
- **Body & Sans UI:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Display & Headings:** `'Plus Jakarta Sans', sans-serif` (`font-display`) — used for metric figures, titles, and headers.
- **Code & Monospace:** `'Space Mono', Menlo, Consolas, monospace` (`font-mono`) — used for git branches, commit hashes, and codes.

### 2.4 Header & Capsule Controls
The header (`Header.jsx`) includes:
- **Left Side:** Breadcrumb navigation trail (`Breadcrumbs.jsx`) with a mobile hamburger menu button on small screens.
- **Right Side:**
  - **Floating Action Capsule:** A single cohesive `rounded-full` container housing:
    1. Quick Search Trigger (`Search` icon, opens `⌘K` modal).
    2. Theme Switcher (`Sun` / `Moon` icon, toggles `.dark` class on root HTML).
    3. Notifications Trigger (`NotificationDropdown.jsx` with real-time red unread counter badge).
  - **Role Switcher Dropdown:** `RoleSwitcher.jsx` displaying the active role badge and allowing switching between all 6 roles.
  - **User Profile Pill:** `UserMenu.jsx` with user initials avatar, email info, and demo data reset action.

### 2.5 Sidebar Navigation
The sidebar (`Sidebar.jsx`) features:
- **Brand Logo:** "Pointfex" with an 8-pointed spark icon (`Sparkles` in lime `#e2f952`).
- **Collapsible Behavior:** Toggles between expanded (`w-64`) and compact (`w-20`) states via a chevron button.
- **Active Navigation Indicator:** Pill-shaped `rounded-2xl` with bright lime background (`#e2f952`), dark text (`text-slate-950 font-semibold`), and ambient shadow.
- **Inactive Items:** Muted slate icons and labels that subtly lighten on hover (`hover:bg-white/80 dark:hover:bg-slate-800/60`).
- **User Capsule at Bottom:** Displays active user avatar, name, title, and online dot.

### 2.6 Reusable UI Component Library (`src/components/common/`)
| Component | File Path | Props & Description |
| :--- | :--- | :--- |
| `Card` | [Card.jsx](file:///z:/Pointfex/erp/src/components/common/Card.jsx) | Elevated container with `rounded-3xl`, optional `title`, `subtitle`, `icon`, `action` slot, `headerBorder`, and `noPadding`. |
| `Button` | [Button.jsx](file:///z:/Pointfex/erp/src/components/common/Button.jsx) | Reusable button with variants (`primary`, `lime`, `secondary`, `outline`, `subtle`, `ghost`, `danger`) and sizes (`xs`, `sm`, `md`, `lg`). Supports `icon` and `rightIcon`. |
| `Badge` | [Badge.jsx](file:///z:/Pointfex/erp/src/components/common/Badge.jsx) | Pill badge with color variants (`sky`, `emerald`, `amber`, `rose`, `indigo`, `purple`, `lime`, `slate`), `dot` option, and sizes (`xs`, `sm`). |
| `StatusPill` | [StatusPill.jsx](file:///z:/Pointfex/erp/src/components/common/StatusPill.jsx) | Formatted status indicator reading from `getStatusBadge()` with glowing dot and formatted text. |
| `Modal` | [Modal.jsx](file:///z:/Pointfex/erp/src/components/common/Modal.jsx) | Accessible dialog wrapper with `Escape` key capture, body scroll lock, backdrop blur, header, scrollable body, and `footer` slot. Dark theme fully applied. |
| `Breadcrumbs` | [Breadcrumbs.jsx](file:///z:/Pointfex/erp/src/components/common/Breadcrumbs.jsx) | Navigational trail linking to parent workspaces. |
| `EmptyState` | [EmptyState.jsx](file:///z:/Pointfex/erp/src/components/common/EmptyState.jsx) | Centered illustration/icon with title, description, and optional action button. |
| `TaskDetailModal` | [TaskDetailModal.jsx](file:///z:/Pointfex/erp/src/components/common/TaskDetailModal.jsx) | Detailed task inspection modal with status controls, priority badge, project link, description, checklist, comments list, and interactive comment submission. |
| `ProjectDetailModal`| [ProjectDetailModal.jsx](file:///z:/Pointfex/erp/src/components/common/ProjectDetailModal.jsx)| Detailed project modal displaying progress, deadlines, active git branch, team members, and the Software Requirements Specification (SRS) section. |
| `QuickSearchModal`| [QuickSearchModal.jsx](file:///z:/Pointfex/erp/src/components/common/QuickSearchModal.jsx)| Global command palette (`⌘K` / `Ctrl+K`) for live filtering of tasks, projects, and team members. |

---

## 3. Role and Navigation Structure

The application architecture supports six organizational roles. The role configuration is defined in [src/config/navigation.js](file:///z:/Pointfex/erp/src/config/navigation.js).

### 3.1 Role Navigation Matrix

| Role | Role ID | Configured Sidebar Panels | Implementation Status | Screen Displayed |
| :--- | :--- | :--- | :--- | :--- |
| **Developer** | `developer` | 1. Dashboard<br>2. My Tasks<br>3. My Projects<br>4. My Team<br>5. Earnings<br>6. Submissions & Complaints<br>7. Profile & Settings | **FULLY IMPLEMENTED** | Interactive Developer Workspace (`src/pages/developer/`) |
| **Project Manager (PM)**| `pm` | 1. Dashboard<br>2. My Tasks<br>3. Task Management<br>4. My Projects<br>5. Team Management<br>6. Budget & Finance<br>7. Earnings & Performance<br>8. Report to C-Level<br>9. Profile & Settings | **FULLY IMPLEMENTED** | Interactive PM Workspace (`src/pages/pm/`) |
| **CTO** | `cto` | 1. Engineering Pulse<br>2. System Topology<br>3. Code Quality & CI/CD<br>4. Velocity Benchmarks | **Placeholder** (`isImplemented: false`) | `RolePlaceholderPage` |
| **CPO** | `cpo` | 1. People Analytics<br>2. 24 Dev Roster & Capacity<br>3. Satisfaction & Morale | **Placeholder** (`isImplemented: false`) | `RolePlaceholderPage` |
| **CFO** | `cfo` | 1. Sprint Budget Burn<br>2. Project Escrow Locks<br>3. Developer Wallets | **Placeholder** (`isImplemented: false`) | `RolePlaceholderPage` |
| **CEO** | `ceo` | 1. Executive Radar<br>2. 5-Week Sprint Roadmap<br>3. Company Scorecard | **Placeholder** (`isImplemented: false`) | `RolePlaceholderPage` |

### 3.2 Role Switching & Isolation Behavior
- Role switching is handled by `RoleSwitcher.jsx` via `setRole(roleId)` in `AppContext.jsx`.
- When switching to `developer`, the application routes to the Developer workspace.
- When switching to `pm`, the application routes to the Project Manager workspace, dynamically scoped to the selected PM persona (Sarah Jenkins Team 1, Vikram Seth Team 2, etc.).
- When switching to any other role (`cto`, `cpo`, `cfo`, `ceo`), the sidebar updates its navigation labels to reflect that role's configured menu items, and the main viewport renders `RolePlaceholderPage.jsx` with a clear explanation that the workspace is scheduled for future implementation, along with a "Back to Developer Workspace" CTA button.

---

## 4. Developer Section — Current Implementation

The Developer section is our first completed section. All 7 sidebar panels have dedicated pages under `src/pages/developer/`.

### 4.1 Dashboard (`DeveloperDashboard.jsx`)
- **Location:** [src/pages/developer/DeveloperDashboard.jsx](file:///z:/Pointfex/erp/src/pages/developer/DeveloperDashboard.jsx)
- **Status:** **Fully Functional**
- **Components Included:**
  1. `WelcomeBanner.jsx`: Greets the developer by first name ("Welcome, Alex 👋") with sprint context subtitle. Uncluttered, no unnecessary action buttons.
  2. `StatsSection.jsx`: 4 soft pastel cards displaying:
     - **Wallet Balance:** `$3,850.00` (`+$1,250.00 in escrow`, links to Earnings).
     - **Active Tasks:** `4` (`2 in progress`, links to Tasks).
     - **Sprint Completion:** `88%` (`22 completed`, links to Tasks).
     - **Active Projects:** `2` (`Team 1 Quantum Core`, links to Projects).
  3. `MyTasksOverview.jsx`: Shows high-priority and urgent tasks with **interactive sorting buttons** (`Due Date`, `Priority`, `Status`, `Title A-Z`) that toggle ascending/descending order. Clicking a task opens `TaskDetailModal`. Includes a "Kanban View" link to `tasks`.
  4. `PerformanceSummary.jsx`: Replaces legacy activity feed. Features a **Starline-style circular SVG Donut Ring chart** with centered 94% quality score, multi-colored ring segments (Completed: 72%, In Progress: 18%, Review: 10%), metric breakdown cards (Completed, On-Time, Velocity, PR Rating), and recent accolade awards.
  5. `MyProjectsOverview.jsx`: Positioned directly below Performance. Displays assigned projects (PulseFlow Analytics Engine, CloudMesh Gateway Console) with sprint progress bars and links to `ProjectDetailModal`.
  6. `AnnouncementsWidget.jsx`: Expandable company and PM notices with priority badges, dates, and author tags.
  7. `UpcomingDeadlines.jsx`: Tracks approaching deliverables and clearly highlights overdue items.

### 4.2 My Tasks (`DeveloperTasksPage.jsx`)
- **Location:** [src/pages/developer/DeveloperTasksPage.jsx](file:///z:/Pointfex/erp/src/pages/developer/DeveloperTasksPage.jsx)
- **Status:** **Fully Functional**
- **Features & Interactions:**
  - **HTML5 Drag-and-Drop:** Developers can drag task cards between Kanban columns: `To Do`, `In Progress`, `In Review`, `Completed`, and `Blocked`.
  - **Permission Enforcement:** Developers **cannot** drag tasks into or mark tasks as `Completed`. Attempting to drop into the Completed column triggers a warning toast notification: *"Permission denied: Only Project Managers (PM) can verify and mark tasks as Completed"*.
  - **Project Filter Sidebar:** Left-hand sidebar displaying interactive project cards (All Projects, PulseFlow Analytics, CloudMesh Gateway) showing real-time task counts, completion percentages, and progress bars. Clicking a project card filters the Kanban board instantly.
  - **Task Detail Inspection:** Clicking any task opens `TaskDetailModal.jsx` allowing description review, checklist inspection, and comment submission.

### 4.3 My Projects (`DeveloperProjectsPage.jsx`)
- **Location:** [src/pages/developer/DeveloperProjectsPage.jsx](file:///z:/Pointfex/erp/src/pages/developer/DeveloperProjectsPage.jsx)
- **Status:** **Fully Functional**
- **Features & Interactions:**
  - Displays grid cards for projects assigned to Team 1 (PulseFlow Analytics Engine `PFA-01` and CloudMesh Gateway Console `CMG-02`).
  - Displays project description, progress percentage with animated bar, status pill, allocated sprint budget, deadline date, and active repository branch with latest commit.
  - Clicking "Details" opens `ProjectDetailModal.jsx` which displays:
    - **SRS Section:** Software Requirements Specification document name (e.g., `PFA-01-SRS-Telemetry-Engine-v2.4.pdf`), version (`v2.4 Approved`), requirements count (28 items), document link (`ExternalLink`), and technical overview.
    - **Milestone Timeline:** Visual progress of sprint phases.
    - **Deadlines & Sprint Week:** Time remaining breakdown.

### 4.4 My Team (`DeveloperTeamPage.jsx`)
- **Location:** [src/pages/developer/DeveloperTeamPage.jsx](file:///z:/Pointfex/erp/src/pages/developer/DeveloperTeamPage.jsx)
- **Status:** **Fully Functional**
- **Features & Interactions:**
  - Displays team banner for **Team 1 — Quantum Core** with focus description.
  - **Project Manager Card:** Displays PM Sarah Jenkins with initials avatar, title, and online presence badge.
  - **Developer Squad Grid:** Lists all 4 squad developers:
    1. Alex Rivera (with highlighted "YOU" badge).
    2. Marcus Vance (Lead Full-Stack Engineer).
    3. Elena Rostova (UI/UX & Frontend Developer).
    4. Devon Park (Backend & Systems Engineer).
  - Displays each member's online status, corporate email, timezone, and individual skill tags.

### 4.5 Earnings & Virtual Wallet (`DeveloperEarningsPage.jsx`)
- **Location:** [src/pages/developer/DeveloperEarningsPage.jsx](file:///z:/Pointfex/erp/src/pages/developer/DeveloperEarningsPage.jsx)
- **Status:** **Fully Functional**
- **Features & Interactions:**
  - **Strict Top 4 Metric Cards:**
    1. **Balance:** `$3,850.00` (Available in virtual wallet).
    2. **Total Earned:** `$9,600.00` (Cumulative sprint compensation).
    3. **Penalty:** `$250.00` (SLA breach & missed review delay deductions).
    4. **Spendings:** `$400.00` (Hardware & gear purchases, note indicates catalog addition in future phase).
  - **Transaction Ledger:** Tabbed table allowing filtering by `All Transactions`, `Payouts & Bonuses`, and `Penalties`. Displays transaction IDs, dates, descriptions, amounts (positive payouts in emerald, negative penalties in rose), and status badges.
  - **Performance & Delivery Metrics:** Dedicated section below the ledger displaying Quality Score (94/100), On-Time Delivery Rate (96%), Sprint Velocity (42 pts), and Sprint 2 Bonus status.

### 4.6 Submissions & Complaints (`DeveloperReportPage.jsx`)
- **Location:** [src/pages/developer/DeveloperReportPage.jsx](file:///z:/Pointfex/erp/src/pages/developer/DeveloperReportPage.jsx)
- **Status:** **Fully Functional**
- **Features & Interactions:**
  - **Tab 1: New Project Idea Submission:**
    - Form fields: **Project Title**, **Specification Docs URL**, and **Proposal Description**.
    - Submitting adds a new record to the in-memory `reports` store with `status: 'pending_review'` and displays a success toast.
    - History list displays previously submitted proposals with status pills (`Approved`, `Under Review`, `Pending Review`), external spec links, and reviewer feedback from CTO/PM.
  - **Tab 2: General Complaints & Grievances:**
    - Designed for workplace complaints (workload, review delays, team dependencies).
    - Form fields: **Complain To** (Dropdown: `Project Manager (PM)`, `Chief Technology Officer (CTO)`, `People Operations (CPO)`, `Lead Architect`), **Complaint Title**, and **Detailed Description**.
    - Submitting logs the grievance with `status: 'pending'` and notifies management.
    - History list displays submitted grievances, routing destination, status pills (`Pending`, `Under Investigation`, `Resolved`), and administrative response feedback.

### 4.7 Profile & Settings (`DeveloperSettingsPage.jsx`)
- **Location:** [src/pages/developer/DeveloperSettingsPage.jsx](file:///z:/Pointfex/erp/src/pages/developer/DeveloperSettingsPage.jsx)
- **Status:** **Fully Functional**
- **Features & Interactions:**
  - **Developer Identity (View-Only):** Personal details (Name: Alex Rivera, Title: Senior Frontend Engineer, Email, Timezone: UTC-5 EST, GitHub: `github.com/alex-pointfex`) are rendered cleanly in view-only mode to preserve profile consistency.
  - **Interactive Technical Skills Management:**
    - Displays technical skill tags (`React`, `TypeScript`, `Tailwind CSS`, `Vite`, `GraphQL`, `Next.js`).
    - Developers can remove existing skills by clicking the `X` icon on any badge.
    - Developers can type a new skill into the input field and click "Add Skill" (or press Enter). Changes immediately update the reactive user profile in `AppContext` and trigger a toast.
  - **Reset Demo Data Action:** Danger-zone button allowing the user to reset all in-memory mock data, routes, and modals back to the fresh seed defaults.

---

## 5. PM Section — Planned Structure

The Project Manager (PM) workspace is the **next planned development milestone**.

### 5.1 Agreed 9-Panel Sidebar Structure (Future Target)
When implementing Phase 2, the PM sidebar navigation will be structured as follows:

1. **Dashboard:** High-level sprint health, blocker radar, team velocity, and milestone delivery pace.
2. **My Tasks:** PM's personal operational tasks, meeting preparations, and sprint administrative duties.
3. **Task Management:** Cross-team backlog and sprint board with task assignment, verification, and the exclusive authority to mark developer tasks as `Completed`.
4. **My Projects:** Overview of the 2 projects owned by the PM's team, milestone tracking, and budget burn rate.
5. **Team Management:** Management of the 4 squad developers, workload distribution, and peer review balancing.
6. **Budget & Finance:** Sprint milestone allocations, escrow tracking, bonus approvals, and penalty assessments.
7. **Earnings & Performance:** PM compensation, management bonus tracking, and team delivery scores.
8. **Report to C-Level:** Weekly sprint reporting, escalation of critical blockers, and budget variance reports to CTO/CFO/CEO.
9. **Profile & Settings:** PM profile details and workspace preferences.

> [!NOTE]  
> The current codebase still contains the preliminary 5-item placeholder config in `src/config/navigation.js` (`pm-overview`, `pm-teams`, `pm-projects`, `pm-deliverables`, `pm-reports`). During Phase 2 implementation, this will be updated to the agreed 9-panel structure.

---

## 6. Data Architecture and State Management

### 6.1 Mock Data Organization (`src/data/`)
All data resides in separate JavaScript modules in `src/data/`, aggregated by [src/data/index.js](file:///z:/Pointfex/erp/src/data/index.js):

| File | Primary Model | Key Fields & Relationships |
| :--- | :--- | :--- |
| `users.js` | `USERS` (34 users) | `id`, `name`, `email`, `role`, `title`, `teamId`, `skills`, `timezone`, `github`, `avatar`, `initials`, `status`. Contains 24 devs across 6 teams, 6 PMs, and 4 C-levels. Default dev: `user_dev_01` (Alex Rivera). |
| `teams.js` | `TEAMS` (6 squads) | `id`, `name`, `code`, `focus`, `pmId`, `leadDevId`, `memberIds` (4 devs), `projectIds` (2 projects), `weeklyVelocity`, `health`. |
| `projects.js` | `PROJECTS` (12 projects) | `id`, `name`, `code`, `teamId`, `pmId`, `leadDevId`, `repoId`, `progress`, `budget`, `startDate`, `deadline`, `tags`, `assignedDevIds`, `srs` (document title, URL, version, requirements count). |
| `tasks.js` | `TASKS` (24+ sprint tasks)| `id`, `title`, `description`, `projectId`, `assigneeId`, `creatorId`, `status` (`todo`, `in_progress`, `in_review`, `completed`, `blocked`), `priority` (`urgent`, `high`, `medium`, `low`), `dueDate`, `estimatedHours`, `loggedHours`, `tags`. |
| `comments.js` | `TASK_COMMENTS` | `id`, `taskId`, `authorId`, `content`, `createdAt`. |
| `attachments.js` | `TASK_ATTACHMENTS` | `id`, `taskId`, `name`, `size`, `type`, `uploadedById`, `uploadedAt`. |
| `wallets.js` | `WALLETS` | `userId`, `balance`, `pendingEscrow`, `totalEarnedToDate`, `totalPenalties`, `hourlyRateEquivalent`, `lastPayoutDate`. |
| `transactions.js`| `TRANSACTIONS` | `id`, `userId`, `projectId`, `milestoneId`, `amount` (+payout / -penalty), `type` (`milestone_payout`, `penalty`, `bonus`, `advance_disbursement`), `description`, `date`, `status`, `reason`. |
| `performance.js` | `PERFORMANCE_RECORDS` | `userId`, `overallScore`, `completionRate`, `onTimeDeliveryRate`, `codeQualityScore`, `peerReviewScore`, `recentRewards` (`id`, `title`, `description`, `icon`, `bonusValue`). |
| `reports.js` | `REPORTS` | Contains both `project_submission` (ideas) and `complaint` (grievances) with `userId`, `teamId`, `title`, `docsUrl`, `complainTo`, `description`, `date`, `status`, `feedback`. |
| `milestones.js` | `MILESTONES` | `id`, `projectId`, `sprintWeek`, `title`, `dueDate`, `status`, `progress`, `payoutAmount`. |
| `repositories.js`| `REPOSITORIES` | `id`, `projectId`, `name`, `url`, `defaultBranch`, `activeBranch`, `openPRsCount`, `lastCommit`. |
| `announcements.js`| `ANNOUNCEMENTS` | `id`, `title`, `content`, `authorId`, `authorName`, `category`, `priority`, `date`, `read`, `pinned`. |
| `notifications.js`| `NOTIFICATIONS` | `id`, `userId`, `title`, `message`, `type`, `timestamp`, `read`, `entityType`, `entityId`. |
| `activityLogs.js` | `ACTIVITY_LOGS` | `id`, `userId`, `action`, `entityType`, `entityId`, `entityTitle`, `description`, `timestamp`, `badgeColor`. |
| `roles.js` | `ROLES`, `ROLE_LIST` | `id`, `name`, `badge`, `description`, `isImplemented`. |

### 6.2 Relational Mapping
Entities reference each other strictly via primary keys:
- `Task` references `projectId` (`projects.js`) and `assigneeId` (`users.js`).
- `Project` references `teamId` (`teams.js`), `pmId` (`users.js`), and `repoId` (`repositories.js`).
- `Team` references `pmId` (`users.js`), `memberIds` (`users.js`), and `projectIds` (`projects.js`).
- `Transaction` references `userId` (`users.js`) and `projectId` (`projects.js`).
- `Data Resolvers` in `src/data/index.js` (`createDataResolvers`) provide efficient relational joins:
  `getUser(id)`, `getProject(id)`, `getTeam(id)`, `getRepo(id)`, `getDeveloperTasks(devId)`, `getDeveloperProjects(devId)`, `getDeveloperWallet(devId)`, etc.

### 6.3 State Management & React Context
Global state is managed by `AppProvider` in [src/context/AppContext.jsx](file:///z:/Pointfex/erp/src/context/AppContext.jsx):
- **Core State Variables:**
  - `data`: Complete deep-cloned in-memory data store.
  - `currentRole`: Active role string (`'developer'`, `'pm'`, etc.).
  - `currentDevId`: ID of active developer (`'user_dev_01'`).
  - `currentRoute`: Active navigation route (`'dashboard'`, `'tasks'`, etc.).
  - `theme`: Active color theme (`'light'` or `'dark'`).
  - `isSidebarCollapsed`: Boolean controlling sidebar width.
  - `selectedTaskModal`: Task object for detail inspection dialog.
  - `selectedProjectModal`: Project object for detail inspection dialog.
  - `isSearchOpen`: Boolean controlling the `⌘K` modal.
  - `toastMessage`: Object `{ msg, type, id }` controlling feedback alerts.
- **State Action Handlers:**
  - `updateTaskStatus(taskId, newStatus)`: Mutates task status and logs an activity entry; enforces the PM-only completion check.
  - `updateUserProfile(updatedFields)`: Updates user skills in the in-memory state.
  - `addSubmission(submission)`: Adds a new project idea to `reports`.
  - `addComplaint(complaint)`: Adds a new grievance to `reports`.
  - `markNotificationRead(id)` / `markAllNotificationsRead()`: Updates notification read flags.
  - `resetDemoData()`: Deep-clones fresh seed data from `getInitialSeedData()` and restores the workspace.

---

## 7. Existing Functionality & Interactions

### 7.1 Fully Working Interactive Features
- **Sidebar Navigation:** Clicking any sidebar route switches panels instantly without full-page reloads and syncs with `window.location.hash` and `localStorage`.
- **Sidebar Collapse/Expand:** Chevron button toggles between full 64-character width and compact icon-only 20-character width.
- **Theme Switching:** Top-bar Moon/Sun button toggles between light (`#eaeef2`) and dark (`#090c14`) mode, persisting in `localStorage` and updating DOM class.
- **Role Switcher:** Header dropdown allows switching between Developer and 5 simulated executive/management roles.
- **Kanban Drag-and-Drop:** Native HTML5 drag-and-drop allows moving tasks between To Do, In Progress, In Review, and Blocked columns.
- **PM Completion Guard:** Prevents developers from moving tasks to Completed, displaying an error toast.
- **Task Sorting:** Dashboard task table allows sorting by Due Date, Priority, Status, and Title with ascending/descending toggling.
- **Project Filtering on Tasks:** Project cards in the Tasks sidebar filter the Kanban board dynamically.
- **Global Search (`⌘K` / `Ctrl+K`):** Live filtering across tasks, projects, and squad members with direct click-to-open handlers.
- **Notifications System:** Bell button opens dropdown with unread badge counter, individual mark-read actions, and a "Mark all read" button.
- **Project Detail Inspection:** Modals display sprint progress, deadlines, repo branch, and full SRS document metadata.
- **Task Detail Inspection & Commenting:** Modals display full task metadata, checklist, and allow posting new comments into the thread.
- **Project Idea Submission Form:** Functional form submitting proposals with status tracking.
- **Grievance / Complaint Filing Form:** Functional form routing complaints to PM, CTO, or CPO with status tracking.
- **Interactive Skills Management:** Add and remove skill pills on the Profile page with immediate UI persistence.
- **Demo Data Reset:** Destructive action restoring all data and state to original seed values.
- **Non-intrusive Toast Notifications:** Self-dismissing alerts confirming state mutations and errors.

### 7.2 Non-Functional / Simulated Elements
- **External Links:** GitHub URLs, external SRS PDF links, and document URLs are realistic dummy URLs.
- **Authentication:** No login forms or session tokens; role switching is simulated via state.
- **Spendings Catalog:** The spendings metric card displays simulated historical equipment deductions; the interactive catalog will be developed in a future phase.

---

## 8. Backend and Integration Status

- **Backend Server:** **None.** No Express, Node, Python, or Go API server is running or connected.
- **Database:** **None.** No PostgreSQL, MongoDB, SQLite, or Firebase integration exists.
- **Authentication:** **Simulated.** No JWT, OAuth, session cookies, or user login screens.
- **Network / API Calls:** **None.** All data transactions take place synchronously in-memory inside `AppContext.jsx`.
- **Third-Party Integrations:** Simulated GitHub repositories and document URLs; no active GitHub Webhooks or REST integrations.

---

## 9. Project Structure & Development Guidelines

### 9.1 Important Files & Responsibilities
- `src/App.jsx`: Main routing logic. Renders `RolePlaceholderPage` if `currentRole !== 'developer'`; otherwise switches between developer pages based on `currentRoute`.
- `src/components/layout/Shell.jsx`: Master UI layout holding `Sidebar`, `Header`, `main` content area, modals, and toast pill.
- `src/context/AppContext.jsx`: Single source of truth for all demo data, active role, active route, modals, and state modification handlers.
- `src/config/navigation.js`: Defines sidebar menus and icon configurations for each role.
- `src/utils/formatters.js`: Formatters for currency (`$3,850`), dates (`Nov 4, 2026`), relative deadlines (`2d overdue`), and status pills.

### 9.2 How to Add a New Page to the Developer Workspace
1. Create the page component in `src/pages/developer/NewPage.jsx`.
2. Add the route entry to `src/config/navigation.js` under `ROLE_NAVIGATION.developer.items`:
   ```javascript
   { id: 'new-page', label: 'New Page', icon: IconComponent, isImplemented: true }
   ```
3. Update `MainContentRouter` in `src/App.jsx`:
   ```javascript
   case 'new-page':
     return <NewPage />
   ```
4. Update header title mapping in `src/components/layout/Header.jsx` (`routeMap`).

### 9.3 How to Implement the PM Workspace (Phase 2 Roadmap)
1. Update `ROLE_NAVIGATION.pm.items` in `src/config/navigation.js` with the 9 agreed panels.
2. Create PM pages inside `src/pages/pm/` (e.g., `PmDashboard.jsx`, `PmTaskManagementPage.jsx`, etc.).
3. Update `src/App.jsx` to route PM roles to PM pages rather than `RolePlaceholderPage`.
4. Ensure PM role has full authorization to mark tasks as `Completed`.

### 9.4 Coding Conventions & Guidelines
- **Modularity:** Keep components small, focused, and organized under `src/components/common/`, `dashboard/`, or `layout/`.
- **Styling:** Use Tailwind CSS utility classes. Never hardcode inline style objects for colors or borders unless computing dynamic percentage widths.
- **Icons:** Use Lucide React icons (`lucide-react`).
- **Purity & Linter:** Ensure code adheres to `oxlint` rules (`npm run lint`). Avoid impure functions (like `new Date()`) directly inside render bodies; use formatters or memoized hooks.
- **Extensible Data:** Always link data records via relational IDs rather than deep object duplication.

### 9.5 Local Development Commands
```bash
# Install packages
npm install

# Start Vite local development server (runs on port 5173)
npm run dev

# Run Oxlint linter check
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 10. Known Issues & Incomplete Work

1. **Non-Developer Role Dashboards:** Switching to PM, CTO, CPO, CFO, or CEO renders `RolePlaceholderPage`. These workspaces are pending subsequent development phases.
2. **PM Navigation Configuration Discrepancy:** `src/config/navigation.js` currently lists 5 preliminary items for PM (`pm-overview`, `pm-teams`, `pm-projects`, `pm-deliverables`, `pm-reports`) instead of the newly agreed 9-panel structure. This will be updated when starting Phase 2.
3. **Detached Components:**
   - `src/components/dashboard/QuickTaskCreateModal.jsx`: Exists in the codebase but was detached when quick action buttons were removed from the dashboard banner to simplify UI.
   - `src/components/dashboard/RecentActivityFeed.jsx`: Exists in the codebase but was detached when replaced by `PerformanceSummary.jsx`.
4. **Session Volatility:** In-memory state changes (newly submitted proposals, grievances, dragged tasks) reset upon hard browser reload unless modified in persistent local storage.

---

## 11. Important Development Decisions to Preserve

1. **Frontend Prototype First:** Continue developing with clean, structured mock data and in-memory state. Do not introduce a backend server, database, or API layer at this stage.
2. **Role Progression:** The **Developer Workspace is Phase 1 (Complete)**. The **Project Manager (PM) Workspace is Phase 2 (Next Target)**. Subsequent phases will address C-level dashboards (CTO, CPO, CFO, CEO).
3. **Preserve Visual Design & Theme:** Retain the soft minimalist aesthetic, rounded-3xl cards, subtle ambient drop shadows, soft pastel stat tiles, lime active navigation pill, and floating header action capsule. **Do not redesign or alter established UI patterns.**
4. **PM Task Completion Authority:** Developers must remain restricted from marking tasks as `Completed`. Only PM and management roles possess completion verification authority.
5. **Component Reusability:** Always reuse existing common primitives (`Card`, `Button`, `Badge`, `StatusPill`, `Modal`) when constructing new panels.
6. **Progressive Disclosure:** Keep interfaces clean and low-fatigue. Secondary details should always be placed inside drawers, tabs, or modal dialogs rather than cluttering default views.

