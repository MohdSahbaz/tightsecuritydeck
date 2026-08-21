import { useMemo, useState, type FormEvent } from "react";
import { Plus, Download, FileText } from "lucide-react";
import { PageHeader, Toolbar, SearchInput, Select, Table, Badge, Button, Pagination, EmptyState, StatCard, SectionCard, Modal, Field, Input, NativeSelect, FormGrid, FormActions } from "../components/ui";
import { invoices as initialInvoices, clients, sites, currency, localDateStr } from "../lib/mockData";
import type { Invoice } from "../lib/types";

const PAGE_SIZE = 10;

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [tab, setTab] = useState<"invoices" | "receivables">("invoices");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(
    () =>
      invoices.filter(
        (i) =>
          (status === "All Status" || i.status === status) &&
          (i.clientName.toLowerCase().includes(query.toLowerCase()) || i.invoiceNo.toLowerCase().includes(query.toLowerCase()))
      ),
    [invoices, query, status]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRevenue = invoices.reduce((sum, i) => sum + i.total, 0);
  const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((sum, i) => sum + i.total, 0);
  const overdue = invoices.filter((i) => i.status === "Overdue");

  const agingBuckets = [
    { label: "0-30 days", value: outstanding * 0.42 },
    { label: "31-60 days", value: outstanding * 0.28 },
    { label: "61-90 days", value: outstanding * 0.18 },
    { label: "90+ days", value: outstanding * 0.12 },
  ];

  return (
    <div>
      <PageHeader
        title="Billing & Receivables"
        subtitle="Contract-based invoicing, collections and outstanding balances."
        action={
          <div className="flex gap-2">
            <Button variant="ghost">
              <Download size={15} /> Export
            </Button>
            <Button variant="secondary" onClick={() => setShowAdd(true)}>
              <Plus size={15} /> New Invoice
            </Button>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard tone="navy" label="Total Billed" value={currency(totalRevenue)} />
        <StatCard label="Outstanding" value={currency(outstanding)} />
        <StatCard label="Overdue Invoices" value={overdue.length.toString()} />
        <StatCard label="Collection Rate" value="87.4%" />
      </div>

      <div className="mb-4 inline-flex rounded-lg bg-ink-100 p-1 text-sm">
        {(["invoices", "receivables"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              tab === t
                ? "rounded-md bg-white px-4 py-1.5 font-semibold text-navy-900 shadow-sm"
                : "rounded-md px-4 py-1.5 font-medium text-ink-500"
            }
          >
            {t === "invoices" ? "Invoices" : "Receivables Ageing"}
          </button>
        ))}
      </div>

      {tab === "invoices" ? (
        <>
          <Toolbar>
            <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search invoice or client..." />
            <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={["All Status", "Draft", "Issued", "Paid", "Partially Paid", "Overdue"]} />
            <span className="ml-auto text-xs text-ink-400">{filtered.length} results</span>
          </Toolbar>

          <div className="rounded-xl border border-ink-100 bg-white p-2 shadow-[var(--shadow-card)]">
            <Table head={["Invoice No.", "Client", "Period", "Total", "Due Date", "Status", ""]}>
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState text="No invoices match your filters." />
                  </td>
                </tr>
              )}
              {paged.map((inv) => (
                <tr key={inv.id} className="hover:bg-ink-50">
                  <td className="px-3 py-2.5 font-medium text-navy-900">{inv.invoiceNo}</td>
                  <td className="px-3 py-2.5 text-ink-700">{inv.clientName}</td>
                  <td className="px-3 py-2.5 text-ink-500">{inv.period}</td>
                  <td className="px-3 py-2.5 font-semibold text-navy-900">{currency(inv.total)}</td>
                  <td className="px-3 py-2.5 text-ink-500">{inv.dueDate}</td>
                  <td className="px-3 py-2.5">
                    <Badge>{inv.status}</Badge>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <FileText size={15} className="text-ink-400" />
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      ) : (
        <SectionCard title="Outstanding Receivables by Ageing Period">
          <div className="space-y-4">
            {agingBuckets.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-xs text-ink-500">
                  <span>{b.label}</span>
                  <span className="font-semibold text-navy-900">{currency(Math.round(b.value))}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-ink-100">
                  <div
                    className="h-2 rounded-full bg-gold-400"
                    style={{ width: `${(b.value / outstanding) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {showAdd && (
        <AddInvoiceModal
          onClose={() => setShowAdd(false)}
          onAdd={(inv) => {
            setInvoices((list) => [inv, ...list]);
            setShowAdd(false);
            setTab("invoices");
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

function AddInvoiceModal({ onClose, onAdd }: { onClose: () => void; onAdd: (i: Invoice) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const clientName = String(data.get("clientName"));
    const client = clients.find((c) => c.name === clientName);
    const amount = Number(data.get("amount")) || 0;
    const tax = Math.round(amount * 0.18);
    const invoice: Invoice = {
      id: `INV-NEW-${Date.now()}`,
      invoiceNo: `TSL/INV/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: client?.id ?? clients[0].id,
      clientName,
      siteName: String(data.get("siteName")),
      period: String(data.get("period")),
      amount,
      tax,
      total: amount + tax,
      status: "Draft",
      dueDate: String(data.get("dueDate")),
      issuedDate: localDateStr(),
    };
    onAdd(invoice);
  }

  const dueDefault = localDateStr(14 * 86400000);

  return (
    <Modal title="New Invoice" subtitle="Generate a client invoice" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Client">
            <NativeSelect name="clientName" defaultValue={clients[0]?.name} options={clients.map((c) => c.name)} />
          </Field>
          <Field label="Site">
            <NativeSelect name="siteName" defaultValue={sites[0]?.name} options={sites.map((s) => s.name)} />
          </Field>
          <Field label="Billing Period">
            <Input name="period" defaultValue="Sep 2026" />
          </Field>
          <Field label="Due Date">
            <Input name="dueDate" type="date" defaultValue={dueDefault} />
          </Field>
          <Field label="Amount (UGX)" span>
            <Input name="amount" type="number" step={100000} defaultValue={10000000} />
          </Field>
        </FormGrid>
        <p className="mt-3 text-xs text-ink-400">18% VAT will be added automatically.</p>
        <FormActions onCancel={onClose} submitLabel="Create Invoice" />
      </form>
    </Modal>
  );
}
