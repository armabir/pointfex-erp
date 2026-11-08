# Pointfex ERP — Project Status & Architecture Documentation

> **Document Version:** 3.0.0  
> **Last Updated:** November 2026  
> **Target Audience:** Engineering Team & AI Assistants  
> **Status:** Phase 1 Complete (Developer Workspace) · Phase 2 Complete (Project Manager Workspace) · Phase 3 Complete (Chief Technology Officer Workspace) · Phase 4-6 Pending (CPO, CFO, CEO)

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

## 5. PM Section — Completed Implementation (Phase 2)

The Project Manager (PM) workspace is **fully implemented, refined, and verified**.

### 5.1 Implemented 9-Panel Sidebar Structure
All 9 PM panels are fully functional, interactive, and powered by reactive state:

1. **Dashboard (`PmDashboard.jsx`):** High-level sprint health, pending deliverable verification queue with inline Approve/Inspect, assigned projects overview, SVG donut performance ring, task distribution breakdown, and budget summary.
2. **My Tasks (`PmTasksPage.jsx`):** Exactly identical 2-column layout to Developer Tasks. Left-side C-Suite Executive filter cards (All Directives, CTO, CFO, CPO, CEO) with completion stats, and right-side 5-column interactive Kanban board (`todo`, `in_progress`, `in_review`, `completed`, `blocked`) with drag-and-drop support.
3. **Task Management (`PmTaskManagementPage.jsx`):** Exactly identical 2-column layout to Developer Tasks. Left-side Project filter cards (All Projects + individual project cards with stats) and right-side 5-column Kanban board with Drag & Drop, developer filter dropdown, inline Approve & Reject with feedback for `in_review` deliverables, and task creation modal.
4. **My Projects (`PmProjectsPage.jsx`):** Overview of squad projects, client/stakeholder field, budget, deadline, tech stack pills, SRS specification links, repository & demo URLs, and an interactive **Sprint Milestones** manager allowing PMs to add milestones and cycle milestone statuses (`pending` -> `in_progress` -> `completed`).
5. **Team Management (`PmTeamManagementPage.jsx`):** Clean, simplified squad capacity overview for the 4 dedicated developers, active vs completed counts, contact information, and a streamlined task reassignment modal.
6. **Budget & Finance (`PmBudgetFinancePage.jsx`):** Project-wise filter sidebar on the left ("All Projects" card + individual project cards with budget allocation and utilization bars). Selecting any project dynamically filters all metric cards (Authorized Budget, Allocated to Devs, Released/Paid, Remaining Reserve), breakdown tables, and ledger transactions. Includes modals to allocate weekly funds to developers and submit budget increase requests to the CFO.
7. **Earnings & Performance (`PmEarningsPage.jsx`):** Exactly identical layout to Developer Earnings. Top 4 metric cards (`Balance`, `Total Earned`, `Penalty`, `Spendings`), transaction ledger table with filter tabs (`All`, `Payouts`, `Penalties`), and a Performance & Delivery scorecard below the table with quality metrics and qualified bonus banner.
8. **Report to C-Level (`PmReportsPage.jsx`):** Exactly identical structure to Developer Submissions & Complaints, plus an executive **Review Developer Submissions** tab allowing PMs to review project proposals from their team's developers and forward them to C-level executives (CTO, CEO, CFO, CPO) with a custom PM endorsement note.
9. **Profile & Settings (`PmSettingsPage.jsx`):** Exactly identical structure to Developer Settings. View-only Management Identity card (avatar, name, title, email, timezone, team), interactive Management Skills management (add/remove competencies), and Prototype Controls for resetting simulated demo data.

---

## 6. CTO Section — Completed Implementation (Phase 3)

The Chief Technology Officer (CTO) workspace is **fully implemented, interactive, tested, and verified** across all 13 sidebar panels.

### 6.1 Implemented 13-Panel Sidebar Structure
All 13 CTO panels are fully functional, interactive, and powered by reactive state:

1. **Dashboard (`CtoDashboard.tsx`):**
   - **4 Starline Pastel Cards:** Active Projects (12), Active Engineering Tasks (19), Code Quality Index (96%), Security CVE Status (0 Critical).
   - **12 Monitored Projects:** Robust responsive card grid (using code badge + status pill on row 1, non-wrapping titles, and sprint progress bars).
   - **Code Quality Donut Ring:** SVG donut ring chart displaying automated code compliance distribution (Clean: 74%, Tech Debt: 16%, In Review: 10%), quality scorecard metrics, and architectural awards.
   - **Active Pull Requests Stream:** High-priority PRs awaiting executive inspection.
   - **Security Posture & CVE Watch:** Real-time vulnerability posture across repositories.
   - **Company-Wide Engineering Velocity:** 240 pts across all 6 squads.
   - **Engineering Activity Log:** Live git, task, and architectural events.

2. **My Tasks (`CtoTasksPage.tsx`):**
   - **Executive Strategic Directives:** Tasks assigned directly to the CTO by CEO Victoria Sterling-Fox and the Board.
   - **Strategic Pillar Filter Sidebar:** "All Strategic Directives" card with overall completion bar, plus category filters (`System Architecture`, `Security & Compliance`, `AI & Data Platforms`).
   - **5-Column Kanban Board:** `todo`, `in_progress`, `in_review`, `completed`, `blocked`.
   - **Permission Rule:** CTO cannot drag strategic directives directly to `Completed`. The `completed` column is locked with a lock icon. Attempting to drop into Completed triggers an executive permission toast: *"Permission denied: CTO strategic directives require CEO verification & Board sign-off to be completed. Please move to 'In Review' for review."*

3. **Task Management (`CtoTaskManagementPage.tsx`):**
   - **PM Directive Assignment Desk:** CTO assigns technical architecture mandates and sprint directives to Project Managers.
   - **PM Summary Cards Sidebar:** Shows all 6 PMs with active directive counts, in-review indicators, and completion bars.
   - **Directive Kanban Board:** 5-column board (`Assigned`, `In Progress`, `Deliverable Review`, `Verified & Merged`, `Escalated/Blocked`).
   - **Inline Verification & Changes:** In the `in_review` column, CTO can click **Approve** (marks deliverable verified & merged) or **Request Changes** (opens modal to write technical feedback, returning the task to in_progress).
   - **"Assign Directive" Modal:** Form allowing CTO to specify title, target project, assignee PM, priority (`urgent`, `high`, `medium`, `low`), deadline, technical specification / acceptance criteria, and tech tags.

4. **Team Management (`CtoTeamManagementPage.tsx`):**
   - **6 Autonomous Squads:** Squad Alpha, Squad Beta, Squad Gamma, Squad Delta, Squad Epsilon, Squad Zeta.
   - **Top Metric Cards:** 6 Squads, 24 Active Engineers, Avg Weekly Velocity (40 pts), Squad Health Index (98.2%).
   - **Squad Cards Grid:** Shows squad focus, weekly velocity badge, PM & Tech Lead avatars, assigned project tags with sprint progress, developer roster avatars, and task completion progress bars.
   - **Squad Inspection Modal:** Detailed view of all 4 developers in the squad, lead engineer badge, and managed projects.

5. **Audit Log (`CtoAuditLogPage.tsx`):**
   - **Company-Wide Immutable Audit Trail:** Tracks all git merges, PR reviews, task status mutations, security advisories, and financial allocations.
   - **Filters:** Search by description, action, or actor; category filters (`All`, `Git & PRs`, `Tasks & Directives`, `Financial & Budget`, `Security & Auth`, `Milestones`).
   - **Export Feature:** "Export Audit (JSON)" button downloads formatted audit JSON logs.
   - **Audit Record Inspection Modal:** Displays actor ID, timestamp, full description, target entity, and cryptographic sha256 verification hash.

6. **People (`CtoPeoplePage.tsx`):**
   - **Engineering Directory:** 24 software engineers, 6 project managers, and 4 C-Level executives (34 total users).
   - **Search & Role Tabs:** Instant search by name, title, or competency tags; filter tabs (`All`, `Engineers`, `PMs`, `Leadership`).
   - **Engineer Cards:** Shows avatar, online indicator, role badge, title, squad association, competency tags, active task count, and direct inspect button.
   - **Personnel Inspection Modal:** Displays biography, core competencies list, and currently assigned deliverables with real-time statuses.

7. **Projects & Repos (`CtoProjectsReposPage.tsx`):**
   - **12 Code Repositories:** Full architecture oversight of all company projects (`repo_01` to `repo_12`).
   - **Repository Overview Cards:** Displays project code badge, status pill, name, description, progress bar, GitHub repository name, default branch (`main`), star count, fork count, open PR count, tech stack tags, and SRS link.
   - **"Configure Repository" Modal:** CTO can update GitHub repo URL, change default production branch, update SRS documentation link, and add/edit tech stack tags. Calls `updateRepoConfig` with activity log recording.
   - **Project Details:** Links directly to `ProjectDetailModal`.

8. **Code Review & Quality (`CtoCodeQualityPage.tsx`):**
   - **Top Metrics:** Average Quality Score (95%), Unit Test Coverage (88%), Open Pull Requests (6), Technical Debt Hours (18.4 hrs).
   - **Tab 1: Pull Requests Review Center:** List of active PRs (`pr_01` to `pr_06`) showing branch source/target, author, project code, diff line stats (`+420 / -35`), automated Sonar score pill, and PR status. "Review PR" modal allows CTO to **Approve & Merge**, **Approve**, or **Request Changes** with review notes.
   - **Tab 2: Sonar Quality Gates:** Detailed scorecard table for all 12 projects showing compliance score, test coverage bar, bugs detected, code smells, vulnerabilities, tech debt hours, and gate pass status (`passed`, `warning`, `failed`).

9. **Security & Testing (`CtoSecurityTestingPage.tsx`):**
   - **Cybersecurity Posture:** Tracks active CVEs and security advisories (`sec_01` to `sec_04`).
   - **"Log Security Advisory" Modal:** Form allowing CTO to log critical vulnerabilities with target project, severity (`critical`, `high`, `medium`, `low`), category (`dependency`, `auth`, `injection`, `encryption`, `infrastructure`), CVE ID, description, and remediation advice.
   - **Status Updates:** Dropdown allowing status transitions between `open`, `investigating`, `patch_in_progress`, and `resolved`.
   - **Automated Test Suites:** 6 CI/CD testing suites (Unit, E2E Cypress, Penetration DAST, Microservice Contract, Load Chaos, Static Secret Scanner) with test counts, execution durations, pass rates, and an interactive "Run Suite" simulation trigger.
   - **Bug Bounty Hall of Fame:** HackerOne vulnerability disclosure log showing researcher handle, vulnerability title, target project, bounty reward payout, status, and disclosure date.

10. **Consultancy (`CtoConsultancyPage.tsx`):**
    - **Internal Architecture Advisory Requests:** Manages specialized consulting requests from squads (`cons_01` to `cons_04`).
    - **Top Metrics:** Total Engagements (4), Advisory Hours (36 hrs), Internal Billed Allocation ($6,800), Squad Satisfaction (100%).
    - **Engagement Cards:** Displays requesting squad, status pill, title, scope description, lead advisor, estimated hours, and internal fee.
    - **"Manage Advisory" Modal:** CTO can update advisory status (`submitted`, `under_review`, `assigned`, `in_progress`, `completed`), assign principal architect/advisor, set advisory fee, and add architecture guidance notes.

11. **Earnings & Performance (`CtoEarningsPage.tsx`):**
    - **Exact Match with Dev & PM Layout:**
      - **Top 4 Metric Cards:** Balance ($9,400.00), Total Earned ($26,800.00), Penalty ($0.00), Spendings ($0.00).
      - **Ledger & Transactions Table:** Filter tabs (`All`, `Payouts`, `Penalties`), transaction descriptions, types, dates, status pills, and amounts.
      - **Performance & Delivery Metrics:** Card below table displaying Overall Quality (98/100, Executive Top Tier), Architecture SLA (100%), Division Velocity (240 pts across 6 squads), and PR Turnaround (3.8 hrs).

12. **Reports (`CtoReportsPage.tsx`):**
    - **Unified Reporting & Escalation Center:**
      - **Tab 1: Incoming PM Escalations:** Lists technical blockers and architecture proposals submitted by PMs. CTO can update status (`pending`, `under_investigation`, `resolved`) or **Forward to C-Level** (modal to select CEO, CFO, or CPO with CTO executive endorsement).
      - **Tab 2: Author Executive Engineering Brief:** Form allowing CTO to submit formal technical briefs to CEO Victoria Sterling-Fox, Board of Directors, CFO, or CPO with category, project selection, architecture spec URL, and executive summary.
      - **Tab 3: CTO Outgoing Briefs Log:** Full history of all executive briefs submitted by the CTO with status tracking and spec document links.

13. **Profile & Settings (`CtoSettingsPage.tsx`):**
    - **Exact Match with Dev & PM Layout:**
      - **Chief Technology Officer Identity (View-Only):** Dr. Arthur Sterling, avatar, role badge (`CTO`), ID (`user_cto_01`), title, email, timezone, and executive committee badge.
      - **Technical Competencies & Domains:** Interactive management of skill tags (System Architecture, Distributed Systems, Microservices, Kubernetes, Rust, TypeScript, Zero-Trust Security, SOC2 Compliance, LLM Ops). CTO can add new domain competencies or remove existing tags with immediate reactive persistence.
      - **Engineering Workspace Preferences:** Enforced default production branch policy, automated quality gate blocking status, and "Reset Demo Data" button.

---

## 7. Data Architecture and State Management

### 7.1 Mock Data Organization (`src/data/`)
All data resides in separate TypeScript modules in `src/data/`, aggregated by [src/data/index.ts](file:///z:/Pointfex/erp/src/data/index.ts):

| File | Primary Model | Key Fields & Relationships |
| :--- | :--- | :--- |
| `users.ts` | `USERS` (34 users) | `id`, `name`, `email`, `role`, `title`, `teamId`, `skills`, `timezone`, `github`, `avatar`, `initials`, `status`. Contains 24 devs across 6 teams, 6 PMs, and 4 C-levels. Default dev: `user_dev_01`, default PM: `user_pm_01`, default CTO: `user_cto_01` (Dr. Arthur Sterling). |
| `teams.ts` | `TEAMS` (6 squads) | `id`, `name`, `code`, `focus`, `pmId`, `leadDevId`, `memberIds` (4 devs), `projectIds` (2 projects), `weeklyVelocity`, `health`. |
| `projects.ts` | `PROJECTS` (12 projects) | `id`, `name`, `code`, `teamId`, `pmId`, `leadDevId`, `repoId`, `progress`, `budget`, `startDate`, `deadline`, `tags`, `assignedDevIds`, `srs` (document title, URL, version, requirements count). |
| `tasks.ts` | `TASKS` (30+ sprint tasks)| `id`, `title`, `description`, `projectId`, `assigneeId`, `creatorId`, `status` (`todo`, `in_progress`, `in_review`, `completed`, `blocked`), `priority` (`urgent`, `high`, `medium`, `low`), `dueDate`, `estimatedHours`, `loggedHours`, `tags`. Includes CEO-assigned tasks to CTO and CTO-assigned tasks to PMs. |
| `comments.ts` | `TASK_COMMENTS` | `id`, `taskId`, `authorId`, `content`, `createdAt`. |
| `attachments.ts` | `TASK_ATTACHMENTS` | `id`, `taskId`, `name`, `size`, `type`, `uploadedById`, `uploadedAt`. |
| `wallets.ts` | `WALLETS` | `userId`, `balance`, `pendingEscrow`, `totalEarnedToDate`, `totalPenalties`, `hourlyRateEquivalent`, `lastPayoutDate`. Includes CTO wallet (`user_cto_01`: $9,400 balance). |
| `transactions.ts`| `TRANSACTIONS` | `id`, `userId`, `projectId`, `milestoneId`, `amount` (+payout / -penalty), `type`, `description`, `date`, `status`, `reason`. |
| `performance.ts` | `PERFORMANCE_RECORDS` | `userId`, `overallScore`, `completionRate`, `onTimeDeliveryRate`, `codeQualityScore`, `peerReviewScore`, `recentRewards`. |
| `reports.ts` | `REPORTS` | `project_submission`, `complaint`, and `cto_report` with status, recipient, feedback, and forward metadata. |
| `milestones.ts` | `MILESTONES` | `id`, `projectId`, `sprintWeek`, `title`, `dueDate`, `status`, `progress`, `payoutAmount`. |
| `repositories.ts`| `REPOSITORIES` (12 repos) | `id`, `projectId`, `name`, `url`, `defaultBranch`, `activeBranch`, `openPRsCount`, `lastCommit`, `stars`, `forks`, `openIssues`. |
| `pullRequests.ts` | `PULL_REQUESTS` (6 PRs) | `id`, `projectId`, `repoId`, `title`, `authorId`, `branch`, `baseBranch`, `status`, `additions`, `deletions`, `qualityScore`. |
| `codeQuality.ts` | `CODE_QUALITY_GATES` (12 gates) | `projectId`, `complianceScore`, `testCoverage`, `techDebtHours`, `bugsDetected`, `codeSmellsCount`, `vulnerabilitiesCount`, `status`. |
| `securityAlerts.ts` | `SECURITY_ALERTS` (4 alerts + 3 bounties) | CVE alerts (`sec_01` to `sec_04`), severity, category, CVE id, remediation; bug bounty disclosures. |
| `testingSuites.ts` | `TESTING_SUITES` (6 suites) | Automated unit, E2E, DAST, contract, chaos, and secret scanner suites with durations and pass rates. |
| `consultancy.ts` | `CONSULTANCY_REQUESTS` (4 requests) | Internal architecture requests from squads with assigned advisor, fee USD, hours, and status. |
| `announcements.ts`| `ANNOUNCEMENTS` | `id`, `title`, `content`, `authorId`, `authorName`, `category`, `priority`, `date`, `read`, `pinned`. |
| `notifications.ts`| `NOTIFICATIONS` | `id`, `userId`, `title`, `message`, `type`, `timestamp`, `read`, `entityType`, `entityId`. |
| `activityLogs.ts` | `ACTIVITY_LOGS` | `id`, `userId`, `action`, `entityType`, `entityId`, `entityTitle`, `description`, `timestamp`, `badgeColor`. |
| `roles.ts` | `ROLES`, `ROLE_LIST` | `id`, `name`, `badge`, `description`, `isImplemented`. (`developer`: true, `pm`: true, `cto`: true). |

### 7.2 Relational Mapping
Entities reference each other strictly via primary keys:
- `Task` references `projectId` (`projects.ts`) and `assigneeId` (`users.ts`).
- `Project` references `teamId` (`teams.ts`), `pmId` (`users.ts`), and `repoId` (`repositories.ts`).
- `Team` references `pmId` (`users.ts`), `memberIds` (`users.ts`), and `projectIds` (`projects.ts`).
- `PullRequest` references `projectId` and `repoId`.
- `CodeQualityGate` and `SecurityAlert` reference `projectId`.
- `Data Resolvers` in `src/data/index.ts` (`createDataResolvers`) provide efficient relational joins across all 12 projects, 6 teams, and 34 users.

### 7.3 State Management & React Context
Global state is managed by `AppProvider` in [src/context/AppContext.tsx](file:///z:/Pointfex\erp\src\context\AppContext.tsx):
- **Core State Variables:**
  - `data`: Complete deep-cloned in-memory data store with all seed models.
  - `currentRole`: Active role string (`'developer'`, `'pm'`, `'cto'`).
  - `currentRoute`: Active navigation route synced to `window.location.hash` and `localStorage` (`pointfex_cto_route`, `pointfex_pm_route`, `pointfex_dev_route`).
  - `theme`: Active color theme (`'light'` or `'dark'`).
  - `isSidebarCollapsed`: Boolean controlling sidebar width.
  - `selectedTaskModal`, `selectedProjectModal`, `isSearchOpen`, `toastMessage`.
- **CTO State Action Handlers:**
  - `createCtoEngineeringTask(taskData)`: Dispatches technical directive to PMs.
  - `reviewCtoTaskSubmission(taskId, approved, feedback)`: Verifies and approves or requests changes on PM deliverables.
  - `updateCtoPersonalTaskStatus(taskId, newStatus)`: Enforces CEO verification guard on `completed`.
  - `updateRepoConfig(projectId, updates)`: Updates repo URL, default branch, SRS docs, and tech tags with audit logging.
  - `reviewPullRequest(prId, newStatus)`: Approves, merges, or requests changes on PRs with audit logging.
  - `createSecurityIssue(issue)`: Logs CVE / security vulnerability and notifies PM.
  - `updateSecurityIssueStatus(issueId, newStatus)`: Transitions security alert status.
  - `updateConsultancyStatus(requestId, updates)`: Manages internal architecture consulting assignments.
  - `submitCtoReport(report)`: Submits executive technical brief to CEO / Board.
  - `updateIncomingReportStatus(reportId, newStatus, feedback, forwardTo)`: Updates PM escalation status or forwards to C-Level.
  - `updateCtoProfile(updatedFields)`: Updates CTO technical competency tags.

---

## 8. Existing Functionality & Interactions

### 8.1 Fully Working Interactive Features
- **Sidebar Navigation:** Clicking any sidebar route switches panels instantly without full-page reloads and syncs with `window.location.hash` and `localStorage`.
- **Role Switcher:** Header dropdown allows seamless switching between Developer (7 panels), PM (9 panels), and CTO (13 panels).
- **Kanban Drag-and-Drop:** Native HTML5 drag-and-drop across all 3 workspaces with role-based permission locks.
- **Permission Enforcements:**
  - Developer cannot mark tasks as `Completed` (PM verification required).
  - PM personal tasks cannot be marked `Completed` directly (C-level verification required).
  - CTO personal directives cannot be marked `Completed` directly (CEO verification & Board sign-off required).
- **Audit Trail Export:** Direct JSON export of company-wide cryptographic audit events.
- **Technical Configuration:** In-memory updates to GitHub repo settings, branches, and SRS links.
- **Pull Request Review Workflow:** Complete inspection, approval, merging, and revision requests.
- **Automated Test Simulation:** CI/CD test suite execution with instant feedback.
- **Escalation & Forwarding Pipeline:** PMs forward developer proposals to CTO; CTO forwards PM escalations to CEO/CFO/CPO with endorsement.
- **Skills Management:** Add and remove skill pills on Developer, PM, and CTO profiles.
- **Demo Data Reset:** Destructive action restoring all data and state to original seed values.

---

## 9. Backend and Integration Status

- **Backend Server:** **None.** No Express, Node, Python, or Go API server is running or connected.
- **Database:** **None.** No PostgreSQL, MongoDB, SQLite, or Firebase integration exists.
- **Authentication:** **Simulated.** No JWT, OAuth, session cookies, or user login screens.
- **Network / API Calls:** **None.** All data transactions take place synchronously in-memory inside `AppContext.tsx`.
- **Third-Party Integrations:** Simulated GitHub repositories and document URLs; no active GitHub Webhooks or REST integrations.

---

## 10. Project Structure & Development Guidelines

### 10.1 Important Files & Responsibilities
- `src/App.tsx`: Main routing logic for Developer, PM, and CTO roles.
- `src/components/layout/Shell.tsx`: Master UI layout holding `Sidebar`, `Header`, `main` content area, modals, and toast pill.
- `src/context/AppContext.tsx`: Single source of truth for all demo data, active role, active route, modals, and state modification handlers.
- `src/hooks/useDeveloperData.ts`: Aggregations for Alex Rivera (Team 1 Developer).
- `src/hooks/usePmData.ts`: Aggregations for Sarah Jenkins (Team 1 PM).
- `src/hooks/useCtoData.ts`: Company-wide aggregations for Dr. Arthur Sterling (CTO, 6 squads, 12 projects, 24 devs, 6 PMs).
- `src/config/navigation.ts`: Defines sidebar menus and icon configurations for each role.
- `src/utils/formatters.ts`: Formatters for currency (`$3,850`), dates (`Nov 4, 2026`), relative deadlines (`2d overdue`), and status pills.

### 10.2 Local Development Commands
```bash
# Start Vite local development server (runs on port 5173)
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Run Oxlint linter check
npm run lint

# Build for production
npm run build
```

---

## 11. Known Issues & Incomplete Work

1. **Non-Implemented Roles:** CPO, CFO, and CEO workspaces currently display `RolePlaceholderPage`. These workspaces are scheduled for Phases 4, 5, and 6.
2. **Session Volatility:** In-memory state changes (newly submitted proposals, grievances, dragged tasks) reset upon hard browser reload unless modified in persistent local storage.

---

## 12. Important Development Decisions to Preserve

1. **Frontend Prototype First:** Continue developing with clean, structured mock data and in-memory state. Do not introduce a backend server, database, or API layer at this stage.
2. **Role Progression:**
   - **Phase 1: Developer Workspace (Complete)**
   - **Phase 2: Project Manager (PM) Workspace (Complete)**
   - **Phase 3: Chief Technology Officer (CTO) Workspace (Complete)**
   - **Phases 4-6: CPO, CFO, CEO Workspaces (Next Targets)**
3. **Preserve Visual Design & Theme:** Retain the soft minimalist aesthetic, rounded-3xl cards, subtle ambient drop shadows, soft pastel stat tiles, lime active navigation pill, and floating header action capsule. **Do not redesign or alter established UI patterns.**
4. **Hierarchical Completion Authority:**
   - Developers cannot self-complete tasks (PM verification required).
   - PMs cannot self-complete operational directives (C-level verification required).
   - CTO cannot self-complete strategic initiatives (CEO sign-off required).
5. **Component Reusability:** Always reuse existing common primitives (`Card`, `Button`, `Badge`, `StatusPill`, `Modal`) when constructing new panels.
5. **Component Reusability:** Always reuse existing common primitives (`Card`, `Button`, `Badge`, `StatusPill`, `Modal`) when constructing new panels.
6. **Progressive Disclosure:** Keep interfaces clean and low-fatigue. Secondary details should always be placed inside drawers, tabs, or modal dialogs rather than cluttering default views.

