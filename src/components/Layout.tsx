import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Handshake,
  Building2,
  CalendarClock,
  MapPinned,
  ClipboardCheck,
  CalendarOff,
  Receipt,
  ShoppingCart,
  BarChart3,
  ShieldCheck,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Menu,
  AlertTriangle,
  UserCircle,
  LogOut,
  Building,
  CheckCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import logo from "../assets/logo.png";
import { incidents, leaveRequests, invoices } from "../lib/mockData";

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/workforce", label: "Workforce & Guards", icon: Users },
  { to: "/clients", label: "Clients & Contracts", icon: Handshake },
  { to: "/sites", label: "Sites & Posts", icon: Building2 },
  { to: "/roster", label: "Roster & Scheduling", icon: CalendarClock },
  { to: "/deployment", label: "Deployment", icon: MapPinned },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/leave", label: "Leave Management", icon: CalendarOff },
  { to: "/billing", label: "Billing & Receivables", icon: Receipt },
  { to: "/procurement", label: "Expenses & Procurement", icon: ShoppingCart },
  { to: "/reports", label: "Reports & Analytics", icon: BarChart3 },
  { to: "/roles", label: "Roles & Approvals", icon: ShieldCheck },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50">
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-950 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-white/10 px-4 py-5">
          <img src={logo} alt="Tight Security" className="h-12 w-full object-contain" />
          <div className="mt-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-gold-400">
            Workforce ERP
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-gold-400 text-navy-950 font-semibold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <item.icon size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center gap-3 border-b border-ink-100 bg-white px-4 lg:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu size={20} className="text-navy-900" />
          </button>
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              placeholder="Search guards, clients, sites, invoices..."
              className="w-full rounded-lg border border-ink-200 bg-ink-50 py-2 pl-9 pr-3 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <NotificationsMenu />
            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-6 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-gold-400">
      SN
    </div>
  );
}

type Notification = {
  id: string;
  icon: typeof AlertTriangle;
  tone: "rose" | "amber" | "sky";
  title: string;
  detail: string;
  time: string;
};

function buildNotifications(): Notification[] {
  const items: Notification[] = [];
  incidents
    .filter((i) => i.status !== "Resolved")
    .slice(0, 3)
    .forEach((i) =>
      items.push({
        id: `n-inc-${i.id}`,
        icon: AlertTriangle,
        tone: i.severity === "Critical" || i.severity === "High" ? "rose" : "amber",
        title: i.title,
        detail: i.siteName,
        time: i.date,
      })
    );
  leaveRequests
    .filter((l) => l.status === "Pending")
    .slice(0, 2)
    .forEach((l) =>
      items.push({
        id: `n-leave-${l.id}`,
        icon: CalendarOff,
        tone: "amber",
        title: `${l.employeeName} requested ${l.type.toLowerCase()} leave`,
        detail: `${l.days} days · awaiting approval`,
        time: l.appliedOn,
      })
    );
  invoices
    .filter((inv) => inv.status === "Overdue")
    .slice(0, 2)
    .forEach((inv) =>
      items.push({
        id: `n-inv-${inv.id}`,
        icon: Receipt,
        tone: "rose",
        title: `Invoice ${inv.invoiceNo} overdue`,
        detail: inv.clientName,
        time: inv.dueDate,
      })
    );
  return items.slice(0, 7);
}

const notifications = buildNotifications();

const toneClasses: Record<Notification["tone"], string> = {
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  sky: "bg-sky-50 text-sky-600",
};

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState<Set<string>>(new Set());
  const ref = useClickOutside(() => setOpen(false));
  const unreadCount = notifications.filter((n) => !read.has(n.id)).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full p-2 hover:bg-ink-50"
      >
        <Bell size={18} className="text-navy-900" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-rose-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
            <p className="text-sm font-semibold text-navy-900">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={() => setRead(new Set(notifications.map((n) => n.id)))}
                className="flex items-center gap-1 text-xs font-medium text-navy-700 hover:text-navy-900"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-ink-400">You're all caught up.</p>
            )}
            {notifications.map((n) => {
              const isRead = read.has(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => setRead((prev) => new Set(prev).add(n.id))}
                  className={clsx(
                    "flex w-full items-start gap-3 border-b border-ink-50 px-4 py-3 text-left last:border-b-0 hover:bg-ink-50",
                    !isRead && "bg-ink-50/60"
                  )}
                >
                  <span className={clsx("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", toneClasses[n.tone])}>
                    <n.icon size={14} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-xs font-semibold text-navy-900">{n.title}</span>
                      {!isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-navy-700" />}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-500">{n.detail}</span>
                    <span className="mt-0.5 block text-[11px] text-ink-400">{n.time}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const navigate = useNavigate();

  const items = [
    { label: "My Profile", icon: UserCircle, to: "/workforce" },
    { label: "Branch: Kampala HQ", icon: Building, to: "/settings" },
    { label: "Account Settings", icon: Settings, to: "/settings" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-ink-200 py-1.5 pl-1.5 pr-2.5 hover:bg-ink-50"
      >
        <Avatar />
        <div className="hidden text-left leading-tight sm:block">
          <div className="text-xs font-semibold text-navy-900">Sarah N.</div>
          <div className="text-[11px] text-ink-400">Operations Manager</div>
        </div>
        <ChevronDown size={14} className={clsx("text-ink-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-lg">
          <div className="border-b border-ink-100 px-4 py-3">
            <p className="text-sm font-semibold text-navy-900">Sarah Nakato</p>
            <p className="text-xs text-ink-500">sarah.n@tightsecurity.co.ug</p>
          </div>
          <div className="py-1.5">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  navigate(item.to);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-ink-700 hover:bg-ink-50"
              >
                <item.icon size={15} className="text-ink-400" />
                {item.label}
              </button>
            ))}
          </div>
          <div className="border-t border-ink-100 py-1.5">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/login");
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
