import { useMemo, useState, type FormEvent } from "react";
import { Plus, Phone, Mail, Building2 } from "lucide-react";
import { PageHeader, Toolbar, SearchInput, Select, Badge, Button, Card, Pagination, EmptyState, Modal, Field, Input, NativeSelect, FormGrid, FormActions } from "../components/ui";
import { clients as initialClients, sites, currency } from "../lib/mockData";
import type { Client } from "../lib/types";

const PAGE_SIZE = 9;

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(
    () =>
      clients.filter(
        (c) =>
          (status === "All Status" || c.status === status) &&
          c.name.toLowerCase().includes(query.toLowerCase())
      ),
    [clients, query, status]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Clients & Contracts"
        subtitle={`${clients.length} clients · ${sites.length} active sites`}
        action={
          <Button variant="secondary" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Add Client
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search clients..." />
        <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={["All Status", "Active", "Inactive"]} />
        <span className="ml-auto text-xs text-ink-400">{filtered.length} results</span>
      </Toolbar>

      {paged.length === 0 ? (
        <Card className="p-2">
          <EmptyState text="No clients match your filters." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paged.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{c.name}</p>
                    <p className="text-xs text-ink-400">{c.category}</p>
                  </div>
                </div>
                <Badge>{c.status}</Badge>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-ink-500">
                <div className="flex items-center gap-2">
                  <Phone size={13} /> {c.phone}
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail size={13} /> {c.email}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-ink-100 pt-4 text-xs">
                <div>
                  <p className="text-ink-400">Sites</p>
                  <p className="font-semibold text-navy-900">{c.sitesCount}</p>
                </div>
                <div>
                  <p className="text-ink-400">Client Since</p>
                  <p className="font-semibold text-navy-900">{c.since}</p>
                </div>
                <div>
                  <p className="text-ink-400">Account Manager</p>
                  <p className="font-semibold text-navy-900">{c.accountManager}</p>
                </div>
                <div>
                  <p className="text-ink-400">Contract Value</p>
                  <p className="font-semibold text-navy-900">{currency(c.contractValue)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {showAdd && (
        <AddClientModal
          onClose={() => setShowAdd(false)}
          onAdd={(client) => {
            setClients((list) => [client, ...list]);
            setShowAdd(false);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

function AddClientModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Client) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "New Client");
    const client: Client = {
      id: `CLI-NEW-${Date.now()}`,
      name,
      category: String(data.get("category")),
      contactPerson: String(data.get("contactPerson")),
      phone: String(data.get("phone")),
      email: String(data.get("email")),
      sitesCount: Number(data.get("sitesCount")) || 1,
      status: data.get("status") as Client["status"],
      contractValue: Number(data.get("contractValue")) || 0,
      accountManager: String(data.get("accountManager")),
      since: String(new Date().getFullYear()),
    };
    onAdd(client);
  }

  return (
    <Modal title="Add Client" subtitle="Onboard a new client account" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Client / Company Name" span>
            <Input name="name" defaultValue="Kampala Trade Centre" required />
          </Field>
          <Field label="Category">
            <NativeSelect
              name="category"
              defaultValue="Corporate Offices"
              options={["Banking & Finance", "Retail & Malls", "Hospitality", "Manufacturing", "Education", "Corporate Offices", "Residential Estate"]}
            />
          </Field>
          <Field label="Account Manager">
            <Input name="accountManager" defaultValue="Lubega Frank" />
          </Field>
          <Field label="Contact Person">
            <Input name="contactPerson" defaultValue="Grace Namutebi" />
          </Field>
          <Field label="Phone Number">
            <Input name="phone" defaultValue="+256 701 445 220" />
          </Field>
          <Field label="Email" span>
            <Input name="email" type="email" defaultValue="ops@kampalatradecentre.com" />
          </Field>
          <Field label="Number of Sites">
            <Input name="sitesCount" type="number" min={1} defaultValue={1} />
          </Field>
          <Field label="Contract Value (UGX)">
            <Input name="contractValue" type="number" step={100000} defaultValue={35000000} />
          </Field>
          <Field label="Status">
            <NativeSelect name="status" defaultValue="Active" options={["Active", "Inactive"]} />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Add Client" />
      </form>
    </Modal>
  );
}
