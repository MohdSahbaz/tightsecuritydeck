import { useMemo, useState, type FormEvent } from "react";
import { X, Phone, Mail, MapPin, Star, Download, Plus } from "lucide-react";
import { PageHeader, Toolbar, SearchInput, Select, Table, Badge, Avatar, Button, Pagination, EmptyState, Modal, Field, Input, NativeSelect, FormGrid, FormActions } from "../components/ui";
import { employees as initialEmployees, localDateStr } from "../lib/mockData";
import type { Employee } from "../lib/types";

const PAGE_SIZE = 10;

export default function Workforce() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [designation, setDesignation] = useState("All Roles");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesQuery =
        e.name.toLowerCase().includes(query.toLowerCase()) || e.empId.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "All Status" || e.status === status;
      const matchesRole = designation === "All Roles" || e.designation === designation;
      return matchesQuery && matchesStatus && matchesRole;
    });
  }, [employees, query, status, designation]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Workforce & Guard Master"
        subtitle={`${employees.length} employee & guard records across all branches`}
        action={
          <div className="flex gap-2">
            <Button variant="ghost">
              <Download size={15} /> Export
            </Button>
            <Button variant="secondary" onClick={() => setShowAdd(true)}>
              <Plus size={15} /> Add Employee
            </Button>
          </div>
        }
      />

      <Toolbar>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search by name or employee ID..." />
        <Select value={designation} onChange={(v) => { setDesignation(v); setPage(1); }} options={["All Roles", "Security Guard", "Site Supervisor", "Shift Commander", "Operations Staff", "K9 Handler"]} />
        <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={["All Status", "Active", "On Leave", "Inactive", "Suspended"]} />
        <span className="ml-auto text-xs text-ink-400">{filtered.length} results</span>
      </Toolbar>

      <div className="rounded-xl border border-ink-100 bg-white p-2 shadow-[var(--shadow-card)]">
        <Table head={["Employee", "Role", "Branch", "Contact", "Status", "Rating", ""]}>
          {paged.length === 0 && (
            <tr>
              <td colSpan={7}>
                <EmptyState text="No employees match your filters." />
              </td>
            </tr>
          )}
          {paged.map((e) => (
            <tr key={e.id} className="cursor-pointer hover:bg-ink-50" onClick={() => setSelected(e)}>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar src={e.photo} name={e.name} />
                  <div>
                    <p className="font-medium text-navy-900">{e.name}</p>
                    <p className="text-xs text-ink-400">{e.empId}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2.5 text-ink-700">{e.designation}</td>
              <td className="px-3 py-2.5 text-ink-700">{e.branch}</td>
              <td className="px-3 py-2.5 text-ink-500">{e.phone}</td>
              <td className="px-3 py-2.5">
                <Badge>{e.status}</Badge>
              </td>
              <td className="px-3 py-2.5">
                <span className="flex items-center gap-1 text-ink-700">
                  <Star size={13} className="fill-gold-400 text-gold-400" /> {e.rating}
                </span>
              </td>
              <td className="px-3 py-2.5 text-right text-xs font-semibold text-navy-700">View &rarr;</td>
            </tr>
          ))}
        </Table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      {selected && <EmployeeDrawer employee={selected} onClose={() => setSelected(null)} />}

      {showAdd && (
        <AddEmployeeModal
          onClose={() => setShowAdd(false)}
          onAdd={(emp) => {
            setEmployees((list) => [emp, ...list]);
            setShowAdd(false);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

function AddEmployeeModal({ onClose, onAdd }: { onClose: () => void; onAdd: (e: Employee) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "New Employee");
    const idSuffix = Math.floor(1000 + Math.random() * 9000);
    const employee: Employee = {
      id: `EMP-NEW-${idSuffix}`,
      empId: `TSL-${idSuffix}`,
      name,
      photo: `https://i.pravatar.cc/100?img=${idSuffix % 70}`,
      designation: data.get("designation") as Employee["designation"],
      department: String(data.get("department")),
      branch: String(data.get("branch")),
      phone: String(data.get("phone")),
      email: String(data.get("email")),
      gender: data.get("gender") as Employee["gender"],
      joinDate: localDateStr(),
      status: data.get("status") as Employee["status"],
      currentSite: null,
      rating: 4,
      experienceYears: 0,
      idNumber: `CM${Math.floor(70000000 + Math.random() * 20000000)}A${idSuffix % 90}`,
    };
    onAdd(employee);
  }

  return (
    <Modal title="Add Employee" subtitle="Create a new workforce record" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Full Name">
            <Input name="name" defaultValue="Nakato Sarah" required />
          </Field>
          <Field label="Phone Number">
            <Input name="phone" defaultValue="+256 700 123 456" />
          </Field>
          <Field label="Email" span>
            <Input name="email" type="email" defaultValue="new.employee@tightsecurity.co.ug" />
          </Field>
          <Field label="Designation">
            <NativeSelect
              name="designation"
              defaultValue="Security Guard"
              options={["Security Guard", "Site Supervisor", "Shift Commander", "Operations Staff", "K9 Handler"]}
            />
          </Field>
          <Field label="Branch">
            <NativeSelect
              name="branch"
              defaultValue="Kampala HQ"
              options={["Kampala HQ", "Entebbe Branch", "Jinja Branch", "Mbarara Branch"]}
            />
          </Field>
          <Field label="Department">
            <Input name="department" defaultValue="Guarding Operations" />
          </Field>
          <Field label="Gender">
            <NativeSelect name="gender" defaultValue="Female" options={["Male", "Female"]} />
          </Field>
          <Field label="Status">
            <NativeSelect name="status" defaultValue="Active" options={["Active", "On Leave", "Inactive", "Suspended"]} />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Add Employee" />
      </form>
    </Modal>
  );
}

function EmployeeDrawer({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-navy-900">Employee Profile</h3>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-ink-50">
            <X size={18} className="text-ink-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-3">
            <Avatar src={employee.photo} name={employee.name} size={56} />
            <div>
              <p className="text-lg font-bold text-navy-900">{employee.name}</p>
              <p className="text-sm text-ink-500">{employee.designation}</p>
              <div className="mt-1">
                <Badge>{employee.status}</Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2.5 text-ink-700">
              <Phone size={15} className="text-ink-400" /> {employee.phone}
            </div>
            <div className="flex items-center gap-2.5 text-ink-700">
              <Mail size={15} className="text-ink-400" /> {employee.email}
            </div>
            <div className="flex items-center gap-2.5 text-ink-700">
              <MapPin size={15} className="text-ink-400" /> {employee.branch}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ["Employee ID", employee.empId],
              ["Department", employee.department],
              ["Join Date", employee.joinDate],
              ["Experience", `${employee.experienceYears} yrs`],
              ["Gender", employee.gender],
              ["National ID", employee.idNumber],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-ink-50 px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-ink-400">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-navy-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Performance Rating</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.round(employee.rating) ? "fill-gold-400 text-gold-400" : "text-ink-200"}
                />
              ))}
              <span className="ml-2 text-sm font-semibold text-navy-900">{employee.rating}/5</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 border-t border-ink-100 px-5 py-4">
          <Button variant="ghost" className="flex-1 justify-center">Edit Record</Button>
          <Button variant="primary" className="flex-1 justify-center">View Deployment</Button>
        </div>
      </div>
    </div>
  );
}
