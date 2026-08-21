import { useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { PageHeader, Toolbar, SearchInput, Select, Table, Badge, Button, Pagination, EmptyState, Modal, Field, Input, NativeSelect, FormGrid, FormActions } from "../components/ui";
import { sites as initialSites, clients } from "../lib/mockData";
import type { Site } from "../lib/types";

const PAGE_SIZE = 12;

export default function Sites() {
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(
    () =>
      sites.filter(
        (s) =>
          (status === "All Status" || s.status === status) &&
          (s.name.toLowerCase().includes(query.toLowerCase()) || s.clientName.toLowerCase().includes(query.toLowerCase()))
      ),
    [sites, query, status]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Sites & Security Posts"
        subtitle={`${sites.length} client sites under active management`}
        action={
          <Button variant="secondary" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Add Site
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search sites or clients..." />
        <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={["All Status", "Fully Staffed", "Understaffed", "Overstaffed"]} />
        <span className="ml-auto text-xs text-ink-400">{filtered.length} results</span>
      </Toolbar>

      <div className="rounded-xl border border-ink-100 bg-white p-2 shadow-[var(--shadow-card)]">
        <Table head={["Site", "Client", "Address", "Posts", "Guards Req.", "Deployed", "Supervisor", "Status"]}>
          {paged.length === 0 && (
            <tr>
              <td colSpan={8}>
                <EmptyState text="No sites match your filters." />
              </td>
            </tr>
          )}
          {paged.map((s) => (
            <tr key={s.id} className="hover:bg-ink-50">
              <td className="px-3 py-2.5 font-medium text-navy-900">{s.name}</td>
              <td className="px-3 py-2.5 text-ink-600">{s.clientName}</td>
              <td className="px-3 py-2.5 text-ink-500">{s.address}</td>
              <td className="px-3 py-2.5 text-ink-700">{s.posts}</td>
              <td className="px-3 py-2.5 text-ink-700">{s.guardsRequired}</td>
              <td className="px-3 py-2.5 text-ink-700">{s.guardsDeployed}</td>
              <td className="px-3 py-2.5 text-ink-600">{s.supervisor}</td>
              <td className="px-3 py-2.5">
                <Badge>{s.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      {showAdd && (
        <AddSiteModal
          onClose={() => setShowAdd(false)}
          onAdd={(site) => {
            setSites((list) => [site, ...list]);
            setShowAdd(false);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

function AddSiteModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Site) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const clientName = String(data.get("clientName"));
    const client = clients.find((c) => c.name === clientName);
    const guardsRequired = Number(data.get("guardsRequired")) || 1;
    const guardsDeployed = Number(data.get("guardsDeployed")) || 0;
    const site: Site = {
      id: `SITE-NEW-${Date.now()}`,
      name: String(data.get("name") || "New Site"),
      clientId: client?.id ?? "CLI-1",
      clientName,
      address: String(data.get("address")),
      posts: Number(data.get("posts")) || 1,
      guardsRequired,
      guardsDeployed,
      supervisor: String(data.get("supervisor")),
      status: guardsDeployed < guardsRequired ? "Understaffed" : guardsDeployed > guardsRequired ? "Overstaffed" : "Fully Staffed",
      shiftPattern: String(data.get("shiftPattern")),
    };
    onAdd(site);
  }

  return (
    <Modal title="Add Site" subtitle="Register a new client site" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Site Name" span>
            <Input name="name" defaultValue="Northgate Business Park - Gate 1" required />
          </Field>
          <Field label="Client">
            <NativeSelect name="clientName" defaultValue={clients[0]?.name} options={clients.map((c) => c.name)} />
          </Field>
          <Field label="Supervisor">
            <Input name="supervisor" defaultValue="Okello Brian" />
          </Field>
          <Field label="Address" span>
            <Input name="address" defaultValue="Lugogo Rd, Kampala" />
          </Field>
          <Field label="Security Posts">
            <Input name="posts" type="number" min={1} defaultValue={2} />
          </Field>
          <Field label="Shift Pattern">
            <NativeSelect name="shiftPattern" defaultValue="Day/Night 12hr" options={["Day/Night 12hr", "3-Shift Rotation", "General Shift"]} />
          </Field>
          <Field label="Guards Required">
            <Input name="guardsRequired" type="number" min={1} defaultValue={8} />
          </Field>
          <Field label="Guards Deployed">
            <Input name="guardsDeployed" type="number" min={0} defaultValue={0} />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Add Site" />
      </form>
    </Modal>
  );
}
