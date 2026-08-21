import { useMemo, useState, type FormEvent } from "react";
import { Plus, CalendarDays, List, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { PageHeader, Toolbar, SearchInput, Select, Table, Badge, Button, Pagination, EmptyState, StatCard, Modal, Field, NativeSelect, FormGrid, FormActions, Input } from "../components/ui";
import { roster as initialRoster, sites, employees, localDateStr } from "../lib/mockData";
import type { RosterEntry } from "../lib/types";

const PAGE_SIZE = 12;
const guardPool = employees.filter((e) => e.designation === "Security Guard" || e.designation === "Operations Staff");
const shiftOptions: RosterEntry["shift"][] = ["Day (07:00-19:00)", "Night (19:00-07:00)", "General (09:00-17:00)"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusDot: Record<RosterEntry["status"], string> = {
  Confirmed: "bg-emerald-500",
  Scheduled: "bg-sky-500",
  Vacant: "bg-rose-500",
  Replaced: "bg-violet-500",
};

function toDateKey(d: Date) {
  // Build the key from local date parts — toISOString() converts to UTC first,
  // which rolls local midnight back a day in any timezone ahead of UTC.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildMonthGrid(year: number, month: number) {
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function Roster() {
  const [roster, setRoster] = useState<RosterEntry[]>(initialRoster);
  const [query, setQuery] = useState("");
  const [shift, setShift] = useState("All Shifts");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");

  const filtered = useMemo(
    () =>
      roster.filter(
        (r) =>
          (shift === "All Shifts" || r.shift === shift) &&
          (status === "All Status" || r.status === status) &&
          (r.employeeName.toLowerCase().includes(query.toLowerCase()) || r.siteName.toLowerCase().includes(query.toLowerCase()))
      ),
    [roster, query, shift, status]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const vacant = roster.filter((r) => r.status === "Vacant").length;
  const confirmed = roster.filter((r) => r.status === "Confirmed").length;

  return (
    <div>
      <PageHeader
        title="Roster & Schedule Planning"
        subtitle={`${sites.length} sites · ${roster.length} shift assignments this window`}
        action={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setView((v) => (v === "list" ? "calendar" : "list"))}>
              {view === "list" ? (
                <>
                  <CalendarDays size={15} /> Calendar View
                </>
              ) : (
                <>
                  <List size={15} /> List View
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={() => setShowAdd(true)}>
              <Plus size={15} /> Create Roster
            </Button>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Shifts" value={roster.length.toString()} />
        <StatCard label="Confirmed" value={confirmed.toString()} />
        <StatCard label="Vacant Shifts" value={vacant.toString()} />
        <StatCard label="Sites Covered" value={new Set(roster.map((r) => r.siteId)).size.toString()} />
      </div>

      <Toolbar>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search guard or site..." />
        <Select value={shift} onChange={(v) => { setShift(v); setPage(1); }} options={["All Shifts", "Day (07:00-19:00)", "Night (19:00-07:00)", "General (09:00-17:00)"]} />
        <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={["All Status", "Scheduled", "Confirmed", "Vacant", "Replaced"]} />
        <span className="ml-auto text-xs text-ink-400">{filtered.length} results</span>
      </Toolbar>

      {view === "list" ? (
        <div className="rounded-xl border border-ink-100 bg-white p-2 shadow-[var(--shadow-card)]">
          <Table head={["Date", "Guard", "Site", "Shift", "Status", ""]}>
            {paged.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState text="No roster entries match your filters." />
                </td>
              </tr>
            )}
            {paged.map((r) => (
              <tr key={r.id} className="hover:bg-ink-50">
                <td className="px-3 py-2.5 text-ink-700">{r.date}</td>
                <td className="px-3 py-2.5 font-medium text-navy-900">{r.status === "Vacant" ? <span className="text-ink-400">Unassigned</span> : r.employeeName}</td>
                <td className="px-3 py-2.5 text-ink-600">{r.siteName}</td>
                <td className="px-3 py-2.5 text-ink-500">{r.shift}</td>
                <td className="px-3 py-2.5">
                  <Badge>{r.status}</Badge>
                </td>
                <td className="px-3 py-2.5 text-right">
                  {r.status === "Vacant" ? (
                    <button className="text-xs font-semibold text-navy-700">Assign Guard</button>
                  ) : (
                    <button className="text-xs font-semibold text-ink-400">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      ) : (
        <RosterCalendar entries={filtered} />
      )}

      {showAdd && (
        <AddRosterModal
          onClose={() => setShowAdd(false)}
          onAdd={(entry) => {
            setRoster((list) => [entry, ...list]);
            setShowAdd(false);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

function RosterCalendar({ entries }: { entries: RosterEntry[] }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [dayDetail, setDayDetail] = useState<{ date: string; items: RosterEntry[] } | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, RosterEntry[]>();
    entries.forEach((e) => {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [entries]);

  const cells = useMemo(() => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const todayKey = toDateKey(new Date());
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-navy-900">{monthLabel}</h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="rounded-md border border-ink-200 p-1.5 hover:bg-ink-50"
          >
            <ChevronLeft size={15} className="text-ink-500" />
          </button>
          <button
            onClick={() => {
              const d = new Date();
              setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
            }}
            className="rounded-md border border-ink-200 px-2.5 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-50"
          >
            Today
          </button>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="rounded-md border border-ink-200 p-1.5 hover:bg-ink-50"
          >
            <ChevronRight size={15} className="text-ink-500" />
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-ink-500">
        {(Object.keys(statusDot) as RosterEntry["status"][]).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={clsx("h-2 w-2 rounded-full", statusDot[s])} /> {s}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-ink-100 bg-ink-100 text-xs">
        {WEEKDAYS.map((w) => (
          <div key={w} className="bg-ink-50 px-2 py-2 text-center font-semibold uppercase tracking-wide text-ink-400">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          const isChecker = (Math.floor(i / 7) + (i % 7)) % 2 === 0;
          if (!d) return <div key={i} className={clsx("min-h-[112px]", isChecker ? "bg-gold-400/10" : "bg-navy-950/[0.04]")} />;
          const key = toDateKey(d);
          const items = byDate.get(key) ?? [];
          const isToday = key === todayKey;
          return (
            <button
              key={i}
              type="button"
              onClick={() => items.length > 0 && setDayDetail({ date: key, items })}
              className={clsx(
                "flex min-h-[112px] flex-col items-stretch gap-1 p-1.5 text-left align-top hover:brightness-95",
                isChecker ? "bg-gold-400/10" : "bg-navy-950/[0.04]",
                items.length === 0 && "cursor-default"
              )}
            >
              <span
                className={clsx(
                  "mb-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                  isToday ? "bg-navy-900 text-white ring-2 ring-gold-400" : "text-ink-500"
                )}
              >
                {d.getDate()}
              </span>
              <div className="space-y-1">
                {items.slice(0, 3).map((it) => (
                  <div key={it.id} className="flex items-center gap-1 truncate rounded bg-ink-50 px-1.5 py-1 text-[10.5px] text-ink-700">
                    <span className={clsx("h-1.5 w-1.5 shrink-0 rounded-full", statusDot[it.status])} />
                    <span className="truncate">{it.status === "Vacant" ? it.siteName : it.employeeName}</span>
                  </div>
                ))}
                {items.length > 3 && <div className="px-1.5 text-[10.5px] font-medium text-navy-700">+{items.length - 3} more</div>}
              </div>
            </button>
          );
        })}
      </div>

      {dayDetail && (
        <Modal
          title={dayDetail.date}
          subtitle={`${dayDetail.items.length} shift${dayDetail.items.length === 1 ? "" : "s"} scheduled`}
          onClose={() => setDayDetail(null)}
        >
          <div className="space-y-2">
            {dayDetail.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-navy-900">
                    {it.status === "Vacant" ? <span className="text-ink-400">Unassigned</span> : it.employeeName}
                  </p>
                  <p className="text-xs text-ink-500">
                    {it.siteName} &middot; {it.shift}
                  </p>
                </div>
                <Badge>{it.status}</Badge>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function AddRosterModal({ onClose, onAdd }: { onClose: () => void; onAdd: (r: RosterEntry) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const siteName = String(data.get("siteName"));
    const site = sites.find((s) => s.name === siteName);
    const guard = guardPool.find((g) => g.empId === data.get("guardEmpId")) ?? guardPool[0];
    const entry: RosterEntry = {
      id: `ROS-NEW-${Date.now()}`,
      date: String(data.get("date")),
      employeeId: guard.id,
      employeeName: guard.name,
      siteId: site?.id ?? sites[0].id,
      siteName,
      shift: data.get("shift") as RosterEntry["shift"],
      status: "Scheduled",
    };
    onAdd(entry);
  }

  const today = localDateStr();

  return (
    <Modal title="Create Roster Entry" subtitle="Assign a guard to a shift" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Date">
            <Input name="date" type="date" defaultValue={today} required />
          </Field>
          <Field label="Shift">
            <NativeSelect name="shift" defaultValue={shiftOptions[0]} options={shiftOptions} />
          </Field>
          <Field label="Guard" span>
            <NativeSelect
              name="guardEmpId"
              defaultValue={guardPool[0]?.empId}
              entries={guardPool.map((g) => ({ value: g.empId, label: `${g.name} (${g.empId})` }))}
            />
          </Field>
          <Field label="Site" span>
            <NativeSelect name="siteName" defaultValue={sites[0]?.name} options={sites.map((s) => s.name)} />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Create Roster Entry" />
      </form>
    </Modal>
  );
}
