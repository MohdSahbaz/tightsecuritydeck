import { useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { PageHeader, Toolbar, SearchInput, Select, Table, Badge, Button, Pagination, EmptyState, StatCard, Modal, Field, Input, NativeSelect, FormGrid, FormActions } from "../components/ui";
import { vacancies as initialVacancies, candidates as initialCandidates, localDateStr } from "../lib/mockData";
import type { Vacancy, Candidate } from "../lib/types";

const PAGE_SIZE = 10;
const positions = ["Security Guard", "Site Supervisor", "Shift Commander", "K9 Handler", "Control Room Operator", "Operations Staff"];
const departments = ["Guarding Operations", "K9 Unit", "Control Room", "Client Relations", "Administration"];
const branches = ["Kampala HQ", "Entebbe Branch", "Jinja Branch", "Mbarara Branch"];
const stages: Candidate["stage"][] = ["Applied", "Shortlisted", "Interview Scheduled", "Interviewed", "Offered", "Hired", "Rejected"];

export default function Recruitment() {
  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacancies);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [tab, setTab] = useState<"vacancies" | "candidates">("vacancies");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const filteredVacancies = useMemo(
    () =>
      vacancies.filter(
        (v) =>
          (status === "All Status" || v.status === status) &&
          (v.position.toLowerCase().includes(query.toLowerCase()) || v.branch.toLowerCase().includes(query.toLowerCase()))
      ),
    [vacancies, query, status]
  );
  const filteredCandidates = useMemo(
    () =>
      candidates.filter(
        (c) =>
          (status === "All Status" || c.stage === status) &&
          (c.name.toLowerCase().includes(query.toLowerCase()) || c.appliedFor.toLowerCase().includes(query.toLowerCase()))
      ),
    [candidates, query, status]
  );

  const list = tab === "vacancies" ? filteredVacancies : filteredCandidates;
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const statusOptions = tab === "vacancies" ? ["All Status", "Open", "On Hold", "Closed", "Filled"] : ["All Status", ...stages];

  const openVacancies = vacancies.filter((v) => v.status === "Open").length;
  const totalApplicants = candidates.length;
  const interviews = candidates.filter((c) => c.stage === "Interview Scheduled").length;
  const hired = candidates.filter((c) => c.stage === "Hired").length;

  return (
    <div>
      <PageHeader
        title="Recruitment & Candidate Management"
        subtitle="Vacancy creation, candidate pipeline and hiring progress."
        action={
          <Button variant="secondary" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> {tab === "vacancies" ? "Add Vacancy" : "Add Candidate"}
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard tone="navy" label="Open Vacancies" value={openVacancies.toString()} />
        <StatCard label="Total Applicants" value={totalApplicants.toString()} />
        <StatCard label="Interviews Scheduled" value={interviews.toString()} />
        <StatCard label="Hired" value={hired.toString()} />
      </div>

      <div className="mb-4 inline-flex rounded-lg bg-ink-100 p-1 text-sm">
        {(["vacancies", "candidates"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(1); setStatus("All Status"); }}
            className={
              tab === t
                ? "rounded-md bg-white px-4 py-1.5 font-semibold text-navy-900 shadow-sm"
                : "rounded-md px-4 py-1.5 font-medium text-ink-500"
            }
          >
            {t === "vacancies" ? "Open Positions" : "Candidate Pipeline"}
          </button>
        ))}
      </div>

      <Toolbar>
        <SearchInput
          value={query}
          onChange={(v) => { setQuery(v); setPage(1); }}
          placeholder={tab === "vacancies" ? "Search position or branch..." : "Search candidate or position..."}
        />
        <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={statusOptions} />
        <span className="ml-auto text-xs text-ink-400">{list.length} results</span>
      </Toolbar>

      <div className="rounded-xl border border-ink-100 bg-white p-2 shadow-[var(--shadow-card)]">
        {tab === "vacancies" ? (
          <Table head={["Position", "Department", "Branch", "Openings", "Applicants", "Posted", "Closing", "Status"]}>
            {filteredVacancies.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <EmptyState text="No vacancies match your search." />
                </td>
              </tr>
            )}
            {filteredVacancies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((v) => (
              <tr key={v.id} className="hover:bg-ink-50">
                <td className="px-3 py-2.5 font-medium text-navy-900">{v.position}</td>
                <td className="px-3 py-2.5 text-ink-600">{v.department}</td>
                <td className="px-3 py-2.5 text-ink-500">{v.branch}</td>
                <td className="px-3 py-2.5 text-ink-700">{v.openings}</td>
                <td className="px-3 py-2.5 text-ink-700">{v.applicants}</td>
                <td className="px-3 py-2.5 text-ink-500">{v.postedDate}</td>
                <td className="px-3 py-2.5 text-ink-500">{v.closingDate}</td>
                <td className="px-3 py-2.5">
                  <Badge>{v.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Table head={["Candidate", "Applied For", "Source", "Experience", "Applied On", "Contact", "Stage"]}>
            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState text="No candidates match your search." />
                </td>
              </tr>
            )}
            {filteredCandidates.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((c) => (
              <tr key={c.id} className="hover:bg-ink-50">
                <td className="px-3 py-2.5 font-medium text-navy-900">{c.name}</td>
                <td className="px-3 py-2.5 text-ink-600">{c.appliedFor}</td>
                <td className="px-3 py-2.5 text-ink-500">{c.source}</td>
                <td className="px-3 py-2.5 text-ink-700">{c.experienceYears} yrs</td>
                <td className="px-3 py-2.5 text-ink-500">{c.appliedDate}</td>
                <td className="px-3 py-2.5 text-ink-500">{c.phone}</td>
                <td className="px-3 py-2.5">
                  <Badge>{c.stage}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      {showAdd && tab === "vacancies" && (
        <AddVacancyModal
          onClose={() => setShowAdd(false)}
          onAdd={(v) => {
            setVacancies((list) => [v, ...list]);
            setShowAdd(false);
            setPage(1);
          }}
        />
      )}

      {showAdd && tab === "candidates" && (
        <AddCandidateModal
          onClose={() => setShowAdd(false)}
          onAdd={(c) => {
            setCandidates((list) => [c, ...list]);
            setShowAdd(false);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

function AddVacancyModal({ onClose, onAdd }: { onClose: () => void; onAdd: (v: Vacancy) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const vacancy: Vacancy = {
      id: `VAC-NEW-${Date.now()}`,
      position: String(data.get("position")),
      department: String(data.get("department")),
      branch: String(data.get("branch")),
      openings: Number(data.get("openings")) || 1,
      applicants: 0,
      status: "Open",
      postedDate: localDateStr(),
      closingDate: String(data.get("closingDate")),
    };
    onAdd(vacancy);
  }

  const closingDefault = localDateStr(21 * 86400000);

  return (
    <Modal title="Add Vacancy" subtitle="Create a new manpower requirement" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Position">
            <NativeSelect name="position" defaultValue={positions[0]} options={positions} />
          </Field>
          <Field label="Openings">
            <Input name="openings" type="number" min={1} defaultValue={2} />
          </Field>
          <Field label="Department">
            <NativeSelect name="department" defaultValue={departments[0]} options={departments} />
          </Field>
          <Field label="Branch">
            <NativeSelect name="branch" defaultValue={branches[0]} options={branches} />
          </Field>
          <Field label="Closing Date" span>
            <Input name="closingDate" type="date" defaultValue={closingDefault} />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Add Vacancy" />
      </form>
    </Modal>
  );
}

function AddCandidateModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Candidate) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const candidate: Candidate = {
      id: `CAN-NEW-${Date.now()}`,
      name: String(data.get("name") || "New Candidate"),
      vacancyId: "",
      appliedFor: String(data.get("appliedFor")),
      phone: String(data.get("phone")),
      email: String(data.get("email")),
      experienceYears: Number(data.get("experienceYears")) || 0,
      source: data.get("source") as Candidate["source"],
      stage: "Applied",
      appliedDate: localDateStr(),
      interviewDate: null,
    };
    onAdd(candidate);
  }

  return (
    <Modal title="Add Candidate" subtitle="Record a new job applicant" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Full Name" span>
            <Input name="name" defaultValue="Namubiru Doreen" required />
          </Field>
          <Field label="Applied For">
            <NativeSelect name="appliedFor" defaultValue={positions[0]} options={positions} />
          </Field>
          <Field label="Source">
            <NativeSelect name="source" defaultValue="Online Portal" options={["Walk-in", "Referral", "Online Portal", "Recruitment Agency"]} />
          </Field>
          <Field label="Phone Number">
            <Input name="phone" defaultValue="+256 702 556 810" />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" defaultValue="candidate@gmail.com" />
          </Field>
          <Field label="Experience (years)" span>
            <Input name="experienceYears" type="number" min={0} defaultValue={2} />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Add Candidate" />
      </form>
    </Modal>
  );
}
