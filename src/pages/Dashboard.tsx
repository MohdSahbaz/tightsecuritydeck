import {
  Users2,
  Building2,
  ClipboardCheck,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { PageHeader, StatCard, SectionCard, Badge, Avatar, Button } from "../components/ui";
import {
  kpis,
  clients,
  sites,
  incidents,
  leaveRequests,
  revenueTrend,
  attendanceTrend,
  deploymentBySite,
  currency,
  employees,
} from "../lib/mockData";

const pieColors = ["#0f2450", "#f5c518", "#2a53a0", "#c9960c", "#94a3b8"];

export default function Dashboard() {
  const topClients = [...clients]
    .sort((a, b) => b.contractValue - a.contractValue)
    .slice(0, 5);

  const recentIncidents = incidents.slice(0, 5);
  const recentLeave = leaveRequests.filter((l) => l.status === "Pending").slice(0, 5);

  const leaveSummary = [
    { name: "Approved", value: leaveRequests.filter((l) => l.status === "Approved").length },
    { name: "Pending", value: leaveRequests.filter((l) => l.status === "Pending").length },
    { name: "Rejected", value: leaveRequests.filter((l) => l.status === "Rejected").length },
  ];

  return (
    <div>
      <PageHeader
        title="Executive Overview"
        subtitle="Real-time snapshot of workforce, sites, attendance and revenue across all branches."
        action={
          <div className="flex gap-2">
            <select className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700">
              <option>This Month</option>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
            </select>
            <select className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700">
              <option>All Branches</option>
              <option>Kampala HQ</option>
              <option>Entebbe Branch</option>
            </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="navy"
          label="Total Guards"
          value={kpis.totalGuards.toString()}
          delta="+8.5% vs last month"
          icon={<Users2 size={16} className="text-white" />}
        />
        <StatCard
          label="Active Client Sites"
          value={kpis.activeSites.toString()}
          delta="+5.3% vs last month"
          icon={<Building2 size={16} className="text-navy-900" />}
        />
        <StatCard
          label="Attendance Rate"
          value={`${kpis.attendanceRate}%`}
          delta="+2.1% vs last month"
          icon={<ClipboardCheck size={16} className="text-navy-900" />}
        />
        <StatCard
          tone="gold"
          label="Revenue (MTD)"
          value={currency(kpis.revenueMTD)}
          delta="+12.7% vs last month"
          icon={<Wallet size={16} className="text-navy-950" />}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Revenue vs Expenses (UGX Mn)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={revenueTrend} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5c518" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f5c518" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f2450" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0f2450" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #eef1f6" }} />
              <Area type="monotone" dataKey="revenue" stroke="#c9960c" fill="url(#rev)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#0f2450" fill="url(#exp)" strokeWidth={2} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Leave Summary">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={leaveSummary} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {leaveSummary.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 space-y-2">
            {leaveSummary.map((l, i) => (
              <div key={l.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-500">
                  <span className="h-2 w-2 rounded-full" style={{ background: pieColors[i] }} />
                  {l.name}
                </span>
                <span className="font-semibold text-navy-900">{l.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Weekly Attendance Trend" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={attendanceTrend} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="rate" stroke="#0f2450" fill="#0f2450" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Guard Deployment by Site" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={deploymentBySite} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} interval={0} angle={-12} textAnchor="end" height={45} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="guards" radius={[6, 6, 0, 0]} fill="#f5c518" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Top Clients by Contract Value">
          <ul className="space-y-3">
            {topClients.map((c) => (
              <li key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar name={c.name} size={30} />
                  <div>
                    <p className="text-sm font-medium text-navy-900">{c.name}</p>
                    <p className="text-xs text-ink-400">{c.category}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-navy-900">{currency(c.contractValue)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Recent Incidents"
          action={<Button variant="ghost" className="!px-2.5 !py-1 text-xs">View all</Button>}
        >
          <ul className="space-y-3">
            {recentIncidents.map((inc) => (
              <li key={inc.id} className="flex items-start justify-between gap-3">
                <div className="flex gap-2.5">
                  <AlertTriangle
                    size={15}
                    className={
                      inc.severity === "Critical" || inc.severity === "High" ? "mt-0.5 shrink-0 text-rose-500" : "mt-0.5 shrink-0 text-amber-500"
                    }
                  />
                  <div>
                    <p className="text-sm font-medium leading-tight text-navy-900">{inc.title}</p>
                    <p className="text-xs text-ink-400">{inc.siteName}</p>
                  </div>
                </div>
                <Badge>{inc.severity}</Badge>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Pending Leave Approvals"
          action={<Button variant="ghost" className="!px-2.5 !py-1 text-xs">View all</Button>}
        >
          {recentLeave.length === 0 && <p className="text-sm text-ink-400">No pending approvals.</p>}
          <ul className="space-y-3">
            {recentLeave.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={l.employeeName} size={30} />
                  <div>
                    <p className="text-sm font-medium text-navy-900">{l.employeeName}</p>
                    <p className="text-xs text-ink-400">{l.type} &middot; {l.days} days</p>
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-ink-400" />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <p className="mt-6 text-center text-xs text-ink-400">
        {employees.length} workforce records &middot; {sites.length} active sites &middot; demo dataset for presentation purposes
      </p>
    </div>
  );
}
