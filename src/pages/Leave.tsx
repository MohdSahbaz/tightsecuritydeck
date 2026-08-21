import { useMemo, useState, type FormEvent } from "react";
import { Plus, Check, X as XIcon } from "lucide-react";
import { PageHeader, Toolbar, SearchInput, Select, Table, Badge, Button, Avatar, Pagination, EmptyState, StatCard, Modal, Field, Input, NativeSelect, FormGrid, FormActions } from "../components/ui";
import { leaveRequests as initialLeaveRequests, employees, localDateStr } from "../lib/mockData";
import type { LeaveRequest } from "../lib/types";

const PAGE_SIZE = 10;

export default function Leave() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(
    () =>
      leaveRequests.filter(
        (l) => (status === "All Status" || l.status === status) && l.employeeName.toLowerCase().includes(query.toLowerCase())
      ),
    [leaveRequests, query, status]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pending = leaveRequests.filter((l) => l.status === "Pending").length;
  const approved = leaveRequests.filter((l) => l.status === "Approved").length;
  const rejected = leaveRequests.filter((l) => l.status === "Rejected").length;

  function setRequestStatus(id: string, next: LeaveRequest["status"]) {
    setLeaveRequests((list) => list.map((l) => (l.id === id ? { ...l, status: next } : l)));
  }

  return (
    <div>
      <PageHeader
        title="Leave Management"
        subtitle="Applications, approvals and balances across the workforce."
        action={
          <Button variant="secondary" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Apply Leave
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Requests" value={leaveRequests.length.toString()} />
        <StatCard label="Pending" value={pending.toString()} />
        <StatCard label="Approved" value={approved.toString()} />
        <StatCard label="Rejected" value={rejected.toString()} />
      </div>

      <Toolbar>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search employee..." />
        <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={["All Status", "Pending", "Approved", "Rejected"]} />
        <span className="ml-auto text-xs text-ink-400">{filtered.length} results</span>
      </Toolbar>

      <div className="rounded-xl border border-ink-100 bg-white p-2 shadow-[var(--shadow-card)]">
        <Table head={["Employee", "Type", "From", "To", "Days", "Reason", "Status", ""]}>
          {paged.length === 0 && (
            <tr>
              <td colSpan={8}>
                <EmptyState text="No leave requests match your filters." />
              </td>
            </tr>
          )}
          {paged.map((l) => (
            <tr key={l.id} className="hover:bg-ink-50">
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar name={l.employeeName} size={28} />
                  <span className="font-medium text-navy-900">{l.employeeName}</span>
                </div>
              </td>
              <td className="px-3 py-2.5 text-ink-700">{l.type}</td>
              <td className="px-3 py-2.5 text-ink-500">{l.from}</td>
              <td className="px-3 py-2.5 text-ink-500">{l.to}</td>
              <td className="px-3 py-2.5 text-ink-700">{l.days}</td>
              <td className="px-3 py-2.5 max-w-[180px] truncate text-ink-500">{l.reason}</td>
              <td className="px-3 py-2.5">
                <Badge>{l.status}</Badge>
              </td>
              <td className="px-3 py-2.5">
                {l.status === "Pending" ? (
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => setRequestStatus(l.id, "Approved")}
                      className="rounded-md bg-emerald-50 p-1.5 text-emerald-600 hover:bg-emerald-100"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={() => setRequestStatus(l.id, "Rejected")}
                      className="rounded-md bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100"
                    >
                      <XIcon size={13} />
                    </button>
                  </div>
                ) : (
                  <span />
                )}
              </td>
            </tr>
          ))}
        </Table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      {showAdd && (
        <AddLeaveModal
          onClose={() => setShowAdd(false)}
          onAdd={(req) => {
            setLeaveRequests((list) => [req, ...list]);
            setShowAdd(false);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

function AddLeaveModal({ onClose, onAdd }: { onClose: () => void; onAdd: (l: LeaveRequest) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const from = String(data.get("from"));
    const to = String(data.get("to"));
    const days = Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1);
    const employee = employees.find((e) => e.empId === data.get("employeeEmpId")) ?? employees[0];
    const request: LeaveRequest = {
      id: `LV-NEW-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      type: data.get("type") as LeaveRequest["type"],
      from,
      to,
      days,
      status: "Pending",
      reason: String(data.get("reason")),
      appliedOn: localDateStr(),
    };
    onAdd(request);
  }

  const today = localDateStr();

  return (
    <Modal title="Apply Leave" subtitle="Submit a new leave request" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Employee" span>
            <NativeSelect
              name="employeeEmpId"
              defaultValue={employees[0]?.empId}
              entries={employees.map((e) => ({ value: e.empId, label: `${e.name} (${e.empId})` }))}
            />
          </Field>
          <Field label="Leave Type">
            <NativeSelect name="type" defaultValue="Annual" options={["Annual", "Sick", "Emergency", "Unpaid"]} />
          </Field>
          <Field label="Reason">
            <Input name="reason" defaultValue="Family function" />
          </Field>
          <Field label="From">
            <Input name="from" type="date" defaultValue={today} required />
          </Field>
          <Field label="To">
            <Input name="to" type="date" defaultValue={today} required />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Submit Request" />
      </form>
    </Modal>
  );
}
