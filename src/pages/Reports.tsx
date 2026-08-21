import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download } from "lucide-react";
import { PageHeader, SectionCard, Button, Table, Badge } from "../components/ui";
import { clients, invoices, currency, employees } from "../lib/mockData";

const pieColors = ["#0f2450", "#f5c518", "#2a53a0", "#c9960c", "#94a3b8", "#7c9cd6"];

const branchStrength = [
  { branch: "Kampala HQ", count: employees.filter((e) => e.branch === "Kampala HQ").length },
  { branch: "Entebbe Branch", count: employees.filter((e) => e.branch === "Entebbe Branch").length },
  { branch: "Jinja Branch", count: employees.filter((e) => e.branch === "Jinja Branch").length },
  { branch: "Mbarara Branch", count: employees.filter((e) => e.branch === "Mbarara Branch").length },
];

const overtimeTrend = [
  { month: "Mar", hrs: 320 },
  { month: "Apr", hrs: 298 },
  { month: "May", hrs: 342 },
  { month: "Jun", hrs: 310 },
  { month: "Jul", hrs: 365 },
  { month: "Aug", hrs: 288 },
];

const categorySplit = [
  { name: "Banking & Finance", value: 6 },
  { name: "Retail & Malls", value: 5 },
  { name: "Hospitality", value: 3 },
  { name: "Corporate Offices", value: 4 },
];

export default function Reports() {
  const topOverdue = [...invoices].filter((i) => i.status === "Overdue").slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Operational, workforce and commercial insights across the organisation."
        action={
          <Button variant="ghost">
            <Download size={15} /> Export PDF
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Workforce Strength by Branch">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={branchStrength} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
              <XAxis dataKey="branch" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#0f2450" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Overtime Hours Trend">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={overtimeTrend} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Line type="monotone" dataKey="hrs" stroke="#c9960c" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Clients by Industry Category">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categorySplit} dataKey="value" nameKey="name" outerRadius={80} paddingAngle={2}>
                  {categorySplit.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Top Overdue Invoices" className="lg:col-span-2">
          <Table head={["Invoice No.", "Client", "Total", "Due Date"]}>
            {topOverdue.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-sm text-ink-400">No overdue invoices &mdash; excellent collection health.</td>
              </tr>
            )}
            {topOverdue.map((inv) => (
              <tr key={inv.id}>
                <td className="px-3 py-2.5 font-medium text-navy-900">{inv.invoiceNo}</td>
                <td className="px-3 py-2.5 text-ink-600">{inv.clientName}</td>
                <td className="px-3 py-2.5 font-semibold text-navy-900">{currency(inv.total)}</td>
                <td className="px-3 py-2.5">
                  <Badge>Overdue</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </SectionCard>
      </div>

      <p className="mt-4 text-center text-xs text-ink-400">
        Reporting across {clients.length} clients and {employees.length} workforce records &mdash; demo dataset.
      </p>
    </div>
  );
}
