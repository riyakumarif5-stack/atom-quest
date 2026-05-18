<div align="center">

<img src="https://img.shields.io/badge/AtomQuest-Hackathon%201.0-22d3ee?style=for-the-badge&labelColor=0d0f1a" />
<img src="https://img.shields.io/badge/React-18-60a5fa?style=for-the-badge&logo=react&logoColor=white&labelColor=0d0f1a" />
<img src="https://img.shields.io/badge/TypeScript-Ready-a78bfa?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0d0f1a" />
<img src="https://img.shields.io/badge/Status-Live-22c55e?style=for-the-badge&labelColor=0d0f1a" />

# 🎯 Goal Tracking Portal
### Enterprise-grade, role-aware performance management — built in-house

**[🚀 View Live Demo](https://7w95p2.csb.app/)** &nbsp;·&nbsp; **[📄 Project Deck](#)** &nbsp;·&nbsp; **[🐛 Report Bug](https://github.com/riyakumarif5-stack/atom-quest/issues)**

</div>

---

## ✨ What is this?

A fully functional **Goal Tracking Portal** built for AtomQuest Hackathon 1.0. It supports three distinct user roles — Employee, Manager, and Admin/HR — each with their own scoped dashboard, workflows, and access controls.

No backend required. Everything runs in the browser.

---

## 🔴 Live Demo

> **[https://7w95p2.csb.app/](https://7w95p2.csb.app/)**

Use the credentials below to explore each persona:

| Role | Email | Password | What you can do |
|------|-------|----------|-----------------|
| 👤 Employee | `priya.sharma@test.com` | `Test@1234` | Create goals, log Q1–Q4 actuals, submit for approval |
| 🧑‍💼 Manager | `manager@test.com` | `Test@1234` | Review team goals, approve / reject, add check-in comments |
| 🛡️ Admin / HR | `admin@test.com` | `Test@1234` | Analytics, CSV export, audit log, override goal status |

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 · TypeScript · CSS-in-JS |
| State & Storage | React `useState` · `localStorage` |
| Auth | Email/password · RBAC role routing |
| Deployment | CodeSandbox Cloud |
| Analytics | Custom heatmaps · QoQ trend charts · Pie/Bar charts |

---

## 🚀 Features

- **3-Role RBAC** — Employee, Manager, Admin with fully scoped dashboards
- **Goal Creation** — Numeric, %, Timeline, Zero-based unit types
- **Weightage Validation** — Enforces 100% total before submission
- **Manager Approval Flow** — Inline approve / reject with reason
- **Goal Locking** — Goals lock post-approval; Admin can override
- **Q1–Q4 Check-ins** — Per-goal, per-quarter actual logging
- **Scoring Engine** — `calcScore()` handles all 4 UoM types (Higher/Lower/Zero/Timeline)
- **Audit Log** — Every action appended and viewable by Admin
- **CSV Export** — Full Planned vs Actual report download (Admin only)
- **Analytics** — Heatmaps, bar charts, pie charts, dept-level breakdowns
- **Dark / Light Theme** — Toggle available across all dashboards

---

## 🗂️ Project Structure

```
src/
└── GoalPortal.jsx      # Single-file React app
    ├── USERS           # Hardcoded user personas
    ├── PREBUILT_GOALS  # Seed goal data
    ├── calcScore()     # Scoring engine (all UoM types)
    ├── EmployeeApp     # Employee dashboard + goal creation
    ├── ManagerApp      # Manager review + approval flow
    ├── AdminApp        # Analytics + audit + CSV export
    └── LoginPage       # Role-based login with auth guard
```

---

## ⚡ Run Locally

```bash
# Clone the repo
git clone https://github.com/riyakumarif5-stack/atom-quest.git
cd atom-quest

# Install dependencies
npm install

# Start the dev server
npm start
```

Then open [http://localhost:3000](http://localhost:3000) and log in with any credential from the table above.

---

## 📸 Screenshots

> _Add screenshots here — one per role is ideal (Employee dashboard, Manager approval, Admin analytics)._
> Drag and drop images directly into this file on GitHub to upload them.

---

## 🏆 Built For

**AtomQuest Hackathon 1.0** — Internal Assessment

---

<div align="center">
  <sub>Built with ❤️ · <a href="https://7w95p2.csb.app/">Live Demo</a></sub>
</div>
