# Tight Security ERP — Demo UI

A polished, front-end-only demo of a **Security Workforce Management ERP** built for **Tight Security Ltd.**, a Uganda-based security services company. It showcases the full operational workflow a real ERP would cover — workforce, clients, sites, scheduling, deployment, attendance, leave, billing and reporting — running entirely on realistic mock data, with no backend required.

**Live demo:** [tightsecuritydeck.vercel.app](https://tightsecuritydeck.vercel.app)

---

## What's inside

| Module | What it does |
|---|---|
| **Executive Overview** | Branch-wide KPIs, revenue vs. expenses, attendance trend, leave summary and deployment charts |
| **Workforce & Guards** | Employee/guard master list, profile drawer, search & filters, add-employee form |
| **Clients & Contracts** | Client directory with contract value, account manager and site count |
| **Sites & Posts** | Per-site staffing status (fully staffed / understaffed / overstaffed) |
| **Roster & Scheduling** | List and **calendar** views for shift assignments, with a day-detail drawer |
| **Deployment** | Kanban-style board of guards by deployment status (deployed / standby / vacant / transferred) |
| **Attendance** | Daily attendance log with check-in/out, overtime and status |
| **Leave Management** | Leave requests with approve/reject actions and balances |
| **Billing & Receivables** | Invoices, ageing buckets and collection summaries |
| **Expenses & Procurement** | Expense records and purchase requests |
| **Reports & Analytics** | Cross-module charts (workforce strength, overtime trend, client mix, overdue invoices) |
| **Roles & Approvals** | Role-based access model and approval workflow reference |
| **Settings** | Organisation profile, branches, departments and shift templates |

Every "Add" action opens a real form (pre-filled with sensible dummy data) that updates the in-memory dataset on submit — nothing touches a server, so the whole app is safe to click through freely.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for dev/build tooling
- **Tailwind CSS v4**
- **React Router** for client-side routing
- **Recharts** for charts
- **Lucide React** for icons

No backend, no database, no auth server — all data lives in [`src/lib/mockData.ts`](src/lib/mockData.ts) and is generated deterministically so the demo looks the same on every reload.

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

Other scripts:

```bash
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
npm run lint       # run Oxlint
```

## Project structure

```
src/
├── assets/         # logo and static images
├── components/
│   ├── Layout.tsx  # sidebar, topbar, notifications & profile menus
│   └── ui.tsx       # shared UI kit (cards, tables, modals, form fields, badges…)
├── lib/
│   ├── mockData.ts  # all seed data + generators
│   └── types.ts     # shared TypeScript types
├── pages/           # one file per module/route
├── App.tsx          # route definitions
└── main.tsx         # app entry point
```

## Notes

- This is a **standalone project** — it does not depend on, or share code with, any other repository it may sit alongside.
- Built for client presentation purposes; there is no live data connection or persistence beyond the current browser session.
