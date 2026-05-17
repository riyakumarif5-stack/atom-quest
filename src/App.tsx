import React, { useState, useEffect, useRef, useCallback } from "react";

// ── PREBUILT DATA ────────────────────────────────────────────────────────────
const PREBUILT_GOALS = [
  // Priya - 2 draft goals for testing
  {
    id: "g1",
    employeeId: "e1",
    managerId: "m1",
    title: "Increase sales pipeline conversion",
    description: "Raise conversion by 12% across key accounts.",
    thrustArea: "Sales",
    uom: "% - Higher is better",
    target: "12",
    weightage: 50,
    status: "Draft",
    sheetStatus: "Draft",
    shared: false,
    createdAt: "2026-06-01",
    updatedAt: "2026-06-10",
  },
  {
    id: "g2",
    employeeId: "e1",
    managerId: "m1",
    title: "Close 8 enterprise deals",
    description: "Secure revenue from enterprise customers.",
    thrustArea: "Sales",
    uom: "Numeric - Higher is better",
    target: "8",
    weightage: 50,
    status: "Draft",
    sheetStatus: "Draft",
    shared: false,
    createdAt: "2026-06-02",
    updatedAt: "2026-06-10",
  },
  // Rahul - 3 approved goals = 100% (full demo)
  {
    id: "g3",
    employeeId: "e2",
    managerId: "m1",
    title: "Reduce process cycle time",
    description: "Decrease order-to-delivery cycle by 20%.",
    thrustArea: "Operations",
    uom: "% - Lower is better",
    target: "20",
    weightage: 40,
    status: "Approved",
    sheetStatus: "Approved",
    shared: false,
    createdAt: "2026-06-04",
    updatedAt: "2026-06-10",
  },
  {
    id: "g4",
    employeeId: "e2",
    managerId: "m1",
    title: "Improve supply chain efficiency",
    description: "Reduce inventory holding cost by 15%.",
    thrustArea: "Operations",
    uom: "% - Lower is better",
    target: "15",
    weightage: 35,
    status: "Approved",
    sheetStatus: "Approved",
    shared: false,
    createdAt: "2026-06-05",
    updatedAt: "2026-06-10",
  },
  {
    id: "g5",
    employeeId: "e2",
    managerId: "m1",
    title: "Team productivity improvement",
    description: "Increase team output per FTE by 18%.",
    thrustArea: "Operations",
    uom: "% - Higher is better",
    target: "18",
    weightage: 25,
    status: "Approved",
    sheetStatus: "Approved",
    shared: false,
    createdAt: "2026-06-06",
    updatedAt: "2026-06-10",
  },
];

const PREBUILT_CHECKINS = [
  // Rahul - g3 (cycle time reduction, target 20%) - 85% avg performance
  { goalId: "g3", q: "Q1", actual: "8", status: "Behind" },
  { goalId: "g3", q: "Q2", actual: "14", status: "On Track" },
  { goalId: "g3", q: "Q3", actual: "18", status: "On Track" },
  { goalId: "g3", q: "Q4", actual: "22", status: "Completed" },
  // Rahul - g4 (inventory cost reduction, target 15%) - 90% avg performance
  { goalId: "g4", q: "Q1", actual: "4", status: "Behind" },
  { goalId: "g4", q: "Q2", actual: "9", status: "On Track" },
  { goalId: "g4", q: "Q3", actual: "14", status: "On Track" },
  { goalId: "g4", q: "Q4", actual: "16", status: "Completed" },
  // Rahul - g5 (team productivity, target 18%) - 92% avg performance
  { goalId: "g5", q: "Q1", actual: "6", status: "Behind" },
  { goalId: "g5", q: "Q2", actual: "12", status: "On Track" },
  { goalId: "g5", q: "Q3", actual: "16", status: "On Track" },
  { goalId: "g5", q: "Q4", actual: "18", status: "Completed" },
];

const PREBUILT_AUDIT_LOG = [
  {
    id: "a1",
    time: "2026-06-10 09:12",
    employee: "Rahul Verma",
    goal: "All Goals",
    field: "Status",
    oldVal: "Draft",
    newVal: "Approved",
    by: "Alex Manager",
  },
];

const PREBUILT_NOTIFICATION_LOG = [
  {
    id: "n1",
    time: "2026-06-10 09:15",
    type: "Teams",
    title: "Goal sheet submitted",
    message: "Rahul Verma submitted his goals for approval.",
  },
  {
    id: "n2",
    time: "2026-06-10 14:33",
    type: "Teams",
    title: "Goals approved",
    message: "Alex Manager approved Rahul Verma's goal sheet (100% weightage).",
  },
];

const PREBUILT_ESCALATION_LOG = [
  {
    id: "e1",
    time: "2026-06-10 18:00",
    type: "ApprovalComplete",
    title: "Goals approved",
    message:
      "Rahul Verma's goal sheet with 100% weightage approved by manager on 2026-06-10.",
  },
];

// ── USERS ────────────────────────────────────────────────────────────────────
const USERS = [
  {
    id: "e1",
    name: "Priya Sharma",
    email: "priya.sharma@test.com",
    password: "Test@1234",
    role: "employee",
    managerId: "m1",
    department: "Sales",
    avatar: "PS",
  },
  {
    id: "e2",
    name: "Rahul Verma",
    email: "rahul.verma@test.com",
    password: "Test@1234",
    role: "employee",
    managerId: "m1",
    department: "Operations",
    avatar: "RV",
  },
  {
    id: "e3",
    name: "Anjali Singh",
    email: "anjali.singh@test.com",
    password: "Test@1234",
    role: "employee",
    managerId: "m1",
    department: "Finance",
    avatar: "AS",
  },
  {
    id: "e4",
    name: "Karan Mehta",
    email: "karan.mehta@test.com",
    password: "Test@1234",
    role: "employee",
    managerId: "m1",
    department: "Technology",
    avatar: "KM",
  },
  {
    id: "e5",
    name: "Sneha Patel",
    email: "sneha.patel@test.com",
    password: "Test@1234",
    role: "employee",
    managerId: "m1",
    department: "HR",
    avatar: "SP",
  },
  {
    id: "m1",
    name: "Alex Manager",
    email: "manager@test.com",
    password: "Test@1234",
    role: "manager",
    department: "Management",
    avatar: "AM",
  },
  {
    id: "a1",
    name: "Admin User",
    email: "admin@test.com",
    password: "Test@1234",
    role: "admin",
    department: "HR",
    avatar: "AU",
  },
];

const THRUST_AREAS = [
  "Sales",
  "Operations",
  "Finance",
  "HR",
  "Technology",
  "Customer Service",
];
const UOM_TYPES = [
  "Numeric - Higher is better",
  "Numeric - Lower is better",
  "% - Higher is better",
  "% - Lower is better",
  "Timeline",
  "Zero-based",
];
const STATUSES = ["Not Started", "On Track", "Completed"];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
const QUARTER_WINDOWS = {
  Q1: "July",
  Q2: "October",
  Q3: "January",
  Q4: "March/April",
};

const DEPT_COLORS = {
  Sales: "#22d3ee",
  Operations: "#60a5fa",
  Finance: "#a78bfa",
  HR: "#34d399",
  Technology: "#f59e0b",
  Management: "#f87171",
  "Customer Service": "#fb7185",
};

function calcScore(uom, target, actual) {
  if (!actual || !target) return 0;
  const t = parseFloat(target),
    a = parseFloat(actual);
  if (isNaN(t) || isNaN(a) || t === 0 || a === 0) return 0;
  if (uom.includes("Higher")) return Math.min(100, Math.round((a / t) * 100));
  if (uom.includes("Lower")) return Math.min(100, Math.round((t / a) * 100));
  if (uom === "Zero-based") return a === 0 ? 100 : 0;
  if (uom === "Timeline")
    return a <= t ? 100 : Math.max(0, Math.round((t / a) * 100));
  return 0;
}

// ── THEME ────────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#100a14",
  card: "#12151f",
  border: "#1e2235",
  text: "#f1f5f9",
  sub: "#64748b",
  muted: "#94a3b8",
  accent: "#22d3ee",
  accentBg: "#22d3ee14",
  green: "#22c55e",
  greenBg: "#22c55e14",
  yellow: "#eab308",
  yellowBg: "#eab30814",
  red: "#ef4444",
  redBg: "#ef444414",
  blue: "#60a5fa",
  blueBg: "#60a5fa14",
  sidebar: "#0d1020",
  input: "#0a0c14",
  glass: "rgba(255,255,255,0.03)",
};
const LIGHT = {
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  text: "#0f172a",
  sub: "#64748b",
  muted: "#94a3b8",
  accent: "#0891b2",
  accentBg: "#0891b218",
  green: "#16a34a",
  greenBg: "#16a34a14",
  yellow: "#ca8a04",
  yellowBg: "#ca8a0414",
  red: "#dc2626",
  redBg: "#dc262614",
  blue: "#2563eb",
  blueBg: "#2563eb14",
  sidebar: "#1e293b",
  input: "#f1f5f9",
  glass: "rgba(255,255,255,0.6)",
};

// ── GLOBAL ANIMATIONS ────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }
  body { margin:0; padding:0; }

  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; } to { opacity:1; }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.3); }
    50%       { box-shadow: 0 0 0 8px rgba(34,211,238,0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes countUp {
    from { opacity:0; transform:scale(0.8); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes slideInRight {
    from { opacity:0; transform:translateX(20px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes dashFill {
    from { stroke-dashoffset: 1000; }
    to   { stroke-dashoffset: 0; }
  }

  .card-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease !important;
  }
  .card-hover:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 40px rgba(0,0,0,0.3) !important;
  }
  .btn-primary-hover {
    transition: all 0.2s ease !important;
  }
  .btn-primary-hover:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 0 20px rgba(34,211,238,0.35) !important;
    opacity: 0.92 !important;
  }
  .btn-primary-hover:active {
    transform: translateY(0) !important;
  }
  .btn-danger-hover:hover {
    box-shadow: 0 0 14px rgba(239,68,68,0.4) !important;
    transform: translateY(-1px) !important;
  }
  .btn-success-hover:hover {
    box-shadow: 0 0 14px rgba(34,197,94,0.4) !important;
    transform: translateY(-1px) !important;
  }
  .nav-item-hover {
    transition: all 0.15s ease !important;
  }
  .nav-item-hover:hover {
    background: rgba(34,211,238,0.1) !important;
    color: #22d3ee !important;
    transform: translateX(2px) !important;
  }
  .emp-card-hover {
    transition: all 0.18s ease !important;
  }
  .emp-card-hover:hover {
    border-color: #22d3ee !important;
    background: rgba(34,211,238,0.06) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important;
  }
  .demo-row-hover {
    transition: all 0.15s ease !important;
  }
  .demo-row-hover:hover {
    background: rgba(34,211,238,0.08) !important;
    border-color: rgba(34,211,238,0.3) !important;
    transform: translateX(3px) !important;
  }
  .stat-card-anim {
    animation: fadeInUp 0.4s ease both;
  }
  .page-anim {
    animation: fadeIn 0.3s ease both;
  }
  .arrow-anim {
    display: inline-block;
    transition: transform 0.2s ease;
  }
  .sign-in-btn:hover .arrow-anim {
    transform: translateX(4px);
  }
  .float-anim {
    animation: float 4s ease-in-out infinite;
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2d3148; border-radius: 3px; }

  .approve-btn {
    transition: all 0.2s !important;
  }
  .approve-btn:hover {
    transform: scale(1.04) !important;
    box-shadow: 0 0 18px rgba(34,197,94,0.45) !important;
  }
  .reject-btn:hover {
    box-shadow: 0 0 14px rgba(239,68,68,0.35) !important;
  }
`;

// ── MINI CHART COMPONENTS ────────────────────────────────────────────────────
function PieChart({ data, size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total)
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#1e2235",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: "#64748b",
        }}
      >
        No data
      </div>
    );
  let offset = 0;
  const cx = size / 2,
    cy = size / 2,
    r = size / 2 - 6;
  const slices = data.map((d) => {
    const pct = d.value / total;
    const angle = pct * 360;
    const start = offset;
    offset += angle;
    const r1 = (start * Math.PI) / 180,
      r2 = ((start + angle) * Math.PI) / 180;
    const x1 = cx + r * Math.sin(r1),
      y1 = cy - r * Math.cos(r1);
    const x2 = cx + r * Math.sin(r2),
      y2 = cy - r * Math.cos(r2);
    const large = angle > 180 ? 1 : 0;
    return {
      path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`,
      color: d.color,
      label: d.label,
      value: d.value,
    };
  });
  return (
    <svg width={size} height={size}>
      <defs>
        {slices.map((s, i) => (
          <radialGradient key={i} id={`pg${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={s.color} stopOpacity="1" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0.7" />
          </radialGradient>
        ))}
      </defs>
      {slices.map((s, i) => (
        <path
          key={i}
          d={s.path}
          fill={`url(#pg${i})`}
          stroke="#0a0c14"
          strokeWidth="1.5"
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.52} fill="#12151f" />
    </svg>
  );
}

function BarChart({ data, height = 100, t }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        height,
        paddingTop: 8,
      }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            animation: `fadeInUp 0.4s ease ${i * 0.08}s both`,
          }}
        >
          <div style={{ fontSize: 10, color: t.muted, fontWeight: 700 }}>
            {d.value}%
          </div>
          <div
            style={{
              width: "100%",
              height: Math.max(4, (d.value / max) * (height - 30)),
              background: `linear-gradient(180deg,${d.color || t.accent},${
                d.color || t.accent
              }99)`,
              borderRadius: "4px 4px 0 0",
              transition: "height 0.5s ease",
              boxShadow: `0 0 8px ${d.color || t.accent}44`,
            }}
          />
          <div
            style={{
              fontSize: 10,
              color: t.sub,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function HeatMap({ rows, quarters, t }) {
  if (!rows.length)
    return (
      <div style={{ color: t.sub }}>No goal progress data available yet.</div>
    );
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `220px repeat(${quarters.length},1fr)`,
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          fontWeight: 700,
          color: t.sub,
        }}
      >
        <div>Goal / Quarter</div>
        {quarters.map((q) => (
          <div key={q} style={{ textAlign: "center" }}>
            {q}
          </div>
        ))}
      </div>
      {rows.map((row) => (
        <div
          key={row.id}
          style={{
            display: "grid",
            gridTemplateColumns: `220px repeat(${quarters.length},1fr)`,
            alignItems: "center",
            gap: 8,
            padding: 12,
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 14,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>
            {row.title}
          </div>
          {quarters.map((q) => {
            const score = row.scores[q] || 0;
            const bg =
              score === 0
                ? t.border
                : score >= 80
                ? "rgba(34,197,94,0.12)"
                : score >= 50
                ? "rgba(245,158,11,0.12)"
                : "rgba(239,68,68,0.12)";
            const color =
              score === 0
                ? t.sub
                : score >= 80
                ? t.green
                : score >= 50
                ? t.yellow
                : t.red;
            return (
              <div
                key={q}
                style={{
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  background: bg,
                  color: color,
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {score ? `${score}%` : "—"}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ProgressRing({ pct, size = 64, color }) {
  const r = size / 2 - 5,
    circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#1e2235"
        strokeWidth={5}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{
          transition: "stroke-dasharray 0.6s ease",
          filter: `drop-shadow(0 0 4px ${color}66)`,
        }}
      />
    </svg>
  );
}

// ── AVATAR ───────────────────────────────────────────────────────────────────
function Avatar({ initials, color = "#ee5f22", size = 32, style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg,${color}33,${color}22)`,
        border: `1.5px solid ${color}66`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        color,
        flexShrink: 0,
        letterSpacing: -0.5,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}

function Toast({ message, type = "success", onClose }) {
  const colors = {
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#2563eb",
  };
  const bg =
    type === "danger"
      ? "rgba(239,68,68,0.14)"
      : type === "warning"
      ? "rgba(245,158,11,0.14)"
      : type === "info"
      ? "rgba(37,99,235,0.14)"
      : "rgba(34,197,94,0.14)";
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        minWidth: 260,
        background: bg,
        border: `1px solid ${colors[type]}33`,
        color: colors[type],
        borderRadius: 14,
        padding: "14px 16px",
        boxShadow: "0 22px 60px rgba(0,0,0,0.18)",
        fontSize: 13,
        animation: "fadeInUp 0.28s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 700 }}>
          {type === "danger"
            ? "Error"
            : type === "warning"
            ? "Warning"
            : type === "info"
            ? "Info"
            : "Success"}
        </div>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "transparent",
            color: colors[type],
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ marginTop: 8, lineHeight: 1.6 }}>{message}</div>
    </div>
  );
}

function ConfirmModal({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,12,20,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 10000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#0f172a",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.08)",
          padding: 24,
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          animation: "fadeInUp 0.25s ease both",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#f8fafc",
            marginBottom: 12,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#cbd5e1",
            lineHeight: 1.8,
            marginBottom: 20,
          }}
        >
          {description}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              ...makeS(DARK).btn("ghost"),
              padding: "10px 14px",
              color: "#94a3b8",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{ ...makeS(DARK).btn("danger"), padding: "10px 14px" }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function BonusFeatureCard({ title, items, t }) {
  return (
    <div
      style={{
        padding: 20,
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 16,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        animation: "fadeInUp 0.25s ease both",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          color: t.text,
          marginBottom: 14,
          fontSize: 15,
        }}
      >
        {title}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {items.map((item) => (
          <div
            key={item.title}
            style={{
              background: t.accentBg,
              border: `1px solid ${t.accent}22`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div
              style={{
                fontSize: 30,
                lineHeight: 1,
                color: item.color || t.accent,
                marginBottom: 8,
              }}
            >
              {item.icon}
            </div>
            <div style={{ fontWeight: 700, color: t.text, marginBottom: 6 }}>
              {item.title}
            </div>
            <div style={{ fontSize: 12, color: t.sub, lineHeight: 1.6 }}>
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (end === 0) {
      setDisplay(0);
      return;
    }
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

// ── MINI DASHBOARD PREVIEW (for login hero) ──────────────────────────────────
function MiniDashboardPreview() {
  const bars = [65, 82, 71, 90];
  const colors = ["#22d3ee", "#60a5fa", "#a78bfa", "#34d399"];
  return (
    <div
      style={{
        background: "rgba(18,21,31,0.9)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(34,211,238,0.2)",
        borderRadius: 16,
        padding: "16px 20px",
        width: 280,
        boxShadow:
          "0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(34,211,238,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: 0.5,
          }}
        >
          Team Progress
        </span>
        <span
          style={{
            fontSize: 10,
            color: "#22d3ee",
            background: "rgba(34,211,238,0.12)",
            padding: "2px 8px",
            borderRadius: 20,
            fontWeight: 600,
          }}
        >
          LIVE
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
          height: 60,
          marginBottom: 10,
        }}
      >
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${(b / 100) * 52}px`,
                background: `linear-gradient(180deg,${colors[i]},${colors[i]}77)`,
                borderRadius: "3px 3px 0 0",
                boxShadow: `0 0 8px ${colors[i]}44`,
              }}
            />
            <div style={{ fontSize: 9, color: "#64748b" }}>Q{i + 1}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {[
          { l: "Goals Set", v: "24", c: "#22d3ee" },
          { l: "Approved", v: "18", c: "#22c55e" },
          { l: "Avg Score", v: "77%", c: "#a78bfa" },
          { l: "On Track", v: "83%", c: "#60a5fa" },
        ].map((k) => (
          <div
            key={k.l}
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              padding: "6px 8px",
            }}
          >
            <div style={{ fontSize: 9, color: "#64748b", marginBottom: 2 }}>
              {k.l}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: k.c }}>
              {k.v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FLOATING KPI CARDS ───────────────────────────────────────────────────────
function FloatingKPI({ icon, label, value, color, delay = 0 }) {
  return (
    <div
      style={{
        background: "rgba(18,21,31,0.85)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${color}33`,
        borderRadius: 12,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        animation: `float 4s ease-in-out ${delay}s infinite`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.3), 0 0 16px ${color}18`,
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: 10, color: "#64748b" }}>{label}</div>
      </div>
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────────
function makeS(t) {
  return {
    app: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Plus Jakarta Sans',sans-serif",
      background: t.bg,
      color: t.text,
    },
    sidebar: {
      width: 240,
      background: t.sidebar,
      display: "flex",
      flexDirection: "column",
      padding: "0 0 16px",
      flexShrink: 0,
      borderRight: `1px solid ${t.border}`,
    },
    logo: {
      padding: "22px 20px 18px",
      fontSize: 16,
      fontWeight: 800,
      color: t.accent,
      letterSpacing: 1,
      borderBottom: `1px solid rgba(255,255,255,0.06)`,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    navItem: (a) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 20px",
      margin: "2px 8px",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 13.5,
      fontWeight: 500,
      background: a ? `${t.accent}1a` : "transparent",
      color: a ? t.accent : "#7a8499",
      borderLeft: a ? `2px solid ${t.accent}` : "2px solid transparent",
    }),
    userBox: {
      marginTop: "auto",
      padding: "16px 20px",
      borderTop: "rgba(255,255,255,0.06) 1px solid",
    },
    main: { flex: 1, padding: "32px 36px", overflowY: "auto", minWidth: 0 },
    pageTitle: {
      fontSize: 22,
      fontWeight: 800,
      color: t.text,
      marginBottom: 4,
      letterSpacing: -0.3,
    },
    pageSub: { fontSize: 13, color: t.sub, marginBottom: 24 },
    card: {
      background: t.card,
      border: `1px solid ${t.border}`,
      borderRadius: 14,
      padding: "20px 24px",
      marginBottom: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
    },
    statGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 14,
      marginBottom: 20,
    },
    statCard: {
      background: t.card,
      border: `1px solid ${t.border}`,
      borderRadius: 14,
      padding: "18px 20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    },
    statLabel: {
      fontSize: 11,
      color: t.sub,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      fontWeight: 600,
    },
    statVal: {
      fontSize: 26,
      fontWeight: 800,
      color: t.accent,
      letterSpacing: -0.5,
    },
    btn: (v = "primary") => ({
      padding: "8px 18px",
      borderRadius: 9,
      border: "none",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
      transition: "all 0.2s ease",
      background:
        v === "primary"
          ? t.accent
          : v === "danger"
          ? t.red
          : v === "success"
          ? t.green
          : v === "ghost"
          ? "transparent"
          : t.border,
      color: v === "ghost" ? t.muted : v === "secondary" ? t.text : "#0a0c14",
    }),
    input: {
      background: t.input,
      border: `1px solid ${t.border}`,
      borderRadius: 9,
      padding: "9px 12px",
      color: t.text,
      fontSize: 14,
      width: "100%",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
      fontFamily: "'Plus Jakarta Sans',sans-serif",
    },
    select: {
      background: t.input,
      border: `1px solid ${t.border}`,
      borderRadius: 9,
      padding: "9px 12px",
      color: t.text,
      fontSize: 14,
      width: "100%",
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "'Plus Jakarta Sans',sans-serif",
    },
    textarea: {
      background: t.input,
      border: `1px solid ${t.border}`,
      borderRadius: 9,
      padding: "9px 12px",
      color: t.text,
      fontSize: 14,
      width: "100%",
      outline: "none",
      resize: "vertical",
      minHeight: 72,
      boxSizing: "border-box",
      fontFamily: "'Plus Jakarta Sans',sans-serif",
    },
    label: {
      fontSize: 12,
      color: t.muted,
      marginBottom: 5,
      display: "block",
      fontWeight: 600,
      letterSpacing: 0.2,
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      padding: "10px 14px",
      textAlign: "left",
      fontSize: 11,
      color: t.sub,
      borderBottom: `1px solid ${t.border}`,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      fontWeight: 700,
    },
    td: {
      padding: "12px 14px",
      fontSize: 13,
      borderBottom: `1px solid ${t.border}22`,
      color: t.muted,
    },
    badge: (c, th) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background:
        c === "green"
          ? th.greenBg
          : c === "yellow"
          ? th.yellowBg
          : c === "red"
          ? th.redBg
          : c === "blue"
          ? th.blueBg
          : c === "cyan"
          ? th.accentBg
          : "rgba(100,116,139,0.1)",
      color:
        c === "green"
          ? th.green
          : c === "yellow"
          ? th.yellow
          : c === "red"
          ? th.red
          : c === "blue"
          ? th.blue
          : c === "cyan"
          ? th.accent
          : th.muted,
    }),
    error: { color: t.red, fontSize: 12, marginTop: 4 },
    success: { color: t.green, fontSize: 12, marginTop: 4 },
    barWrap: {
      height: 5,
      borderRadius: 3,
      background: t.border,
      position: "relative",
      overflow: "hidden",
      width: "100%",
    },
    barFill: (pct, th) => ({
      height: "100%",
      borderRadius: 3,
      width: `${Math.min(100, pct)}%`,
      background: pct >= 80 ? th.green : pct >= 50 ? th.yellow : th.red,
      transition: "width 0.5s ease",
      boxShadow: `0 0 6px ${
        pct >= 80 ? th.green : pct >= 50 ? th.yellow : th.red
      }66`,
    }),
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    tabBar: {
      display: "flex",
      gap: 4,
      marginBottom: 18,
      background: t.input,
      padding: 4,
      borderRadius: 10,
      width: "fit-content",
    },
    tab: (a, th) => ({
      padding: "6px 16px",
      borderRadius: 7,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      border: "none",
      background: a ? th.accent : "transparent",
      color: a ? "#0a0c14" : th.sub,
      transition: "all 0.15s ease",
      fontFamily: "'Plus Jakarta Sans',sans-serif",
    }),
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      padding: "18px 24px",
      borderRadius: 16,
      marginBottom: 24,
      border: `1px solid ${t.border}`,
      background: t.card,
      boxShadow: "0 14px 40px rgba(0,0,0,0.08)",
    },
    profileButton: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      borderRadius: 12,
      border: `1px solid ${t.border}`,
      background: t.input,
      cursor: "pointer",
      fontSize: 13,
      color: t.text,
    },
    profileMenu: {
      position: "absolute",
      top: 52,
      right: 0,
      width: 220,
      background: t.card,
      border: `1px solid ${t.border}`,
      borderRadius: 14,
      boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
      padding: 10,
      zIndex: 20,
    },
    row: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
    divider: { borderTop: `1px solid ${t.border}`, margin: "16px 0" },
    alertBox: (c, th) => ({
      background:
        c === "green" ? th.greenBg : c === "red" ? th.redBg : th.yellowBg,
      border: `1px solid ${
        c === "green" ? th.green : c === "red" ? th.red : th.yellow
      }44`,
      borderRadius: 10,
      padding: "12px 16px",
      marginBottom: 14,
      color: c === "green" ? th.green : c === "red" ? th.red : th.yellow,
      fontSize: 13,
    }),
  };
}

function statusBadge(s, t) {
  const map = {
    Draft: "grey",
    "Pending Approval": "yellow",
    Approved: "green",
    Rejected: "red",
  };
  const dot = {
    Draft: "⬜",
    "Pending Approval": "🟡",
    Approved: "🟢",
    Rejected: "🔴",
  };
  return (
    <span style={makeS(t).badge(map[s] || "grey", t)}>
      {dot[s] || "⬜"} {s}
    </span>
  );
}

// ── SYNC STATUS INDICATOR ─────────────────────────────────────────────────────
function SyncIndicator({ syncing }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        color: syncing ? "#eab308" : "#22c55e",
        padding: "4px 10px",
        background: syncing ? "#eab30812" : "#22c55e12",
        borderRadius: 20,
        border: `1px solid ${syncing ? "#eab30833" : "#22c55e33"}`,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: syncing ? "#eab308" : "#22c55e",
          animation: syncing ? "pulse-glow 1s infinite" : "none",
        }}
      />
      {syncing ? "Syncing…" : "Saved"}
    </div>
  );
}

// ── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin, theme, toggleTheme, showToast }) {
  const t = theme === "dark" ? DARK : LIGHT;
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  function attempt(e, p) {
    setLoading(true);
    setErr("");
    setTimeout(() => {
      const u = USERS.find((u) => u.email === e && u.password === p);
      if (u) {
        showToast(`Welcome back, ${u.name.split(" ")[0]}!`, "success");
        onLogin(u);
      } else {
        setErr("Invalid email or password.");
        showToast("Login failed. Check credentials.", "danger");
        setLoading(false);
      }
    }, 700);
  }

  const demoAccounts = [
    {
      name: "Priya Sharma",
      email: "priya.sharma@test.com",
      role: "Employee",
      color: t.green,
      avatar: "PS",
      dept: "Sales",
    },
    {
      name: "Alex Manager",
      email: "manager@test.com",
      role: "Manager",
      color: t.blue,
      avatar: "AM",
      dept: "Management",
    },
    {
      name: "Admin User",
      email: "admin@test.com",
      role: "Admin",
      color: t.accent,
      avatar: "AU",
      dept: "HR",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        background: t.bg,
      }}
    >
      {/* Left hero panel */}
      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(135deg,#080a12 0%,#0d1220 55%,#0a1628 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glows */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "50%",
            height: "60%",
            background:
              "radial-gradient(ellipse,rgba(34,211,238,0.05) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "5%",
            width: "40%",
            height: "50%",
            background:
              "radial-gradient(ellipse,rgba(96,165,250,0.04) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "30%",
            width: "30%",
            height: "30%",
            background:
              "radial-gradient(ellipse,rgba(167,139,250,0.04) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            animation: "fadeInUp 0.6s ease both",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: t.accent,
              letterSpacing: 3,
              marginBottom: 20,
              textTransform: "uppercase",
              fontWeight: 700,
              border: `1px solid ${t.accent}33`,
              display: "inline-block",
              padding: "5px 14px",
              borderRadius: 20,
              background: `${t.accent}10`,
            }}
          >
            AtomQuest Hackathon 1.0
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: 16,
              letterSpacing: -1.5,
            }}
          >
            Align your
            <br />
            <span
              style={{ color: t.accent, textShadow: `0 0 30px ${t.accent}44` }}
            >
              goals.
            </span>
            <br />
            Track your
            <br />
            <span
              style={{
                color: "#60a5fa",
                textShadow: "0 0 30px rgba(96,165,250,0.3)",
              }}
            >
              growth.
            </span>
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#94a3b8",
              lineHeight: 1.9,
              maxWidth: 360,
              marginBottom: 36,
            }}
          >
            A structured digital portal for goal setting, quarterly check-ins,
            and performance visibility — built for modern organisations.
          </div>
          <div style={{ display: "flex", gap: 20, marginBottom: 48 }}>
            {[
              { icon: "🎯", label: "Goal Tracking" },
              { icon: "📊", label: "Analytics" },
              { icon: "🔒", label: "Audit Ready" },
            ].map((f) => (
              <div
                key={f.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#64748b",
                  fontSize: 13,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "6px 14px",
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          {/* Floating dashboard preview */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ animation: "float 5s ease-in-out infinite" }}>
              <MiniDashboardPreview />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                paddingTop: 20,
              }}
            >
              <div style={{ animation: "float 4s ease-in-out 0.5s infinite" }}>
                <FloatingKPI
                  icon="🎯"
                  label="Goals Set"
                  value="24"
                  color="#22d3ee"
                  delay={0}
                />
              </div>
              <div style={{ animation: "float 4s ease-in-out 1s infinite" }}>
                <FloatingKPI
                  icon="✅"
                  label="Approved"
                  value="18"
                  color="#22c55e"
                  delay={0.5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div
        style={{
          width: 460,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 48px",
          background: theme === "dark" ? "#0d1020" : "#fff",
          borderLeft: `1px solid ${t.border}`,
        }}
      >
        <div
          style={{
            width: "100%",
            animation: "fadeInUp 0.5s ease 0.1s both",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            <button
              onClick={() => setInfoOpen((open) => !open)}
              style={{
                ...makeS(t).btn("ghost"),
                padding: "8px 12px",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              👤 {infoOpen ? "Hide" : "Login"}
            </button>
            {infoOpen && (
              <div
                style={{
                  width: 220,
                  background: t.card,
                  border: `1px solid ${t.border}`,
                  borderRadius: 14,
                  padding: 12,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
                  color: t.text,
                }}
              >
                <div style={{ fontSize: 12, color: t.sub, marginBottom: 8 }}>
                  Quick access
                </div>
                <div style={{ fontSize: 13, marginBottom: 8 }}>
                  Use demo credentials or sign in with your email.
                </div>
                <div style={{ fontSize: 11, color: t.sub }}>
                  Manager: manager@test.com
                </div>
                <div style={{ fontSize: 11, color: t.sub }}>
                  Employee: priya.sharma@test.com
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: t.text,
                  marginBottom: 4,
                  letterSpacing: -0.5,
                }}
              >
                Welcome back
              </div>
              <div style={{ fontSize: 13, color: t.sub }}>
                Sign in to GoalPortal
              </div>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                background: t.input,
                border: `1px solid ${t.border}`,
                borderRadius: 9,
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 18,
                color: t.text,
                transition: "all 0.15s",
              }}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          <label
            style={{
              fontSize: 11,
              color: t.sub,
              fontWeight: 700,
              letterSpacing: 0.8,
              display: "block",
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            Email Address
          </label>
          <input
            style={{
              ...makeS(t).input,
              marginBottom: 14,
              padding: "11px 14px",
              borderRadius: 9,
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@test.com"
            type="email"
            onKeyDown={(e) => e.key === "Enter" && attempt(email, pass)}
            onFocus={(e) => (e.target.style.borderColor = t.accent)}
            onBlur={(e) => (e.target.style.borderColor = t.border)}
          />

          <label
            style={{
              fontSize: 11,
              color: t.sub,
              fontWeight: 700,
              letterSpacing: 0.8,
              display: "block",
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            Password
          </label>
          <input
            style={{
              ...makeS(t).input,
              marginBottom: 6,
              padding: "11px 14px",
              borderRadius: 9,
            }}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
            type="password"
            onKeyDown={(e) => e.key === "Enter" && attempt(email, pass)}
            onFocus={(e) => (e.target.style.borderColor = t.accent)}
            onBlur={(e) => (e.target.style.borderColor = t.border)}
          />

          {err && (
            <div
              style={{
                color: t.red,
                fontSize: 13,
                marginBottom: 12,
                padding: "10px 14px",
                background: t.redBg,
                borderRadius: 9,
                border: `1px solid ${t.red}33`,
                animation: "fadeIn 0.2s ease",
              }}
            >
              ⚠️ {err}
            </div>
          )}

          <button
            disabled={loading}
            className="sign-in-btn btn-primary-hover"
            style={{
              ...makeS(t).btn("primary"),
              width: "100%",
              padding: "13px",
              marginTop: 8,
              fontSize: 14,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: loading ? 0.7 : 1,
              background: `linear-gradient(135deg,${t.accent},${t.accent}dd)`,
            }}
            onClick={() => attempt(email, pass)}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(0,0,0,0.3)",
                    borderTopColor: "#0a0c14",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                  }}
                />{" "}
                Signing in…
              </>
            ) : (
              <>
                {<span>Sign In</span>}
                <span className="arrow-anim">→</span>
              </>
            )}
          </button>

          {/* Demo accounts */}
          <div
            style={{
              marginTop: 24,
              padding: "14px 16px",
              background:
                theme === "dark" ? "rgba(255,255,255,0.02)" : "#f8fafc",
              borderRadius: 12,
              border: `1px solid ${t.border}`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: t.sub,
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontWeight: 700,
              }}
            >
              Demo Accounts
            </div>
            {demoAccounts.map((u) => (
              <div
                key={u.email}
                className="demo-row-hover"
                onClick={() => {
                  setEmail(u.email);
                  setPass("Test@1234");
                }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 10px",
                  borderRadius: 9,
                  cursor: "pointer",
                  marginBottom: 4,
                  border: "1px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar initials={u.avatar} color={u.color} size={30} />
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 700, color: t.text }}
                    >
                      {u.name}
                    </div>
                    <div style={{ fontSize: 11, color: t.sub }}>{u.dept}</div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: `${u.color}18`,
                    color: u.color,
                    fontWeight: 700,
                    border: `1px solid ${u.color}33`,
                  }}
                >
                  {u.role}
                </span>
              </div>
            ))}
            <div
              style={{
                fontSize: 11,
                color: t.sub,
                marginTop: 8,
                textAlign: "center",
                opacity: 0.7,
              }}
            >
              Click to auto-fill · Password: Test@1234
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SHELL ────────────────────────────────────────────────────────────────────
function Shell({
  user,
  onLogout,
  children,
  nav,
  activeNav,
  setActiveNav,
  theme,
  toggleTheme,
  syncing,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const t = theme === "dark" ? DARK : LIGHT;
  const S = makeS(t);
  const deptColor = DEPT_COLORS[user.department] || t.accent;
  return (
    <div style={S.app}>
      <div
        style={{
          ...S.sidebar,
          background: theme === "dark" ? "#080b14" : "#1e293b",
        }}
      >
        <div style={S.logo}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: `linear-gradient(135deg,${t.accent},#60a5fa)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 900,
              color: "#0a0c14",
            }}
          >
            G
          </div>
          <span>GOALPORTAL</span>
        </div>
        <div style={{ padding: "12px 8px", flex: 1 }}>
          {nav.map((n, i) => (
            <div
              key={n.key}
              className="nav-item-hover"
              style={{
                ...S.navItem(activeNav === n.key),
                animationDelay: `${i * 0.05}s`,
              }}
              onClick={() => setActiveNav(n.key)}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
              {n.badge > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    background: t.yellow,
                    color: "#0a0c14",
                    fontSize: 10,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                  }}
                >
                  {n.badge}
                </span>
              )}
            </div>
          ))}
        </div>
        <div style={S.userBox}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <Avatar
              initials={
                user.avatar ||
                user.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
              }
              color={deptColor}
              size={34}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>
                {user.name}
              </div>
              <div style={{ fontSize: 10, color: "#64748b" }}>
                {user.email.split("@")[0]}
              </div>
            </div>
          </div>
          <span
            style={{
              ...S.badge("cyan", t),
              fontSize: 10,
              textTransform: "capitalize",
            }}
          >
            {user.role}
          </span>
          <div style={{ ...S.row, marginTop: 10, gap: 6 }}>
            <button
              onClick={toggleTheme}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 7,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 14,
                color: "#fff",
                flex: 1,
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              style={{
                ...S.btn("ghost"),
                padding: "6px 10px",
                fontSize: 12,
                color: "#ef4444",
              }}
              onClick={onLogout}
            >
              Exit
            </button>
          </div>
          <div style={{ marginTop: 10 }}>
            <SyncIndicator syncing={syncing} />
          </div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={S.header}>
          <div>
            <div
              style={{
                fontSize: 11,
                color: t.sub,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                fontWeight: 700,
              }}
            >
              Enterprise Performance Portal
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: t.text,
                marginTop: 4,
              }}
            >
              Hi {user.name.split(" ")[0]}, stay focused.
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setProfileOpen((open) => !open)}
              style={S.profileButton}
            >
              <span style={{ fontSize: 16 }}>👤</span>
              <span>{user.name.split(" ")[0]}</span>
            </button>
            {profileOpen && (
              <div style={S.profileMenu}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: t.text,
                    marginBottom: 10,
                  }}
                >
                  Account menu
                </div>
                <button
                  onClick={() => {
                    toggleTheme();
                    setProfileOpen(false);
                  }}
                  style={{
                    ...S.btn("ghost"),
                    width: "100%",
                    padding: "10px 12px",
                    textAlign: "left",
                    marginBottom: 8,
                  }}
                >
                  Toggle theme
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  style={{
                    ...S.btn("danger"),
                    width: "100%",
                    padding: "10px 10px",
                    textAlign: "center",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div style={S.main} className="page-anim">
          {children}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// EMPLOYEE
// ════════════════════════════════════════════════════════════════
function EmployeeApp({
  user,
  goals,
  setGoals,
  checkins,
  setCheckins,
  setNotificationLog,
  setEscalationLog,
  onLogout,
  theme,
  toggleTheme,
  syncing,
}) {
  const [page, setPage] = useState("dashboard");
  const t = theme === "dark" ? DARK : LIGHT;
  const S = makeS(t);
  const myGoals = goals.filter((g) => g.employeeId === user.id);
  const approved = myGoals.filter((g) => g.status === "Approved");
  const totalW = myGoals.reduce((s, g) => s + Number(g.weightage || 0), 0);
  const sheetStatus =
    myGoals.length === 0
      ? "Draft"
      : myGoals.every((g) => g.sheetStatus === "Approved")
      ? "Approved"
      : myGoals.some((g) => g.sheetStatus === "Pending Approval")
      ? "Pending Approval"
      : myGoals.some((g) => g.sheetStatus === "Rejected")
      ? "Rejected"
      : "Draft";
  const avgProgress = approved.length
    ? Math.round(
        approved.reduce((s, g) => {
          const acts = QUARTERS.map(
            (q) =>
              checkins.find((c) => c.goalId === g.id && c.q === q)?.actual || ""
          ).filter(Boolean);
          return (
            s +
            (acts.length
              ? calcScore(g.uom, g.target, acts[acts.length - 1])
              : 0)
          );
        }, 0) / approved.length
      )
    : 0;

  const nav = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "goals", icon: "🎯", label: "My Goals" },
    { key: "checkins", icon: "📅", label: "Check-ins" },
    { key: "progress", icon: "📈", label: "My Progress" },
  ];

  return (
    <Shell
      user={user}
      onLogout={onLogout}
      nav={nav}
      activeNav={page}
      setActiveNav={setPage}
      theme={theme}
      toggleTheme={toggleTheme}
      syncing={syncing}
    >
      {page === "dashboard" && (
        <EmpDashboard
          user={user}
          myGoals={myGoals}
          totalW={totalW}
          avgProgress={avgProgress}
          sheetStatus={sheetStatus}
          setPage={setPage}
          checkins={checkins}
          t={t}
          S={S}
        />
      )}
      {page === "goals" && (
        <EmpGoals
          user={user}
          goals={goals}
          setGoals={setGoals}
          myGoals={myGoals}
          totalW={totalW}
          sheetStatus={sheetStatus}
          setNotificationLog={setNotificationLog}
          setEscalationLog={setEscalationLog}
          t={t}
          S={S}
        />
      )}
      {page === "checkins" && (
        <EmpCheckins
          user={user}
          myGoals={myGoals}
          checkins={checkins}
          setCheckins={setCheckins}
          t={t}
          S={S}
        />
      )}
      {page === "progress" && (
        <EmpProgress
          user={user}
          myGoals={myGoals}
          checkins={checkins}
          t={t}
          S={S}
        />
      )}
    </Shell>
  );
}

function EmpDashboard({
  user,
  myGoals,
  totalW,
  avgProgress,
  sheetStatus,
  setPage,
  checkins,
  t,
  S,
}) {
  const approved = myGoals.filter((g) => g.status === "Approved");
  const thrustData = THRUST_AREAS.map((ta, i) => ({
    label: ta.slice(0, 4),
    value: myGoals.filter((g) => g.thrustArea === ta).length,
    color: ["#22d3ee", "#60a5fa", "#a78bfa", "#34d399", "#f59e0b", "#f87171"][
      i
    ],
  })).filter((d) => d.value > 0);

  return (
    <>
      <div
        style={{
          ...S.pageTitle,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Avatar
          initials={user.avatar || "U"}
          color={DEPT_COLORS[user.department] || t.accent}
          size={38}
        />
        Welcome, {user.name.split(" ")[0]}
      </div>
      <div style={S.pageSub}>FY 2026 · Goal Setting & Tracking Portal</div>
      <div style={S.statGrid}>
        {[
          {
            label: "Total Goals",
            val: myGoals.length,
            unit: "/ 8 max",
            color: t.accent,
            delay: "0s",
          },
          {
            label: "Sheet Status",
            custom: (
              <div style={{ marginTop: 6 }}>{statusBadge(sheetStatus, t)}</div>
            ),
            delay: "0.08s",
          },
          {
            label: "Weightage Used",
            val: totalW + "%",
            color: totalW === 100 ? t.green : totalW > 100 ? t.red : t.accent,
            delay: "0.16s",
          },
          {
            label: "Avg Progress",
            custom: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 4,
                }}
              >
                <ProgressRing
                  pct={avgProgress}
                  size={48}
                  color={
                    avgProgress >= 80
                      ? t.green
                      : avgProgress >= 50
                      ? t.yellow
                      : t.red
                  }
                />
                <span
                  style={{ fontSize: 22, fontWeight: 800, color: t.accent }}
                >
                  {avgProgress}%
                </span>
              </div>
            ),
            delay: "0.24s",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="card-hover stat-card-anim"
            style={{ ...S.statCard, animationDelay: s.delay }}
          >
            <div style={S.statLabel}>{s.label}</div>
            {s.custom || (
              <div style={{ ...S.statVal, color: s.color || t.accent }}>
                {s.val}
              </div>
            )}
          </div>
        ))}
      </div>

      {sheetStatus === "Rejected" && (
        <div style={S.alertBox("red", t)}>
          ❌ <strong>Goals Rejected:</strong>{" "}
          {myGoals[0]?.rejectionReason || "Please review and resubmit."}{" "}
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => setPage("goals")}
          >
            Fix now →
          </span>
        </div>
      )}
      {sheetStatus === "Approved" && (
        <div style={S.alertBox("green", t)}>
          ✅ <strong>Goals Approved & Locked!</strong> You can now log quarterly
          achievements in Check-ins.
        </div>
      )}
      {sheetStatus === "Draft" && myGoals.length > 0 && totalW !== 100 && (
        <div style={S.alertBox("yellow", t)}>
          ⚠️ Total weightage is {totalW}%. It must equal 100% before you can
          submit.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Goals by Thrust Area
          </div>
          {thrustData.length ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <PieChart data={thrustData} size={110} />
              <div>
                {thrustData.map((d) => (
                  <div
                    key={d.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: d.color,
                        boxShadow: `0 0 6px ${d.color}66`,
                      }}
                    />
                    <span style={{ fontSize: 12, color: t.muted }}>
                      {d.label} — {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: t.sub, fontSize: 13 }}>No goals added yet</div>
          )}
        </div>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Check-in Completion by Quarter
          </div>
          <BarChart
            t={t}
            data={QUARTERS.map((q, i) => ({
              label: q,
              value: approved.length
                ? Math.round(
                    (approved.filter((g) =>
                      checkins.find(
                        (c) => c.goalId === g.id && c.q === q && c.actual
                      )
                    ).length /
                      approved.length) *
                      100
                  )
                : 0,
              color: ["#22d3ee", "#60a5fa", "#a78bfa", "#34d399"][i],
            }))}
            height={110}
          />
        </div>
      </div>

      <div className="card-hover" style={S.card}>
        <div
          style={{
            ...S.row,
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 700, color: t.text }}>
            My Goals Overview
          </div>
          <button
            className="btn-primary-hover"
            style={S.btn("primary")}
            onClick={() => setPage("goals")}
          >
            Manage Goals →
          </button>
        </div>
        {myGoals.length === 0 ? (
          <div
            style={{
              color: t.sub,
              textAlign: "center",
              padding: 30,
              fontSize: 13,
            }}
          >
            No goals yet.{" "}
            <span
              style={{ color: t.accent, cursor: "pointer" }}
              onClick={() => setPage("goals")}
            >
              Add your first goal →
            </span>
          </div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Goal</th>
                <th style={S.th}>Thrust Area</th>
                <th style={S.th}>Weightage</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {myGoals.map((g) => (
                <tr key={g.id}>
                  <td style={{ ...S.td, fontWeight: 600, color: t.text }}>
                    {g.title}
                    {g.shared && (
                      <span
                        style={{
                          ...makeS(t).badge("cyan", t),
                          marginLeft: 6,
                          fontSize: 10,
                        }}
                      >
                        Shared
                      </span>
                    )}
                  </td>
                  <td style={S.td}>{g.thrustArea}</td>
                  <td style={S.td}>
                    <strong style={{ color: t.accent }}>{g.weightage}%</strong>
                  </td>
                  <td style={S.td}>{statusBadge(g.status, t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function EmpGoals({
  user,
  goals,
  setGoals,
  myGoals,
  totalW,
  sheetStatus,
  t,
  S,
  showToast,
  setNotificationLog,
  setEscalationLog,
}) {
  const locked =
    myGoals.length > 0 && myGoals.every((g) => g.sheetStatus === "Approved");
  const isPending = sheetStatus === "Pending Approval";
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    thrustArea: THRUST_AREAS[0],
    uom: UOM_TYPES[0],
    target: "",
    weightage: "",
  });
  const [errs, setErrs] = useState([]);
  const [msg, setMsg] = useState("");

  function validate() {
    const e = [];
    if (!form.title.trim()) e.push("Goal title is required");
    if (!form.target) e.push("Target value is required");
    const w = Number(form.weightage);
    if (!w || w < 10) e.push("Minimum weightage per goal is 10%");
    if (!editingGoal && myGoals.length >= 8)
      e.push("Maximum 8 goals per employee allowed");
    const currentWeight = editingGoal
      ? totalW - Number(editingGoal.weightage || 0)
      : totalW;
    if (currentWeight + w > 100)
      e.push(
        `Adding ${w}% would make total ${
          currentWeight + w
        }% — must not exceed 100%`
      );
    return e;
  }

  function addGoal() {
    const e = validate();
    if (e.length) {
      setErrs(e);
      return;
    }
    const now = new Date().toISOString();
    if (editingGoal) {
      setGoals(
        goals.map((g) =>
          g.id === editingGoal.id
            ? {
                ...g,
                title: form.title.trim(),
                description: form.description,
                thrustArea: form.thrustArea,
                uom: form.uom,
                target: form.target,
                weightage: Number(form.weightage),
                updatedAt: now,
              }
            : g
        )
      );
      setMsg("Goal updated successfully!");
      showToast("Goal updated successfully.", "success");
      if (setNotificationLog) {
        setNotificationLog((prev) => [
          ...prev,
          {
            id: Date.now() + "",
            time: now,
            type: "Teams",
            title: "Goal updated",
            message: `${user.name} updated a goal.`,
          },
        ]);
      }
    } else {
      const g = {
        id: Date.now() + "",
        employeeId: user.id,
        managerId: user.managerId,
        title: form.title.trim(),
        description: form.description,
        thrustArea: form.thrustArea,
        uom: form.uom,
        target: form.target,
        weightage: Number(form.weightage),
        status: "Draft",
        sheetStatus: "Draft",
        shared: false,
        createdAt: now,
        updatedAt: now,
      };
      setGoals([...goals, g]);
      setMsg("Goal added successfully!");
      showToast("New goal added.", "success");
      if (setNotificationLog) {
        setNotificationLog((prev) => [
          ...prev,
          {
            id: Date.now() + "",
            time: now,
            type: "Email",
            title: "Goal created",
            message: `${user.name} created a new goal.`,
          },
        ]);
      }
      if (setEscalationLog) {
        setEscalationLog((prev) => [
          ...prev,
          {
            id: Date.now() + "",
            time: now,
            type: "SubmissionReminder",
            title: "Goal draft saved",
            message: `${user.name} saved a draft goal. Reminder scheduled if not submitted in 48h.`,
          },
        ]);
      }
    }
    setForm({
      title: "",
      description: "",
      thrustArea: THRUST_AREAS[0],
      uom: UOM_TYPES[0],
      target: "",
      weightage: "",
    });
    setEditingGoal(null);
    setErrs([]);
    setShowForm(false);
    setTimeout(() => setMsg(""), 2500);
  }

  function startEdit(goal) {
    setEditingGoal(goal);
    setForm({
      title: goal.title,
      description: goal.description,
      thrustArea: goal.thrustArea,
      uom: goal.uom,
      target: goal.target,
      weightage: goal.weightage + "",
    });
    setShowForm(true);
    setErrs([]);
  }

  function deleteGoal(id) {
    setDeleteCandidate(id);
  }

  function confirmDelete() {
    if (!deleteCandidate) return;
    setGoals(goals.filter((g) => g.id !== deleteCandidate));
    setMsg("Goal deleted successfully.");
    showToast("Goal deleted.", "warning");
    setDeleteCandidate(null);
    setTimeout(() => setMsg(""), 2500);
  }

  function submitForApproval() {
    if (totalW !== 100) {
      setErrs(["Total weightage must equal exactly 100% before submitting"]);
      return;
    }
    if (myGoals.length === 0) {
      setErrs(["Add at least one goal before submitting"]);
      return;
    }
    const now = new Date().toISOString();
    setGoals(
      goals.map((g) =>
        g.employeeId === user.id
          ? {
              ...g,
              status: "Pending Approval",
              sheetStatus: "Pending Approval",
              updatedAt: now,
            }
          : g
      )
    );
    setMsg("Goals submitted for manager approval! ✅");
    showToast("Goals submitted for approval.", "info");
    if (setNotificationLog) {
      setNotificationLog((prev) => [
        ...prev,
        {
          id: Date.now() + "",
          time: now,
          type: "Email",
          title: "Goal sheet submitted",
          message: `${user.name} submitted their goals for approval.`,
        },
      ]);
    }
    if (setEscalationLog) {
      setEscalationLog((prev) => [
        ...prev,
        {
          id: Date.now() + "",
          time: now,
          type: "ApprovalEscalation",
          title: "Manager approval pending",
          message: `${user.name} submitted goals; escalation timer started for manager approval.`,
        },
      ]);
    }
    setErrs([]);
    setTimeout(() => setMsg(""), 3000);
  }

  const remaining = 100 - totalW;
  const canSubmit =
    totalW === 100 && myGoals.length > 0 && !locked && !isPending;

  return (
    <>
      <div style={S.pageTitle}>My Goals</div>
      <div style={S.pageSub}>FY 2026 · Create and manage your goal sheet</div>
      <div
        className="card-hover"
        style={{
          ...S.card,
          borderColor:
            totalW === 100 ? t.green : totalW > 100 ? t.red : t.border,
        }}
      >
        <div
          style={{ ...S.row, justifyContent: "space-between", marginBottom: 8 }}
        >
          <span style={{ fontWeight: 700, color: t.text }}>
            Weightage Tracker
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: totalW === 100 ? t.green : totalW > 100 ? t.red : t.accent,
            }}
          >
            {totalW}% / 100%
          </span>
        </div>
        <div style={S.barWrap}>
          <div style={S.barFill(totalW, t)} />
        </div>
        <div
          style={{ ...S.row, justifyContent: "space-between", marginTop: 8 }}
        >
          <span style={{ fontSize: 12, color: t.sub }}>
            Used: {totalW}% · Remaining: {Math.max(0, remaining)}% · Goals:{" "}
            {myGoals.length}/8
          </span>
          <span
            style={{
              fontSize: 12,
              color: totalW === 100 ? t.green : totalW > 100 ? t.red : t.yellow,
              fontWeight: 700,
            }}
          >
            {totalW === 100
              ? "✅ Ready to submit!"
              : totalW > 100
              ? "❌ Over limit!"
              : "⚠️ Not yet 100%"}
          </span>
        </div>
      </div>

      {msg && <div style={S.alertBox("green", t)}>{msg}</div>}
      {errs.length > 0 && (
        <div style={S.alertBox("red", t)}>
          {errs.map((e, i) => (
            <div key={i}>• {e}</div>
          ))}
        </div>
      )}

      <div style={{ ...S.row, marginBottom: 14 }}>
        {!locked && (
          <button
            className="btn-primary-hover"
            style={S.btn("primary")}
            onClick={() => {
              setShowForm(!showForm);
              setErrs([]);
            }}
          >
            + Add Goal
          </button>
        )}
        {canSubmit && (
          <button
            className="btn-success-hover"
            style={S.btn("success")}
            onClick={submitForApproval}
          >
            Submit for Approval ✓
          </button>
        )}
        {isPending && (
          <span style={S.badge("yellow", t)}>⏳ Awaiting manager approval</span>
        )}
        {locked && (
          <span style={S.badge("green", t)}>🔒 Goals Approved & Locked</span>
        )}
      </div>

      {showForm && (
        <div
          style={{
            ...S.card,
            borderColor: t.accent,
            marginBottom: 14,
            animation: "fadeInUp 0.25s ease",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: t.accent,
              marginBottom: 14,
              fontSize: 15,
            }}
          >
            {editingGoal ? "Edit Goal" : "Add New Goal"}
          </div>
          <div style={S.formGrid}>
            <div>
              <label style={S.label}>Goal Title *</label>
              <input
                style={S.input}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Increase monthly sales revenue"
              />
            </div>
            <div>
              <label style={S.label}>Thrust Area *</label>
              <select
                style={S.select}
                value={form.thrustArea}
                onChange={(e) =>
                  setForm({ ...form, thrustArea: e.target.value })
                }
              >
                {THRUST_AREAS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={S.label}>Unit of Measurement *</label>
              <select
                style={S.select}
                value={form.uom}
                onChange={(e) => setForm({ ...form, uom: e.target.value })}
              >
                {UOM_TYPES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={S.label}>Target Value *</label>
              <input
                style={S.input}
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <label style={S.label}>
                Weightage % *{" "}
                <span style={{ color: t.sub }}>
                  (min 10%, remaining: {Math.max(0, remaining)}%)
                </span>
              </label>
              <input
                style={{
                  ...S.input,
                  borderColor:
                    Number(form.weightage) < 10 && form.weightage
                      ? t.red
                      : t.border,
                }}
                type="number"
                min={10}
                max={100}
                value={form.weightage}
                onChange={(e) =>
                  setForm({ ...form, weightage: e.target.value })
                }
                placeholder="e.g. 30"
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={S.label}>Description</label>
              <textarea
                style={S.textarea}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe this goal…"
              />
            </div>
          </div>
          <div style={{ ...S.row, marginTop: 14 }}>
            <button
              className="btn-primary-hover"
              style={S.btn("primary")}
              onClick={addGoal}
            >
              {editingGoal ? "Save Changes" : "Save Goal"}
            </button>
            <button
              style={S.btn("secondary")}
              onClick={() => {
                setShowForm(false);
                setErrs([]);
                setEditingGoal(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card-hover" style={S.card}>
        <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
          Goal Sheet
        </div>
        {myGoals.length === 0 ? (
          <div
            style={{
              color: t.sub,
              textAlign: "center",
              padding: 40,
              fontSize: 13,
            }}
          >
            No goals added yet. Click "Add Goal" to begin.
          </div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Goal Title</th>
                <th style={S.th}>Thrust Area</th>
                <th style={S.th}>UoM</th>
                <th style={S.th}>Target</th>
                <th style={S.th}>Weightage</th>
                <th style={S.th}>Status</th>
                {!locked && !isPending && <th style={S.th}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {myGoals.map((g) => (
                <tr key={g.id}>
                  <td style={{ ...S.td, color: t.text, fontWeight: 600 }}>
                    {g.title}
                    {g.shared && (
                      <span
                        style={{
                          ...makeS(t).badge("cyan", t),
                          marginLeft: 6,
                          fontSize: 10,
                        }}
                      >
                        Shared
                      </span>
                    )}
                  </td>
                  <td style={S.td}>{g.thrustArea}</td>
                  <td style={S.td}>{g.uom}</td>
                  <td style={S.td}>{g.target}</td>
                  <td style={S.td}>
                    <strong style={{ color: t.accent }}>{g.weightage}%</strong>
                  </td>
                  <td style={S.td}>{statusBadge(g.status, t)}</td>
                  {!locked && !isPending && (
                    <td style={S.td}>
                      {!g.shared && (
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          <button
                            className="btn-primary-hover"
                            style={{
                              ...S.btn("ghost"),
                              padding: "4px 10px",
                              fontSize: 11,
                            }}
                            onClick={() => startEdit(g)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-danger-hover"
                            style={{
                              ...S.btn("danger"),
                              padding: "4px 10px",
                              fontSize: 11,
                            }}
                            onClick={() => deleteGoal(g.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {deleteCandidate && (
        <ConfirmModal
          title="Delete goal?"
          description="This goal will be removed permanently. Are you sure you want to continue?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteCandidate(null)}
        />
      )}
    </>
  );
}

function EmpCheckins({ user, myGoals, checkins, setCheckins, t, S }) {
  const [activeQ, setActiveQ] = useState("Q1");
  const approved = myGoals.filter((g) => g.status === "Approved");
  function getActual(goalId, q) {
    return checkins.find((c) => c.goalId === goalId && c.q === q)?.actual || "";
  }
  function getStatus(goalId, q) {
    return (
      checkins.find((c) => c.goalId === goalId && c.q === q)?.status ||
      "Not Started"
    );
  }
  function update(goalId, q, field, val) {
    setCheckins((prev) => {
      const ex = prev.find((c) => c.goalId === goalId && c.q === q);
      if (ex)
        return prev.map((c) =>
          c.goalId === goalId && c.q === q ? { ...c, [field]: val } : c
        );
      return [
        ...prev,
        { goalId, q, actual: "", status: "Not Started", [field]: val },
      ];
    });
  }
  return (
    <>
      <div style={S.pageTitle}>Quarterly Check-ins</div>
      <div style={S.pageSub}>
        Log your actual achievements against planned targets
      </div>
      <div
        style={{
          ...S.card,
          background: t.accentBg,
          borderColor: t.accent,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 13, color: t.text }}>
          📅 <strong>Check-in Schedule:</strong> Q1 opens July · Q2 opens
          October · Q3 opens January · Q4 opens March/April
        </div>
      </div>
      <div style={S.tabBar}>
        {QUARTERS.map((q) => (
          <button
            key={q}
            style={S.tab(activeQ === q, t)}
            onClick={() => setActiveQ(q)}
          >
            {q}{" "}
            <span style={{ fontSize: 10, opacity: 0.7 }}>
              ({QUARTER_WINDOWS[q]})
            </span>
          </button>
        ))}
      </div>
      {approved.length === 0 ? (
        <div
          style={{ ...S.card, color: t.sub, textAlign: "center", padding: 40 }}
        >
          Goals must be approved by your manager before you can log check-ins.
        </div>
      ) : (
        <div className="card-hover" style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Goal</th>
                <th style={S.th}>UoM</th>
                <th style={S.th}>Target</th>
                <th style={S.th}>Actual ({activeQ})</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Score</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((g) => {
                const actual = getActual(g.id, activeQ);
                const score = calcScore(g.uom, g.target, actual);
                return (
                  <tr key={g.id}>
                    <td style={{ ...S.td, color: t.text, fontWeight: 600 }}>
                      {g.title}
                    </td>
                    <td style={S.td}>{g.uom}</td>
                    <td style={S.td}>{g.target}</td>
                    <td style={S.td}>
                      <input
                        style={{ ...S.input, width: 110 }}
                        value={actual}
                        onChange={(e) =>
                          update(g.id, activeQ, "actual", e.target.value)
                        }
                        placeholder="Enter actual"
                      />
                    </td>
                    <td style={S.td}>
                      <select
                        style={{ ...S.select, width: 150 }}
                        value={getStatus(g.id, activeQ)}
                        onChange={(e) =>
                          update(g.id, activeQ, "status", e.target.value)
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td style={S.td}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div style={{ ...S.barWrap, width: 70 }}>
                          <div style={S.barFill(score, t)} />
                        </div>
                        <strong
                          style={{
                            color:
                              score >= 80
                                ? t.green
                                : score >= 50
                                ? t.yellow
                                : t.red,
                          }}
                        >
                          {actual ? score + "%" : "—"}
                        </strong>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function EmpProgress({ user, myGoals, checkins, t, S }) {
  const approved = myGoals.filter((g) => g.status === "Approved");
  const qProgress = QUARTERS.map((q, i) => ({
    label: q,
    value: approved.length
      ? Math.round(
          approved.reduce((s, g) => {
            const a =
              checkins.find((c) => c.goalId === g.id && c.q === q)?.actual ||
              "";
            return s + calcScore(g.uom, g.target, a);
          }, 0) / approved.length
        )
      : 0,
    color: ["#22d3ee", "#60a5fa", "#a78bfa", "#34d399"][i],
  }));
  const heatRows = approved.map((g) => ({
    id: g.id,
    title: g.title,
    scores: QUARTERS.reduce((acc, q) => {
      const a =
        checkins.find((c) => c.goalId === g.id && c.q === q)?.actual || "";
      acc[q] = calcScore(g.uom, g.target, a);
      return acc;
    }, {}),
  }));
  return (
    <>
      <div style={S.pageTitle}>My Progress</div>
      <div style={S.pageSub}>Visual overview of your goal achievement</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Quarter-on-Quarter Progress
          </div>
          <BarChart data={qProgress} height={130} t={t} />
        </div>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Goals by Status
          </div>
          <PieChart
            size={130}
            data={[
              {
                label: "Approved",
                value: myGoals.filter((g) => g.status === "Approved").length,
                color: t.green,
              },
              {
                label: "Pending",
                value: myGoals.filter((g) => g.status === "Pending Approval")
                  .length,
                color: t.yellow,
              },
              {
                label: "Draft",
                value: myGoals.filter((g) => g.status === "Draft").length,
                color: t.muted,
              },
              {
                label: "Rejected",
                value: myGoals.filter((g) => g.status === "Rejected").length,
                color: t.red,
              },
            ].filter((d) => d.value > 0)}
          />
        </div>
      </div>
      <div className="card-hover" style={S.card}>
        <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
          Goal-wise Progress Breakdown
        </div>
        {approved.length === 0 ? (
          <div style={{ color: t.sub }}>No approved goals yet.</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Goal</th>
                <th style={S.th}>Target</th>
                {QUARTERS.map((q) => (
                  <th key={q} style={S.th}>
                    {q} Score
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {approved.map((g) => (
                <tr key={g.id}>
                  <td style={{ ...S.td, color: t.text, fontWeight: 600 }}>
                    {g.title}
                  </td>
                  <td style={S.td}>{g.target}</td>
                  {QUARTERS.map((q) => {
                    const a =
                      checkins.find((c) => c.goalId === g.id && c.q === q)
                        ?.actual || "";
                    const score = calcScore(g.uom, g.target, a);
                    return (
                      <td key={q} style={S.td}>
                        <strong
                          style={{
                            color: a
                              ? score >= 80
                                ? t.green
                                : score >= 50
                                ? t.yellow
                                : t.red
                              : t.sub,
                          }}
                        >
                          {a ? score + "%" : "—"}
                        </strong>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="card-hover" style={{ ...S.card, marginTop: 16 }}>
        <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
          Progress Heat Map
        </div>
        <HeatMap rows={heatRows} quarters={QUARTERS} t={t} />
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// MANAGER — REDESIGNED DASHBOARD
// ════════════════════════════════════════════════════════════════
function ManagerApp({
  user,
  goals,
  setGoals,
  checkins,
  setCheckins,
  auditLog,
  setAuditLog,
  notificationLog,
  setNotificationLog,
  escalationLog,
  setEscalationLog,
  onLogout,
  theme,
  toggleTheme,
  syncing,
}) {
  const [page, setPage] = useState("dashboard");
  const t = theme === "dark" ? DARK : LIGHT;
  const S = makeS(t);
  const myTeam = USERS.filter((u) => u.managerId === user.id);
  const teamGoals = goals.filter((g) =>
    myTeam.some((u) => u.id === g.employeeId)
  );
  const pendingEmpIds = [
    ...new Set(
      teamGoals
        .filter((g) => g.sheetStatus === "Pending Approval")
        .map((g) => g.employeeId)
    ),
  ];
  const approvedEmpIds = [
    ...new Set(
      teamGoals
        .filter((g) => g.sheetStatus === "Approved")
        .map((g) => g.employeeId)
    ),
  ];

  const nav = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    {
      key: "teamgoals",
      icon: "👥",
      label: "Team Goals",
      badge: pendingEmpIds.length,
    },
    { key: "checkins", icon: "📅", label: "Check-ins" },
    {
      key: "notifications",
      icon: "📩",
      label: "Alerts",
      badge: notificationLog?.length || 0,
    },
    {
      key: "escalations",
      icon: "⚠️",
      label: "Escalations",
      badge: escalationLog?.length || 0,
    },
    { key: "analytics", icon: "📈", label: "Analytics" },
  ];

  return (
    <Shell
      user={user}
      onLogout={onLogout}
      nav={nav}
      activeNav={page}
      setActiveNav={setPage}
      theme={theme}
      toggleTheme={toggleTheme}
      syncing={syncing}
    >
      {page === "dashboard" && (
        <MgrDashboard
          user={user}
          goals={goals}
          setGoals={setGoals}
          myTeam={myTeam}
          teamGoals={teamGoals}
          pendingEmpIds={pendingEmpIds}
          approvedEmpIds={approvedEmpIds}
          checkins={checkins}
          auditLog={auditLog}
          setAuditLog={setAuditLog}
          notificationLog={notificationLog}
          setNotificationLog={setNotificationLog}
          escalationLog={escalationLog}
          setEscalationLog={setEscalationLog}
          setPage={setPage}
          t={t}
          S={S}
        />
      )}
      {page === "teamgoals" && (
        <MgrTeamGoals
          user={user}
          goals={goals}
          setGoals={setGoals}
          myTeam={myTeam}
          auditLog={auditLog}
          setAuditLog={setAuditLog}
          setNotificationLog={setNotificationLog}
          setEscalationLog={setEscalationLog}
          t={t}
          S={S}
        />
      )}
      {page === "checkins" && (
        <MgrCheckins
          user={user}
          goals={goals}
          myTeam={myTeam}
          checkins={checkins}
          setCheckins={setCheckins}
          t={t}
          S={S}
        />
      )}
      {page === "notifications" && (
        <MgrNotifications notificationLog={notificationLog} t={t} S={S} />
      )}
      {page === "escalations" && (
        <MgrEscalations escalationLog={escalationLog} t={t} S={S} />
      )}
      {page === "analytics" && (
        <MgrAnalytics
          goals={goals}
          myTeam={myTeam}
          checkins={checkins}
          t={t}
          S={S}
        />
      )}
    </Shell>
  );
}

// ── MANAGER DASHBOARD — interactive employee cards with inline approve ─────────
function MgrDashboard({
  user,
  goals,
  setGoals,
  myTeam,
  teamGoals,
  pendingEmpIds,
  approvedEmpIds,
  checkins,
  auditLog,
  setAuditLog,
  notificationLog,
  setNotificationLog,
  escalationLog,
  setEscalationLog,
  setPage,
  t,
  S,
}) {
  const [expandedEmp, setExpandedEmp] = useState(null);
  const [rejectEmpId, setRejectEmpId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [flash, setFlash] = useState("");
  const [showEnterprise, setShowEnterprise] = useState(false);

  function empGoals(id) {
    return goals.filter((g) => g.employeeId === id);
  }
  function ss(id) {
    return empGoals(id)[0]?.sheetStatus || "Draft";
  }

  function approveInline(empId) {
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((g) =>
        g.employeeId === empId
          ? {
              ...g,
              status: "Approved",
              sheetStatus: "Approved",
              updatedAt: now,
            }
          : g
      )
    );
    setAuditLog((al) => [
      ...al,
      {
        id: Date.now() + "",
        time: new Date().toLocaleString(),
        employee: USERS.find((u) => u.id === empId)?.name,
        goal: "All Goals",
        field: "Status",
        oldVal: "Pending Approval",
        newVal: "Approved",
        by: user.name,
      },
    ]);
    if (setNotificationLog) {
      setNotificationLog((prev) => [
        ...prev,
        {
          id: Date.now() + "",
          time: now,
          type: "Teams",
          title: "Goals approved",
          message: `${user.name} approved ${
            USERS.find((u) => u.id === empId)?.name
          }'s goals.`,
        },
      ]);
    }
    setFlash(
      `✅ Goals approved for ${
        USERS.find((u) => u.id === empId)?.name.split(" ")[0]
      }!`
    );
    setExpandedEmp(null);
    setTimeout(() => setFlash(""), 3000);
  }
  function rejectInline(empId) {
    if (!rejectReason.trim()) return;
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((g) =>
        g.employeeId === empId
          ? {
              ...g,
              status: "Rejected",
              sheetStatus: "Rejected",
              rejectionReason: rejectReason,
              updatedAt: now,
            }
          : g
      )
    );
    setRejectEmpId(null);
    setRejectReason("");
    setExpandedEmp(null);
    if (setNotificationLog) {
      setNotificationLog((prev) => [
        ...prev,
        {
          id: Date.now() + "",
          time: now,
          type: "Email",
          title: "Goals rejected",
          message: `${user.name} rejected ${
            USERS.find((u) => u.id === empId)?.name
          }'s goals.`,
        },
      ]);
    }
    setFlash("Goals sent back for revision.");
    setTimeout(() => setFlash(""), 3000);
  }

  const teamAvgScore = (() => {
    let total = 0,
      count = 0;
    myTeam.forEach((emp) => {
      const ag = goals.filter(
        (g) => g.employeeId === emp.id && g.status === "Approved"
      );
      if (!ag.length) return;
      ag.forEach((g) => {
        const acts = QUARTERS.map(
          (q) =>
            checkins.find((c) => c.goalId === g.id && c.q === q)?.actual || ""
        ).filter(Boolean);
        if (acts.length) {
          total += calcScore(g.uom, g.target, acts[acts.length - 1]);
          count++;
        }
      });
    });
    return count ? Math.round(total / count) : 0;
  })();

  const azureConnected = false;
  const notificationCount = notificationLog?.length || 0;
  const escalationCandidates = myTeam.filter((emp) => {
    const empGoals = goals.filter((g) => g.employeeId === emp.id);
    return (
      !empGoals.length ||
      empGoals.some((g) => g.sheetStatus === "Pending Approval")
    );
  }).length;
  return (
    <>
      <div style={S.pageTitle}>Manager Dashboard</div>
      <div style={S.pageSub}>FY 2026 · {user.name}'s team overview</div>

      {flash && (
        <div
          style={{
            ...S.alertBox(flash.startsWith("✅") ? "green" : "yellow", t),
            animation: "fadeInUp 0.2s ease",
          }}
        >
          {flash}
        </div>
      )}

      <div className="card-hover" style={S.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 700, color: t.text }}>
            Enterprise Bonus Modules
          </div>
          <button
            className="btn-primary-hover"
            style={S.btn("primary")}
            onClick={() => setShowEnterprise(true)}
          >
            Open
          </button>
        </div>
        <div style={{ fontSize: 12, color: t.sub, marginTop: 8 }}>
          Manage notifications, escalations and integrations from here.
        </div>
      </div>

      {showEnterprise && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,12,20,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10010,
          }}
          onClick={() => setShowEnterprise(false)}
        >
          <div
            style={{
              width: "min(980px,95%)",
              maxHeight: "90vh",
              overflow: "auto",
              padding: 20,
              borderRadius: 12,
              background: t.card,
              border: `1px solid ${t.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 800, color: t.text }}>
                Enterprise Modules
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={S.btn("secondary")}
                  onClick={() => {
                    setPage("notifications");
                    setShowEnterprise(false);
                  }}
                >
                  Open Alerts
                </button>
                <button
                  style={S.btn("secondary")}
                  onClick={() => {
                    setPage("escalations");
                    setShowEnterprise(false);
                  }}
                >
                  Open Escalations
                </button>
                <button
                  style={S.btn("danger")}
                  onClick={() => setShowEnterprise(false)}
                >
                  Close
                </button>
              </div>
            </div>
            <BonusFeatureCard
              title="Enterprise bonus modules"
              t={t}
              items={[
                {
                  icon: "🛡️",
                  title: "Azure AD / Entra",
                  description: azureConnected
                    ? "Connected using configured SSO project"
                    : "Local auth fallback; static data mode enabled.",
                  color: t.blue,
                },
                {
                  icon: "✉️",
                  title: "Email & Teams",
                  description: `${notificationCount} alert${
                    notificationCount !== 1 ? "s" : ""
                  } generated from goal lifecycle events.`,
                  color: t.green,
                },
                {
                  icon: "⚠️",
                  title: "Escalation Rules",
                  description: `${escalationCandidates} team member${
                    escalationCandidates !== 1 ? "s" : ""
                  } need follow-up or approval action.`,
                  color: t.yellow,
                },
                {
                  icon: "📈",
                  title: "Analytics",
                  description: `Tracking ${teamGoals.length} team goals and ${checkins.length} check-ins for performance insights.`,
                  color: t.accent,
                },
              ]}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={S.statGrid}>
        {[
          {
            label: "Team Size",
            val: myTeam.length,
            color: t.accent,
            icon: "👥",
          },
          {
            label: "Pending Approvals",
            val: pendingEmpIds.length,
            color: pendingEmpIds.length > 0 ? t.yellow : t.green,
            icon: "⏳",
          },
          {
            label: "Approved Sheets",
            val: approvedEmpIds.length,
            color: t.green,
            icon: "✅",
          },
          {
            label: "Avg Team Score",
            val: teamAvgScore + "%",
            color:
              teamAvgScore >= 80
                ? t.green
                : teamAvgScore >= 50
                ? t.yellow
                : t.red,
            icon: "📈",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="card-hover stat-card-anim"
            style={{ ...S.statCard, animationDelay: `${i * 0.08}s` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={S.statLabel}>{s.label}</div>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ ...S.statVal, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Pending approvals banner */}
      {pendingEmpIds.length > 0 && (
        <div
          style={{
            ...S.card,
            borderColor: t.yellow,
            background: t.yellowBg,
            padding: "14px 20px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <div style={{ fontWeight: 700, color: t.yellow, fontSize: 14 }}>
                Action Required
              </div>
              <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>
                {pendingEmpIds.length} employee goal sheet
                {pendingEmpIds.length > 1 ? "s" : ""} awaiting your approval
              </div>
            </div>
          </div>
          <button
            className="btn-primary-hover"
            style={{ ...S.btn("primary"), background: t.yellow }}
            onClick={() => setPage("teamgoals")}
          >
            Review Now →
          </button>
        </div>
      )}

      {/* MAIN: Employee cards — interactive with inline approve */}
      <div
        style={{
          fontWeight: 700,
          color: t.text,
          marginBottom: 12,
          fontSize: 15,
        }}
      >
        Team Members
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {myTeam.map((emp, i) => {
          const s = ss(emp.id);
          const egs = empGoals(emp.id);
          const totalW = egs.reduce(
            (sum, g) => sum + Number(g.weightage || 0),
            0
          );
          const isPending = s === "Pending Approval";
          const isApproved = s === "Approved";
          const deptColor = DEPT_COLORS[emp.department] || t.accent;
          const isExpanded = expandedEmp === emp.id;
          const avgScore = (() => {
            const ag = egs.filter((g) => g.status === "Approved");
            if (!ag.length) return null;
            let tot = 0,
              cnt = 0;
            ag.forEach((g) => {
              const acts = QUARTERS.map(
                (q) =>
                  checkins.find((c) => c.goalId === g.id && c.q === q)
                    ?.actual || ""
              ).filter(Boolean);
              if (acts.length) {
                tot += calcScore(g.uom, g.target, acts[acts.length - 1]);
                cnt++;
              }
            });
            return cnt ? Math.round(tot / cnt) : null;
          })();

          return (
            <div
              key={emp.id}
              className="emp-card-hover"
              style={{
                ...S.card,
                marginBottom: 0,
                cursor: "pointer",
                borderColor: isExpanded
                  ? t.accent
                  : isPending
                  ? `${t.yellow}66`
                  : t.border,
                background: isExpanded ? `${t.accent}08` : t.card,
                transition: "all 0.2s ease",
              }}
              onClick={() => setExpandedEmp(isExpanded ? null : emp.id)}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <Avatar
                  initials={emp.avatar || emp.name[0]}
                  color={deptColor}
                  size={40}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: t.text, fontSize: 14 }}>
                    {emp.name}
                  </div>
                  <div style={{ fontSize: 11, color: t.sub }}>
                    {emp.department}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
                  {statusBadge(s, t)}
                  {avgScore !== null && (
                    <span
                      style={{
                        fontSize: 11,
                        color:
                          avgScore >= 80
                            ? t.green
                            : avgScore >= 50
                            ? t.yellow
                            : t.red,
                        fontWeight: 700,
                      }}
                    >
                      {avgScore}% avg
                    </span>
                  )}
                </div>
              </div>

              {/* Goal count & weightage */}
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <div
                  style={{
                    flex: 1,
                    background: `${deptColor}12`,
                    borderRadius: 8,
                    padding: "6px 10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 18, fontWeight: 800, color: deptColor }}
                  >
                    {egs.length}
                  </div>
                  <div style={{ fontSize: 10, color: t.sub }}>Goals</div>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: `${totalW === 100 ? t.green : t.yellow}12`,
                    borderRadius: 8,
                    padding: "6px 10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: totalW === 100 ? t.green : t.yellow,
                    }}
                  >
                    {totalW}%
                  </div>
                  <div style={{ fontSize: 10, color: t.sub }}>Weightage</div>
                </div>
                {avgScore !== null && (
                  <div
                    style={{
                      flex: 1,
                      background: `${
                        avgScore >= 80
                          ? t.green
                          : avgScore >= 50
                          ? t.yellow
                          : t.red
                      }12`,
                      borderRadius: 8,
                      padding: "6px 10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color:
                          avgScore >= 80
                            ? t.green
                            : avgScore >= 50
                            ? t.yellow
                            : t.red,
                      }}
                    >
                      {avgScore}%
                    </div>
                    <div style={{ fontSize: 10, color: t.sub }}>Score</div>
                  </div>
                )}
              </div>

              {/* Expand indicator */}
              <div style={{ textAlign: "center", fontSize: 11, color: t.sub }}>
                {isExpanded ? "▲ Hide details" : "▼ View goals & actions"}
              </div>

              {/* EXPANDED: goal list + approve buttons */}
              {isExpanded && (
                <div
                  style={{ marginTop: 14, animation: "fadeInUp 0.2s ease" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={S.divider} />
                  {egs.length === 0 ? (
                    <div
                      style={{
                        color: t.sub,
                        fontSize: 13,
                        textAlign: "center",
                        padding: "10px 0",
                      }}
                    >
                      No goals submitted yet
                    </div>
                  ) : (
                    <table style={{ ...S.table, marginBottom: 12 }}>
                      <thead>
                        <tr>
                          <th style={S.th}>Goal</th>
                          <th style={S.th}>W%</th>
                          <th style={S.th}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {egs.map((g) => (
                          <tr key={g.id}>
                            <td
                              style={{
                                ...S.td,
                                color: t.text,
                                fontWeight: 600,
                                fontSize: 12,
                              }}
                            >
                              {g.title}
                            </td>
                            <td
                              style={{
                                ...S.td,
                                color: t.accent,
                                fontWeight: 700,
                              }}
                            >
                              {g.weightage}%
                            </td>
                            <td style={S.td}>{statusBadge(g.status, t)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {isPending &&
                    (rejectEmpId === emp.id ? (
                      <div style={{ animation: "fadeIn 0.2s ease" }}>
                        <textarea
                          style={{
                            ...S.textarea,
                            marginBottom: 8,
                            minHeight: 56,
                          }}
                          placeholder="Reason for rejection…"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div style={S.row}>
                          <button
                            className="btn-danger-hover"
                            style={S.btn("danger")}
                            onClick={() => rejectInline(emp.id)}
                          >
                            Confirm Reject
                          </button>
                          <button
                            style={S.btn("secondary")}
                            onClick={() => {
                              setRejectEmpId(null);
                              setRejectReason("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={S.row}>
                        <button
                          className="approve-btn btn-success-hover"
                          style={{
                            ...S.btn("success"),
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                          onClick={() => approveInline(emp.id)}
                        >
                          ✓ Approve Goals
                        </button>
                        <button
                          className="reject-btn btn-danger-hover"
                          style={{
                            ...S.btn("danger"),
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                          onClick={() => setRejectEmpId(emp.id)}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    ))}
                  {isApproved && (
                    <div
                      style={{
                        ...S.alertBox("green", t),
                        marginBottom: 0,
                        textAlign: "center",
                        fontSize: 12,
                      }}
                    >
                      ✅ Goals approved and locked
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mini analytics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Submission Status
          </div>
          <PieChart
            size={110}
            data={[
              {
                label: "Approved",
                value: approvedEmpIds.length,
                color: t.green,
              },
              {
                label: "Pending",
                value: pendingEmpIds.length,
                color: t.yellow,
              },
              {
                label: "Not Submitted",
                value:
                  myTeam.length - approvedEmpIds.length - pendingEmpIds.length,
                color: t.muted,
              },
            ].filter((d) => d.value > 0)}
          />
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {[
              { l: "Approved", v: approvedEmpIds.length, c: t.green },
              { l: "Pending", v: pendingEmpIds.length, c: t.yellow },
              {
                l: "Draft",
                v: myTeam.length - approvedEmpIds.length - pendingEmpIds.length,
                c: t.muted,
              },
            ].map((x) => (
              <div
                key={x.l}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 2,
                    background: x.c,
                  }}
                />
                <span style={{ fontSize: 11, color: t.sub }}>
                  {x.l}: {x.v}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Team Score by Member
          </div>
          <BarChart
            height={130}
            t={t}
            data={myTeam.map((emp, i) => {
              const ag = goals.filter(
                (g) => g.employeeId === emp.id && g.status === "Approved"
              );
              if (!ag.length)
                return {
                  label: emp.name.split(" ")[0],
                  value: 0,
                  color: [
                    "#22d3ee",
                    "#60a5fa",
                    "#a78bfa",
                    "#34d399",
                    "#f59e0b",
                  ][i % 5],
                };
              let tot = 0,
                cnt = 0;
              ag.forEach((g) => {
                const acts = QUARTERS.map(
                  (q) =>
                    checkins.find((c) => c.goalId === g.id && c.q === q)
                      ?.actual || ""
                ).filter(Boolean);
                if (acts.length) {
                  tot += calcScore(g.uom, g.target, acts[acts.length - 1]);
                  cnt++;
                }
              });
              return {
                label: emp.name.split(" ")[0],
                value: cnt ? Math.round(tot / cnt) : 0,
                color: ["#22d3ee", "#60a5fa", "#a78bfa", "#34d399", "#f59e0b"][
                  i % 5
                ],
              };
            })}
          />
        </div>
      </div>
    </>
  );
}

function MgrNotifications({ notificationLog, t, S }) {
  return (
    <>
      <div style={S.pageTitle}>Alerts & Notifications</div>
      <div style={S.pageSub}>
        Generated lifecycle alerts for goal submissions, approvals, and
        escalations.
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {notificationLog.length === 0 ? (
          <div style={{ ...S.card, color: t.sub }}>
            No alerts generated yet. Actions like goal submission, approval and
            rejection will create notifications here.
          </div>
        ) : (
          notificationLog
            .slice(-20)
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                style={{
                  ...S.card,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: t.text }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 13, color: t.sub, marginTop: 6 }}>
                    {item.message}
                  </div>
                  <div style={{ fontSize: 11, color: t.muted, marginTop: 8 }}>
                    {new Date(item.time).toLocaleString()} · {item.type}
                  </div>
                </div>
                <div
                  style={{
                    ...S.badge(item.type === "Teams" ? "green" : "blue", t),
                    padding: "8px 12px",
                  }}
                >
                  {item.type}
                </div>
              </div>
            ))
        )}
      </div>
    </>
  );
}

function MgrEscalations({ escalationLog, t, S }) {
  return (
    <>
      <div style={S.pageTitle}>Escalation Log</div>
      <div style={S.pageSub}>
        Follow-up items and escalation actions generated by the system.
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {escalationLog.length === 0 ? (
          <div style={{ ...S.card, color: t.sub }}>
            No escalations yet. The module logs reminders, submission
            follow-ups, and revision requests.
          </div>
        ) : (
          escalationLog
            .slice(-20)
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                style={{
                  ...S.card,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: t.text }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 13, color: t.sub, marginTop: 6 }}>
                    {item.message}
                  </div>
                  <div style={{ fontSize: 11, color: t.muted, marginTop: 8 }}>
                    {new Date(item.time).toLocaleString()} · {item.type}
                  </div>
                </div>
                <div style={{ ...S.badge("yellow", t), padding: "8px 12px" }}>
                  {item.type}
                </div>
              </div>
            ))
        )}
      </div>
    </>
  );
}

function MgrTeamGoals({
  user,
  goals,
  setGoals,
  myTeam,
  auditLog,
  setAuditLog,
  setNotificationLog,
  setEscalationLog,
  t,
  S,
}) {
  const [selEmp, setSelEmp] = useState(myTeam[0]?.id || null);
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  function empGoals(id) {
    return goals.filter((g) => g.employeeId === id);
  }
  function ss(id) {
    return empGoals(id)[0]?.sheetStatus || "Draft";
  }

  function approve(empId) {
    const now = new Date().toISOString();
    setGoals(
      goals.map((g) =>
        g.employeeId === empId
          ? {
              ...g,
              status: "Approved",
              sheetStatus: "Approved",
              updatedAt: now,
            }
          : g
      )
    );
    setAuditLog((al) => [
      ...al,
      {
        id: Date.now() + "",
        time: new Date().toLocaleString(),
        employee: USERS.find((u) => u.id === empId)?.name,
        goal: "All Goals",
        field: "Status",
        oldVal: "Pending Approval",
        newVal: "Approved",
        by: user.name,
      },
    ]);
    if (setNotificationLog) {
      setNotificationLog((prev) => [
        ...prev,
        {
          id: Date.now() + "",
          time: now,
          type: "Teams",
          title: "Goals approved",
          message: `${user.name} approved ${
            USERS.find((u) => u.id === empId)?.name
          }'s goals.`,
        },
      ]);
    }
    if (setEscalationLog) {
      setEscalationLog((prev) => [
        ...prev,
        {
          id: Date.now() + "",
          time: now,
          type: "ApprovalComplete",
          title: "Manager approved goals",
          message: `${user.name} approved ${
            USERS.find((u) => u.id === empId)?.name
          }'s goal sheet.`,
        },
      ]);
    }
    setMsg("✅ Goals approved and locked!");
    setTimeout(() => setMsg(""), 2500);
  }
  function reject(empId) {
    if (!reason.trim()) return;
    const now = new Date().toISOString();
    setGoals(
      goals.map((g) =>
        g.employeeId === empId
          ? {
              ...g,
              status: "Rejected",
              sheetStatus: "Rejected",
              rejectionReason: reason,
              updatedAt: now,
            }
          : g
      )
    );
    if (setNotificationLog) {
      setNotificationLog((prev) => [
        ...prev,
        {
          id: Date.now() + "",
          time: now,
          type: "Email",
          title: "Goals rejected",
          message: `${user.name} rejected ${
            USERS.find((u) => u.id === empId)?.name
          }'s goals.`,
        },
      ]);
    }
    if (setEscalationLog) {
      setEscalationLog((prev) => [
        ...prev,
        {
          id: Date.now() + "",
          time: now,
          type: "RevisionRequested",
          title: "Revision requested",
          message: `${user.name} requested revisions for ${
            USERS.find((u) => u.id === empId)?.name
          }'s goals.`,
        },
      ]);
    }
    setRejectId(null);
    setReason("");
    setMsg("Goals sent back for revision.");
    setTimeout(() => setMsg(""), 2500);
  }

  return (
    <>
      <div style={S.pageTitle}>Team Goals</div>
      <div style={S.pageSub}>Review and approve your team's goal sheets</div>
      {msg && <div style={S.alertBox("green", t)}>{msg}</div>}
      <div
        style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 16 }}
      >
        <div>
          {myTeam.map((emp) => {
            const s = ss(emp.id);
            const isPending = s === "Pending Approval";
            const deptColor = DEPT_COLORS[emp.department] || t.accent;
            return (
              <div
                key={emp.id}
                className="emp-card-hover"
                style={{
                  ...S.card,
                  cursor: "pointer",
                  border: `1px solid ${
                    selEmp === emp.id
                      ? t.accent
                      : isPending
                      ? `${t.yellow}55`
                      : t.border
                  }`,
                  marginBottom: 8,
                  padding: "12px 14px",
                  background: selEmp === emp.id ? `${t.accent}0a` : t.card,
                }}
                onClick={() => setSelEmp(emp.id)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  <Avatar
                    initials={emp.avatar || emp.name[0]}
                    color={deptColor}
                    size={32}
                  />
                  <div>
                    <div
                      style={{ fontWeight: 700, color: t.text, fontSize: 13 }}
                    >
                      {emp.name}
                    </div>
                    <div style={{ fontSize: 11, color: t.sub }}>
                      {emp.department}
                    </div>
                  </div>
                </div>
                {statusBadge(s, t)}
                {isPending && (
                  <div style={{ fontSize: 11, color: t.yellow, marginTop: 4 }}>
                    ⚡ Needs approval
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div>
          {!selEmp ? (
            <div
              style={{
                ...S.card,
                color: t.sub,
                textAlign: "center",
                padding: 60,
              }}
            >
              Select a team member
            </div>
          ) : (
            (() => {
              const emp = USERS.find((u) => u.id === selEmp);
              const egs = empGoals(selEmp);
              const s = ss(selEmp);
              const totalW = egs.reduce(
                (sum, g) => sum + Number(g.weightage || 0),
                0
              );
              return (
                <div className="card-hover" style={S.card}>
                  <div
                    style={{
                      ...S.row,
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <Avatar
                        initials={emp?.avatar || emp?.name[0]}
                        color={DEPT_COLORS[emp?.department] || t.accent}
                        size={42}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            color: t.text,
                            fontSize: 17,
                          }}
                        >
                          {emp?.name}
                        </div>
                        <div style={{ fontSize: 12, color: t.sub }}>
                          {emp?.department} · FY 2026
                        </div>
                      </div>
                    </div>
                    <div style={S.row}>
                      {statusBadge(s, t)}
                      <span
                        style={{
                          fontSize: 13,
                          color: totalW === 100 ? t.green : t.red,
                          fontWeight: 700,
                        }}
                      >
                        Total: {totalW}%
                      </span>
                    </div>
                  </div>
                  {egs.length === 0 ? (
                    <div
                      style={{ color: t.sub, textAlign: "center", padding: 20 }}
                    >
                      No goals submitted yet.
                    </div>
                  ) : (
                    <table style={S.table}>
                      <thead>
                        <tr>
                          <th style={S.th}>Goal</th>
                          <th style={S.th}>Thrust Area</th>
                          <th style={S.th}>UoM</th>
                          <th style={S.th}>Target</th>
                          <th style={S.th}>Weightage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {egs.map((g) => (
                          <tr key={g.id}>
                            <td
                              style={{
                                ...S.td,
                                color: t.text,
                                fontWeight: 600,
                              }}
                            >
                              {g.title}
                            </td>
                            <td style={S.td}>{g.thrustArea}</td>
                            <td style={S.td}>{g.uom}</td>
                            <td style={S.td}>{g.target}</td>
                            <td style={S.td}>
                              <strong style={{ color: t.accent }}>
                                {g.weightage}%
                              </strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {s === "Pending Approval" && (
                    <div style={{ marginTop: 14 }}>
                      {rejectId === selEmp ? (
                        <div style={{ animation: "fadeIn 0.2s ease" }}>
                          <textarea
                            style={{ ...S.textarea, marginBottom: 8 }}
                            placeholder="Reason for rejection…"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                          <div style={S.row}>
                            <button
                              className="btn-danger-hover"
                              style={S.btn("danger")}
                              onClick={() => reject(selEmp)}
                            >
                              Confirm Reject
                            </button>
                            <button
                              style={S.btn("secondary")}
                              onClick={() => {
                                setRejectId(null);
                                setReason("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={S.row}>
                          <button
                            className="approve-btn"
                            style={S.btn("success")}
                            onClick={() => approve(selEmp)}
                          >
                            ✓ Approve Goals
                          </button>
                          <button
                            className="btn-danger-hover"
                            style={S.btn("danger")}
                            onClick={() => setRejectId(selEmp)}
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {s === "Approved" && (
                    <div style={{ ...S.alertBox("green", t), marginTop: 14 }}>
                      ✅ Goals are approved and locked for this employee.
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>
      </div>
    </>
  );
}

function MgrCheckins({ user, goals, myTeam, checkins, setCheckins, t, S }) {
  const [selEmp, setSelEmp] = useState(myTeam[0]?.id || null);
  const [activeQ, setActiveQ] = useState("Q1");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  function empGoals(id) {
    return goals.filter((g) => g.employeeId === id && g.status === "Approved");
  }
  function getActual(gid, q) {
    return checkins.find((c) => c.goalId === gid && c.q === q)?.actual || "—";
  }
  function getStatus(gid, q) {
    return (
      checkins.find((c) => c.goalId === gid && c.q === q)?.status ||
      "Not Started"
    );
  }
  function save() {
    if (!comment.trim() || !selEmp) return;
    setComments((p) => [
      ...p,
      {
        empId: selEmp,
        q: activeQ,
        text: comment,
        by: user.name,
        time: new Date().toLocaleString(),
      },
    ]);
    setComment("");
  }
  return (
    <>
      <div style={S.pageTitle}>Team Check-ins</div>
      <div style={S.pageSub}>
        Review quarterly progress and add structured feedback
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 16 }}
      >
        <div>
          {myTeam.map((emp) => (
            <div
              key={emp.id}
              className="emp-card-hover"
              style={{
                ...S.card,
                cursor: "pointer",
                border: `1px solid ${selEmp === emp.id ? t.accent : t.border}`,
                marginBottom: 8,
                padding: "12px 14px",
                background: selEmp === emp.id ? `${t.accent}0a` : t.card,
              }}
              onClick={() => setSelEmp(emp.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar
                  initials={emp.avatar || emp.name[0]}
                  color={DEPT_COLORS[emp.department] || t.accent}
                  size={30}
                />
                <div>
                  <div style={{ fontWeight: 700, color: t.text, fontSize: 13 }}>
                    {emp.name}
                  </div>
                  <div style={{ fontSize: 11, color: t.sub, marginTop: 2 }}>
                    {empGoals(emp.id).length} approved goals
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          {!selEmp ? (
            <div
              style={{
                ...S.card,
                color: t.sub,
                textAlign: "center",
                padding: 60,
              }}
            >
              Select a team member
            </div>
          ) : (
            <div className="card-hover" style={S.card}>
              <div
                style={{
                  fontWeight: 800,
                  color: t.text,
                  fontSize: 16,
                  marginBottom: 12,
                }}
              >
                {USERS.find((u) => u.id === selEmp)?.name} — Check-ins
              </div>
              <div style={S.tabBar}>
                {QUARTERS.map((q) => (
                  <button
                    key={q}
                    style={S.tab(activeQ === q, t)}
                    onClick={() => setActiveQ(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Goal</th>
                    <th style={S.th}>Target</th>
                    <th style={S.th}>Actual</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {empGoals(selEmp).map((g) => {
                    const actual = getActual(g.id, activeQ);
                    const score =
                      actual === "—" ? 0 : calcScore(g.uom, g.target, actual);
                    return (
                      <tr key={g.id}>
                        <td style={{ ...S.td, color: t.text, fontWeight: 600 }}>
                          {g.title}
                        </td>
                        <td style={S.td}>{g.target}</td>
                        <td style={S.td}>{actual}</td>
                        <td style={S.td}>
                          <span
                            style={S.badge(
                              getStatus(g.id, activeQ) === "Completed"
                                ? "green"
                                : getStatus(g.id, activeQ) === "On Track"
                                ? "blue"
                                : "grey",
                              t
                            )}
                          >
                            {getStatus(g.id, activeQ)}
                          </span>
                        </td>
                        <td style={S.td}>
                          <strong
                            style={{
                              color:
                                actual === "—"
                                  ? t.sub
                                  : score >= 80
                                  ? t.green
                                  : score >= 50
                                  ? t.yellow
                                  : t.red,
                            }}
                          >
                            {actual === "—" ? "—" : score + "%"}
                          </strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={S.divider} />
              <div style={{ fontWeight: 700, color: t.text, marginBottom: 8 }}>
                Check-in Comment — {activeQ}
              </div>
              {comments
                .filter((c) => c.empId === selEmp && c.q === activeQ)
                .map((c, i) => (
                  <div
                    key={i}
                    style={{
                      background: t.input,
                      borderRadius: 9,
                      padding: "10px 14px",
                      marginBottom: 8,
                      border: `1px solid ${t.border}`,
                    }}
                  >
                    <div style={{ fontSize: 13, color: t.text }}>{c.text}</div>
                    <div style={{ fontSize: 11, color: t.sub, marginTop: 4 }}>
                      {c.by} · {c.time}
                    </div>
                  </div>
                ))}
              <textarea
                style={{ ...S.textarea, marginBottom: 8 }}
                placeholder="Add a structured check-in comment…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="btn-primary-hover"
                style={S.btn("primary")}
                onClick={save}
              >
                Save Comment
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MgrAnalytics({ goals, myTeam, checkins, t, S }) {
  const approvedByEmp = myTeam.map((emp, i) => ({
    label: emp.name.split(" ")[0],
    value: (() => {
      const ag = goals.filter(
        (g) => g.employeeId === emp.id && g.status === "Approved"
      );
      if (!ag.length) return 0;
      let tot = 0,
        cnt = 0;
      ag.forEach((g) => {
        const acts = QUARTERS.map(
          (q) =>
            checkins.find((c) => c.goalId === g.id && c.q === q)?.actual || ""
        ).filter(Boolean);
        if (acts.length) {
          tot += calcScore(g.uom, g.target, acts[acts.length - 1]);
          cnt++;
        }
      });
      return cnt ? Math.round(tot / cnt) : 0;
    })(),
    color: ["#22d3ee", "#60a5fa", "#a78bfa", "#34d399", "#f59e0b"][i % 5],
  }));
  const heatRows = myTeam.map((emp) => ({
    id: emp.id,
    title: emp.name.split(" ")[0],
    scores: QUARTERS.reduce((acc, q) => {
      const empGoals = goals.filter(
        (g) => g.employeeId === emp.id && g.status === "Approved"
      );
      const avg = empGoals.length
        ? Math.round(
            empGoals.reduce((sum, g) => {
              const act =
                checkins.find((c) => c.goalId === g.id && c.q === q)?.actual ||
                "";
              return sum + calcScore(g.uom, g.target, act);
            }, 0) / empGoals.length
          )
        : 0;
      acc[q] = avg;
      return acc;
    }, {}),
  }));
  return (
    <>
      <div style={S.pageTitle}>Team Analytics</div>
      <div style={S.pageSub}>Quarter-on-quarter performance overview</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Team Progress by Employee
          </div>
          <BarChart data={approvedByEmp} height={140} t={t} />
        </div>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Goals by Thrust Area
          </div>
          <PieChart
            size={130}
            data={THRUST_AREAS.map((ta, i) => ({
              label: ta.slice(0, 5),
              value: goals.filter(
                (g) =>
                  myTeam.some((u) => u.id === g.employeeId) &&
                  g.thrustArea === ta
              ).length,
              color: [
                "#22d3ee",
                "#60a5fa",
                "#a78bfa",
                "#34d399",
                "#f59e0b",
                "#f87171",
              ][i],
            })).filter((d) => d.value > 0)}
          />
        </div>
      </div>
      <div className="card-hover" style={{ ...S.card, marginTop: 16 }}>
        <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
          Team Heat Map
        </div>
        <HeatMap rows={heatRows} quarters={QUARTERS} t={t} />
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ADMIN
// ════════════════════════════════════════════════════════════════
function AdminApp({
  user,
  goals,
  setGoals,
  checkins,
  auditLog,
  setAuditLog,
  onLogout,
  theme,
  toggleTheme,
  syncing,
}) {
  const [page, setPage] = useState("dashboard");
  const t = theme === "dark" ? DARK : LIGHT;
  const S = makeS(t);
  const nav = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "completion", icon: "✅", label: "Completion Table" },
    { key: "audit", icon: "📋", label: "Audit Log" },
    { key: "shared", icon: "🔗", label: "Shared Goals" },
    { key: "analytics", icon: "📈", label: "Analytics" },
  ];
  return (
    <Shell
      user={user}
      onLogout={onLogout}
      nav={nav}
      activeNav={page}
      setActiveNav={setPage}
      theme={theme}
      toggleTheme={toggleTheme}
      syncing={syncing}
    >
      {page === "dashboard" && (
        <AdminDash goals={goals} checkins={checkins} t={t} S={S} />
      )}
      {page === "completion" && (
        <AdminCompletion
          goals={goals}
          setGoals={setGoals}
          checkins={checkins}
          auditLog={auditLog}
          setAuditLog={setAuditLog}
          adminUser={user}
          t={t}
          S={S}
        />
      )}
      {page === "audit" && <AdminAudit auditLog={auditLog} t={t} S={S} />}
      {page === "shared" && (
        <AdminShared goals={goals} setGoals={setGoals} t={t} S={S} />
      )}
      {page === "analytics" && (
        <AdminAnalytics goals={goals} checkins={checkins} t={t} S={S} />
      )}
    </Shell>
  );
}

function AdminDash({ goals, checkins, t, S }) {
  const employees = USERS.filter((u) => u.role === "employee");
  const submitted = employees.filter((e) =>
    goals.some((g) => g.employeeId === e.id && g.sheetStatus !== "Draft")
  );
  const approved = employees.filter((e) =>
    goals.some((g) => g.employeeId === e.id && g.sheetStatus === "Approved")
  );
  return (
    <>
      <div style={S.pageTitle}>Admin Dashboard</div>
      <div style={S.pageSub}>FY 2026 · Organisation-wide overview</div>
      <div style={S.statGrid}>
        {[
          { label: "Total Employees", val: employees.length, color: t.accent },
          {
            label: "Goals Submitted",
            val: employees.length
              ? Math.round((submitted.length / employees.length) * 100) + "%"
              : "0%",
            color: t.blue,
          },
          {
            label: "Goals Approved",
            val: employees.length
              ? Math.round((approved.length / employees.length) * 100) + "%"
              : "0%",
            color: t.green,
          },
          {
            label: "Total Goals",
            val: goals.filter((g) =>
              employees.some((e) => e.id === g.employeeId)
            ).length,
            color: t.accent,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="card-hover stat-card-anim"
            style={{ ...S.statCard, animationDelay: `${i * 0.08}s` }}
          >
            <div style={S.statLabel}>{s.label}</div>
            <div style={{ ...S.statVal, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Submission vs Approval
          </div>
          <PieChart
            size={130}
            data={[
              { label: "Approved", value: approved.length, color: t.green },
              {
                label: "Submitted",
                value: submitted.length - approved.length,
                color: t.yellow,
              },
              {
                label: "Not Submitted",
                value: employees.length - submitted.length,
                color: t.muted,
              },
            ].filter((d) => d.value > 0)}
          />
        </div>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Employee Status
          </div>
          {employees.map((e) => {
            const ss =
              goals.filter((g) => g.employeeId === e.id)[0]?.sheetStatus ||
              "Draft";
            const deptColor = DEPT_COLORS[e.department] || t.accent;
            return (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: `1px solid ${t.border}22`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar
                    initials={e.avatar || e.name[0]}
                    color={deptColor}
                    size={28}
                  />
                  <div>
                    <div
                      style={{ fontSize: 13, color: t.text, fontWeight: 600 }}
                    >
                      {e.name}
                    </div>
                    <div style={{ fontSize: 11, color: t.sub }}>
                      {e.department}
                    </div>
                  </div>
                </div>
                {statusBadge(ss, t)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AdminCompletion({
  goals,
  setGoals,
  checkins,
  auditLog,
  setAuditLog,
  adminUser,
  t,
  S,
}) {
  const employees = USERS.filter((u) => u.role === "employee");
  const [msg, setMsg] = useState("");
  function override(empId, action) {
    if (action === "approve") {
      setGoals(
        goals.map((g) =>
          g.employeeId === empId
            ? { ...g, status: "Approved", sheetStatus: "Approved" }
            : g
        )
      );
      setAuditLog((al) => [
        ...al,
        {
          id: Date.now() + "",
          time: new Date().toLocaleString(),
          employee: USERS.find((u) => u.id === empId)?.name,
          goal: "All Goals",
          field: "Admin Override",
          oldVal: "—",
          newVal: "Approved",
          by: adminUser.name,
        },
      ]);
      setMsg("✅ Admin override: Goals approved.");
      setTimeout(() => setMsg(""), 2500);
    }
  }
  return (
    <>
      <div style={S.pageTitle}>Completion Table</div>
      <div style={S.pageSub}>
        Full FY 2026 completion matrix across all employees
      </div>
      {msg && <div style={S.alertBox("green", t)}>{msg}</div>}
      <div className="card-hover" style={S.card}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Employee</th>
              <th style={S.th}>Dept</th>
              <th style={S.th}>Goals</th>
              <th style={S.th}>Weightage</th>
              <th style={S.th}>Sheet Status</th>
              {QUARTERS.map((q) => (
                <th key={q} style={S.th}>
                  {q}
                </th>
              ))}
              <th style={S.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => {
              const eg = goals.filter((g) => g.employeeId === e.id);
              const ss = eg[0]?.sheetStatus || "Draft";
              const totalW = eg.reduce(
                (s, g) => s + Number(g.weightage || 0),
                0
              );
              return (
                <tr key={e.id}>
                  <td style={{ ...S.td, color: t.text, fontWeight: 600 }}>
                    {e.name}
                  </td>
                  <td style={S.td}>{e.department}</td>
                  <td style={S.td}>{eg.length}</td>
                  <td style={S.td}>
                    <span
                      style={{
                        color: totalW === 100 ? t.green : t.red,
                        fontWeight: 700,
                      }}
                    >
                      {totalW}%
                    </span>
                  </td>
                  <td style={S.td}>{statusBadge(ss, t)}</td>
                  {QUARTERS.map((q) => {
                    const ag = eg.filter((g) => g.status === "Approved");
                    const has = ag.some((g) =>
                      checkins.find(
                        (c) => c.goalId === g.id && c.q === q && c.actual
                      )
                    );
                    const avg =
                      ag.length && has
                        ? Math.round(
                            ag.reduce((s, g) => {
                              const a =
                                checkins.find(
                                  (c) => c.goalId === g.id && c.q === q
                                )?.actual || "";
                              return s + calcScore(g.uom, g.target, a);
                            }, 0) / ag.length
                          )
                        : 0;
                    return (
                      <td key={q} style={S.td}>
                        {has ? (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: 6,
                              background:
                                avg >= 80
                                  ? t.greenBg
                                  : avg >= 50
                                  ? t.yellowBg
                                  : t.redBg,
                              color:
                                avg >= 80
                                  ? t.green
                                  : avg >= 50
                                  ? t.yellow
                                  : t.red,
                              fontWeight: 700,
                            }}
                          >
                            {avg}%
                          </span>
                        ) : (
                          <span style={{ color: t.sub }}>—</span>
                        )}
                      </td>
                    );
                  })}
                  <td style={S.td}>
                    {ss !== "Approved" && eg.length > 0 && (
                      <button
                        className="btn-primary-hover"
                        style={{
                          ...S.btn("primary"),
                          padding: "4px 10px",
                          fontSize: 11,
                        }}
                        onClick={() => override(e.id, "approve")}
                      >
                        Override ✓
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminAudit({ auditLog, t, S }) {
  return (
    <>
      <div style={S.pageTitle}>Audit Log</div>
      <div style={S.pageSub}>Immutable record of all approval actions</div>
      <div className="card-hover" style={S.card}>
        {auditLog.length === 0 ? (
          <div style={{ color: t.sub, textAlign: "center", padding: 40 }}>
            No audit events yet.
          </div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Time</th>
                <th style={S.th}>Employee</th>
                <th style={S.th}>Goal</th>
                <th style={S.th}>Field</th>
                <th style={S.th}>Old</th>
                <th style={S.th}>New</th>
                <th style={S.th}>By</th>
              </tr>
            </thead>
            <tbody>
              {[...auditLog].reverse().map((l) => (
                <tr key={l.id}>
                  <td style={S.td}>{l.time}</td>
                  <td style={{ ...S.td, color: t.text, fontWeight: 600 }}>
                    {l.employee}
                  </td>
                  <td style={S.td}>{l.goal}</td>
                  <td style={S.td}>{l.field}</td>
                  <td style={S.td}>
                    <span style={{ color: t.red }}>{l.oldVal}</span>
                  </td>
                  <td style={S.td}>
                    <span style={{ color: t.green }}>{l.newVal}</span>
                  </td>
                  <td style={S.td}>{l.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function AdminShared({ goals, setGoals, t, S }) {
  const employees = USERS.filter((u) => u.role === "employee");
  const [form, setForm] = useState({
    title: "",
    target: "",
    thrustArea: THRUST_AREAS[0],
    uom: UOM_TYPES[0],
    selEmps: [],
  });
  const [msg, setMsg] = useState("");
  function toggleEmp(id) {
    setForm((f) => ({
      ...f,
      selEmps: f.selEmps.includes(id)
        ? f.selEmps.filter((x) => x !== id)
        : [...f.selEmps, id],
    }));
  }
  function push() {
    if (!form.title.trim() || !form.target || !form.selEmps.length) {
      setMsg("⚠️ Fill all fields and select at least one employee");
      return;
    }
    const newGoals = form.selEmps.map((empId) => ({
      id: Date.now() + "_" + empId,
      employeeId: empId,
      managerId: USERS.find((u) => u.id === empId)?.managerId,
      title: form.title,
      description: "Shared goal pushed by Admin",
      thrustArea: form.thrustArea,
      uom: form.uom,
      target: form.target,
      weightage: 10,
      status: "Draft",
      sheetStatus: "Draft",
      shared: true,
    }));
    setGoals([...goals, ...newGoals]);
    setMsg(`✅ Shared goal pushed to ${form.selEmps.length} employee(s).`);
    setForm({
      title: "",
      target: "",
      thrustArea: THRUST_AREAS[0],
      uom: UOM_TYPES[0],
      selEmps: [],
    });
    setTimeout(() => setMsg(""), 4000);
  }
  return (
    <>
      <div style={S.pageTitle}>Shared Goals</div>
      <div style={S.pageSub}>Push a departmental KPI to multiple employees</div>
      {msg && (
        <div style={S.alertBox(msg.startsWith("✅") ? "green" : "yellow", t)}>
          {msg}
        </div>
      )}
      <div className="card-hover" style={S.card}>
        <div style={S.formGrid}>
          <div>
            <label style={S.label}>Goal Title *</label>
            <input
              style={S.input}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Reduce operational costs by 10%"
            />
          </div>
          <div>
            <label style={S.label}>Target *</label>
            <input
              style={S.input}
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              placeholder="e.g. 10"
            />
          </div>
          <div>
            <label style={S.label}>Thrust Area</label>
            <select
              style={S.select}
              value={form.thrustArea}
              onChange={(e) => setForm({ ...form, thrustArea: e.target.value })}
            >
              {THRUST_AREAS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={S.label}>UoM</label>
            <select
              style={S.select}
              value={form.uom}
              onChange={(e) => setForm({ ...form, uom: e.target.value })}
            >
              {UOM_TYPES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={S.label}>Select Employees *</label>
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}
          >
            {employees.map((e) => {
              const deptColor = DEPT_COLORS[e.department] || t.accent;
              const sel = form.selEmps.includes(e.id);
              return (
                <div
                  key={e.id}
                  onClick={() => toggleEmp(e.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 9,
                    cursor: "pointer",
                    border: `1px solid ${sel ? deptColor : t.border}`,
                    background: sel ? `${deptColor}18` : t.card,
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Avatar
                    initials={e.avatar || e.name[0]}
                    color={deptColor}
                    size={22}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: sel ? deptColor : t.text,
                        fontWeight: 600,
                      }}
                    >
                      {e.name}
                    </div>
                    <div style={{ fontSize: 11, color: t.sub }}>
                      {e.department}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="btn-primary-hover"
          style={{ ...S.btn("primary"), marginTop: 16 }}
          onClick={push}
        >
          Push Shared Goal →
        </button>
      </div>
    </>
  );
}

function AdminAnalytics({ goals, checkins, t, S }) {
  const employees = USERS.filter((u) => u.role === "employee");
  const qTrend = QUARTERS.map((q, i) => ({
    label: q,
    value: Math.round(
      employees.reduce((s, e) => {
        const ag = goals.filter(
          (g) => g.employeeId === e.id && g.status === "Approved"
        );
        if (!ag.length) return s;
        return (
          s +
          ag.reduce((gs, g) => {
            const a =
              checkins.find((c) => c.goalId === g.id && c.q === q)?.actual ||
              "";
            return gs + calcScore(g.uom, g.target, a);
          }, 0) /
            ag.length
        );
      }, 0) / Math.max(1, employees.length)
    ),
    color: ["#22d3ee", "#60a5fa", "#a78bfa", "#34d399"][i],
  }));
  return (
    <>
      <div style={S.pageTitle}>Organisation Analytics</div>
      <div style={S.pageSub}>
        Quarter-on-quarter trends and distribution insights
      </div>
      {/* Enterprise insights accessible from Manager Dashboard only */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Org-Wide QoQ Progress
          </div>
          <BarChart data={qTrend} height={140} t={t} />
        </div>
        <div className="card-hover" style={S.card}>
          <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Goal Distribution by UoM
          </div>
          <PieChart
            size={130}
            data={UOM_TYPES.map((u, i) => ({
              label: u.split(" ")[0],
              value: goals.filter(
                (g) =>
                  g.uom === u && employees.some((e) => e.id === g.employeeId)
              ).length,
              color: [
                "#22d3ee",
                "#60a5fa",
                "#a78bfa",
                "#34d399",
                "#f59e0b",
                "#f87171",
              ][i],
            })).filter((d) => d.value > 0)}
          />
        </div>
      </div>
      <div className="card-hover" style={S.card}>
        <div style={{ fontWeight: 700, color: t.text, marginBottom: 14 }}>
          Employee Progress Heatmap
        </div>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Employee</th>
              <th style={S.th}>Dept</th>
              {QUARTERS.map((q) => (
                <th key={q} style={S.th}>
                  {q} Avg
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => {
              const ag = goals.filter(
                (g) => g.employeeId === e.id && g.status === "Approved"
              );
              return (
                <tr key={e.id}>
                  <td style={{ ...S.td, color: t.text, fontWeight: 700 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Avatar
                        initials={e.avatar || e.name[0]}
                        color={DEPT_COLORS[e.department] || t.accent}
                        size={24}
                      />
                      {e.name}
                    </div>
                  </td>
                  <td style={S.td}>{e.department}</td>
                  {QUARTERS.map((q) => {
                    const avg = ag.length
                      ? Math.round(
                          ag.reduce((s, g) => {
                            const a =
                              checkins.find(
                                (c) => c.goalId === g.id && c.q === q
                              )?.actual || "";
                            return s + calcScore(g.uom, g.target, a);
                          }, 0) / ag.length
                        )
                      : 0;
                    const hasData = ag.some((g) =>
                      checkins.find(
                        (c) => c.goalId === g.id && c.q === q && c.actual
                      )
                    );
                    return (
                      <td key={q} style={S.td}>
                        {hasData ? (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: 6,
                              background:
                                avg >= 80
                                  ? t.greenBg
                                  : avg >= 50
                                  ? t.yellowBg
                                  : t.redBg,
                              color:
                                avg >= 80
                                  ? t.green
                                  : avg >= 50
                                  ? t.yellow
                                  : t.red,
                              fontWeight: 700,
                            }}
                          >
                            {avg}%
                          </span>
                        ) : (
                          <span style={{ color: t.sub }}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// ROOT — static prebuilt data-driven app
// ════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [goals, setGoalsState] = useState(() => {
    try {
      const raw = localStorage.getItem("goals");
      return raw ? JSON.parse(raw) : PREBUILT_GOALS;
    } catch (e) {
      return PREBUILT_GOALS;
    }
  });
  const [checkins, setCheckinsState] = useState(() => {
    try {
      const raw = localStorage.getItem("checkins");
      return raw ? JSON.parse(raw) : PREBUILT_CHECKINS;
    } catch (e) {
      return PREBUILT_CHECKINS;
    }
  });
  const [auditLog, setAuditLogState] = useState(() => {
    try {
      const raw = localStorage.getItem("auditLog");
      return raw ? JSON.parse(raw) : PREBUILT_AUDIT_LOG;
    } catch (e) {
      return PREBUILT_AUDIT_LOG;
    }
  });
  const [notificationLog, setNotificationLogState] = useState(() => {
    try {
      const raw = localStorage.getItem("notificationLog");
      return raw ? JSON.parse(raw) : PREBUILT_NOTIFICATION_LOG;
    } catch (e) {
      return PREBUILT_NOTIFICATION_LOG;
    }
  });
  const [escalationLog, setEscalationLogState] = useState(() => {
    try {
      const raw = localStorage.getItem("escalationLog");
      return raw ? JSON.parse(raw) : PREBUILT_ESCALATION_LOG;
    } catch (e) {
      return PREBUILT_ESCALATION_LOG;
    }
  });
  const [theme, setTheme] = useState("dark");
  const syncing = false;
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Inject global CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    return () => document.head.removeChild(style);
  }, []);

  // localStorage debounced persister
  const _saveTimers = useRef({});
  function _scheduleSave(key, value) {
    try {
      if (_saveTimers.current[key]) clearTimeout(_saveTimers.current[key]);
      _saveTimers.current[key] = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {}
      }, 700);
    } catch (e) {}
  }

  function setGoals(g) {
    const next = typeof g === "function" ? g(goals) : g;
    setGoalsState(next);
    _scheduleSave("goals", next);
  }
  function setCheckins(c) {
    const next = typeof c === "function" ? c(checkins) : c;
    setCheckinsState(next);
    _scheduleSave("checkins", next);
  }
  function setAuditLog(a) {
    const next = typeof a === "function" ? a(auditLog) : a;
    setAuditLogState(next);
    _scheduleSave("auditLog", next);
  }
  function setNotificationLog(n) {
    const next = typeof n === "function" ? n(notificationLog) : n;
    setNotificationLogState(next);
    _scheduleSave("notificationLog", next);
  }
  function setEscalationLog(e) {
    const next = typeof e === "function" ? e(escalationLog) : e;
    setEscalationLogState(next);
    _scheduleSave("escalationLog", next);
  }

  const showToast = (message, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const shared = {
    goals,
    setGoals,
    checkins,
    setCheckins,
    auditLog,
    setAuditLog,
    notificationLog,
    setNotificationLog,
    escalationLog,
    setEscalationLog,
    onLogout: () => setUser(null),
    theme,
    toggleTheme,
    syncing,
    showToast,
  };

  if (!user)
    return (
      <>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <LoginPage
          onLogin={setUser}
          theme={theme}
          toggleTheme={toggleTheme}
          showToast={showToast}
        />
      </>
    );
  if (user.role === "employee")
    return (
      <>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <EmployeeApp user={user} {...shared} />
      </>
    );
  if (user.role === "manager")
    return (
      <>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <ManagerApp user={user} {...shared} />
      </>
    );
  if (user.role === "admin")
    return (
      <>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <AdminApp user={user} {...shared} />
      </>
    );
}
