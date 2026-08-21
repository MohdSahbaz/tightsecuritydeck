import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { PageHeader, Toolbar, SearchInput, Select, Table, Badge, Button, Pagination, EmptyState, StatCard } from "../components/ui";
import { attendance } from "../lib/mockData";

const PAGE_SIZE = 12;

export default function Attendance() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      attendance.filter(
        (a) =>
          (status === "All Status" || a.status === status) &&
          (a.employeeName.toLowerCase().includes(query.toLowerCase()) || a.siteName.toLowerCase().includes(query.toLowerCase()))
      ),
    [query, status]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const present = attendance.filter((a) => a.status === "Present").length;
  const absent = attendance.filter((a) => a.status === "Absent").length;
  const late = attendance.filter((a) => a.status === "Late").length;
  const rate = ((present / attendance.length) * 100).toFixed(1);

  return (
    <div>
      <PageHeader
        title="Attendance Management"
        subtitle="Daily attendance capture and validation across all deployed shifts."
        action={
          <Button variant="ghost">
            <Download size={15} /> Export for Payroll
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Attendance Rate" value={`${rate}%`} />
        <StatCard label="Present Today" value={present.toString()} />
        <StatCard label="Absent" value={absent.toString()} />
        <StatCard label="Late Arrivals" value={late.toString()} />
      </div>

      <Toolbar>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search guard or site..." />
        <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={["All Status", "Present", "Absent", "Late", "Half Day", "On Leave"]} />
        <span className="ml-auto text-xs text-ink-400">{filtered.length} results</span>
      </Toolbar>

      <div className="rounded-xl border border-ink-100 bg-white p-2 shadow-[var(--shadow-card)]">
        <Table head={["Date", "Employee", "Site", "Shift", "Check-in", "Check-out", "OT Hrs", "Status"]}>
          {paged.length === 0 && (
            <tr>
              <td colSpan={8}>
                <EmptyState text="No attendance records match your filters." />
              </td>
            </tr>
          )}
          {paged.map((a) => (
            <tr key={a.id} className="hover:bg-ink-50">
              <td className="px-3 py-2.5 text-ink-700">{a.date}</td>
              <td className="px-3 py-2.5 font-medium text-navy-900">{a.employeeName}</td>
              <td className="px-3 py-2.5 text-ink-600">{a.siteName}</td>
              <td className="px-3 py-2.5 text-ink-500">{a.shift}</td>
              <td className="px-3 py-2.5 text-ink-700">{a.checkIn ?? "—"}</td>
              <td className="px-3 py-2.5 text-ink-700">{a.checkOut ?? "—"}</td>
              <td className="px-3 py-2.5 text-ink-700">{a.overtimeHrs || "—"}</td>
              <td className="px-3 py-2.5">
                <Badge>{a.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
