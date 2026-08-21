import { useState, type FormEvent } from "react";
import { Building, Users, Clock, Bell, Save } from "lucide-react";
import { PageHeader, SectionCard, Button, Badge, Modal, Field, Input, FormGrid, FormActions } from "../components/ui";
import logo from "../assets/logo.png";

type Branch = { name: string; address: string; employees: number; status: string };
type ShiftTemplate = { name: string; time: string; break: string };

const initialBranches: Branch[] = [
  { name: "Kampala HQ", address: "Plot 14, Nakasero Rd, Kampala", employees: 28, status: "Active" },
  { name: "Entebbe Branch", address: "Kitoro Rd, Entebbe", employees: 14, status: "Active" },
  { name: "Jinja Branch", address: "Main Street, Jinja", employees: 11, status: "Active" },
  { name: "Mbarara Branch", address: "High Street, Mbarara", employees: 9, status: "Active" },
];

const initialDepartments = ["Guarding Operations", "K9 Unit", "Control Room", "Client Relations", "Administration", "Finance & Accounts", "Human Resources"];

const initialShiftTemplates: ShiftTemplate[] = [
  { name: "Day Shift", time: "07:00 - 19:00", break: "1 hr" },
  { name: "Night Shift", time: "19:00 - 07:00", break: "1 hr" },
  { name: "General Shift", time: "09:00 - 17:00", break: "45 min" },
];

const tabs = ["Organisation", "Branches", "Departments", "Shift Templates", "Notifications"] as const;

export default function Settings() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Organisation");
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [departments, setDepartments] = useState<string[]>(initialDepartments);
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>(initialShiftTemplates);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);

  return (
    <div>
      <PageHeader title="System Settings" subtitle="Organisation profile, branches, departments and platform configuration." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                t === tab
                  ? "block w-full rounded-lg bg-navy-900 px-3.5 py-2.5 text-left text-sm font-semibold text-white"
                  : "block w-full rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-ink-600 hover:bg-ink-100"
              }
            >
              {t}
            </button>
          ))}
        </nav>

        <div>
          {tab === "Organisation" && (
            <SectionCard title="Organisation Profile">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-white p-2 ring-1 ring-ink-100">
                  <img src={logo} alt="Tight Security" className="h-12 w-auto object-contain" />
                </div>
                <Button variant="ghost">Change Logo</Button>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["Company Name", "Tight Security Ltd."],
                  ["Registration No.", "UG-SEC-2014-00291"],
                  ["Contact Number", "+256 724 076 324"],
                  ["Email", "info@tightsecurity.co.ug"],
                  ["Country", "Uganda"],
                  ["Head Office", "Kampala, Uganda"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label className="mb-1.5 block text-xs font-semibold text-ink-700">{label}</label>
                    <input
                      defaultValue={value}
                      className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
                    />
                  </div>
                ))}
              </div>
              <Button className="mt-5">
                <Save size={15} /> Save Changes
              </Button>
            </SectionCard>
          )}

          {tab === "Branches" && (
            <SectionCard
              title="Branches"
              action={
                <Button variant="secondary" onClick={() => setShowAddBranch(true)}>
                  <Building size={14} /> Add Branch
                </Button>
              }
            >
              <div className="space-y-3">
                {branches.map((b) => (
                  <div key={b.name} className="flex items-center justify-between rounded-lg border border-ink-100 p-4">
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{b.name}</p>
                      <p className="text-xs text-ink-500">{b.address}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-ink-500">{b.employees} employees</span>
                      <Badge>{b.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {tab === "Departments" && (
            <SectionCard
              title="Departments"
              action={
                <Button variant="secondary" onClick={() => setShowAddDept(true)}>
                  <Users size={14} /> Add Department
                </Button>
              }
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {departments.map((d) => (
                  <div key={d} className="flex items-center justify-between rounded-lg border border-ink-100 px-4 py-3">
                    <span className="text-sm font-medium text-navy-900">{d}</span>
                    <Badge>Active</Badge>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {tab === "Shift Templates" && (
            <SectionCard
              title="Shift Templates"
              action={
                <Button variant="secondary" onClick={() => setShowAddShift(true)}>
                  <Clock size={14} /> Add Shift
                </Button>
              }
            >
              <div className="space-y-3">
                {shiftTemplates.map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-lg border border-ink-100 p-4">
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{s.name}</p>
                      <p className="text-xs text-ink-500">{s.time}</p>
                    </div>
                    <span className="text-xs text-ink-500">Break: {s.break}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {tab === "Notifications" && (
            <SectionCard title="Notification Preferences">
              <div className="space-y-3">
                {[
                  "Contract expiry reminders",
                  "Leave approval alerts",
                  "Overdue invoice notifications",
                  "Low inventory alerts",
                  "Roster publish confirmations",
                ].map((n) => (
                  <label key={n} className="flex items-center justify-between rounded-lg border border-ink-100 px-4 py-3">
                    <span className="flex items-center gap-2.5 text-sm text-navy-900">
                      <Bell size={15} className="text-ink-400" /> {n}
                    </span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-ink-300" />
                  </label>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {showAddBranch && (
        <AddBranchModal
          onClose={() => setShowAddBranch(false)}
          onAdd={(b) => {
            setBranches((list) => [...list, b]);
            setShowAddBranch(false);
          }}
        />
      )}

      {showAddDept && (
        <AddDepartmentModal
          onClose={() => setShowAddDept(false)}
          onAdd={(d) => {
            setDepartments((list) => [...list, d]);
            setShowAddDept(false);
          }}
        />
      )}

      {showAddShift && (
        <AddShiftModal
          onClose={() => setShowAddShift(false)}
          onAdd={(s) => {
            setShiftTemplates((list) => [...list, s]);
            setShowAddShift(false);
          }}
        />
      )}
    </div>
  );
}

function AddBranchModal({ onClose, onAdd }: { onClose: () => void; onAdd: (b: Branch) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onAdd({
      name: String(data.get("name") || "New Branch"),
      address: String(data.get("address")),
      employees: 0,
      status: "Active",
    });
  }

  return (
    <Modal title="Add Branch" subtitle="Register a new operating branch" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Branch Name" span>
            <Input name="name" defaultValue="Gulu Branch" required />
          </Field>
          <Field label="Address" span>
            <Input name="address" defaultValue="Main Street, Gulu" />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Add Branch" />
      </form>
    </Modal>
  );
}

function AddDepartmentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (d: string) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onAdd(String(data.get("name") || "New Department"));
  }

  return (
    <Modal title="Add Department" subtitle="Create a new operational department" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Field label="Department Name">
          <Input name="name" defaultValue="Fleet & Logistics" required />
        </Field>
        <FormActions onCancel={onClose} submitLabel="Add Department" />
      </form>
    </Modal>
  );
}

function AddShiftModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: ShiftTemplate) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const start = String(data.get("start"));
    const end = String(data.get("end"));
    onAdd({
      name: String(data.get("name") || "New Shift"),
      time: `${start} - ${end}`,
      break: String(data.get("break")),
    });
  }

  return (
    <Modal title="Add Shift Template" subtitle="Define a new working schedule" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Shift Name" span>
            <Input name="name" defaultValue="Weekend Shift" required />
          </Field>
          <Field label="Start Time">
            <Input name="start" type="time" defaultValue="08:00" />
          </Field>
          <Field label="End Time">
            <Input name="end" type="time" defaultValue="20:00" />
          </Field>
          <Field label="Break Duration" span>
            <Input name="break" defaultValue="1 hr" />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Add Shift" />
      </form>
    </Modal>
  );
}
