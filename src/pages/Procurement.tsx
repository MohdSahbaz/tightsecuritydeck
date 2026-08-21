import { useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { PageHeader, Toolbar, SearchInput, Table, Badge, Button, Pagination, EmptyState, StatCard, Modal, Field, Input, NativeSelect, FormGrid, FormActions } from "../components/ui";
import { expenses as initialExpenses, purchaseRequests as initialPurchaseRequests, employees, currency, localDateStr } from "../lib/mockData";
import type { Expense, PurchaseRequest } from "../lib/types";

const PAGE_SIZE = 10;
const expenseCategories = ["Fuel", "Uniforms", "Equipment Repair", "Office Supplies", "Travel", "Communication"];
const branches = ["Kampala HQ", "Entebbe Branch", "Jinja Branch", "Mbarara Branch"];
const vendors = ["Uganda Uniform Suppliers", "SecureTech Equipment Ltd", "Kampala Radio Co.", "Safety Gear Uganda"];
const submitterNames = Array.from(new Set(employees.slice(0, 20).map((e) => e.name)));

export default function Procurement() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(initialPurchaseRequests);
  const [tab, setTab] = useState<"expenses" | "purchases">("expenses");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const filteredExpenses = useMemo(
    () => expenses.filter((e) => e.purpose.toLowerCase().includes(query.toLowerCase()) || e.category.toLowerCase().includes(query.toLowerCase())),
    [expenses, query]
  );
  const filteredPurchases = useMemo(
    () => purchaseRequests.filter((p) => p.item.toLowerCase().includes(query.toLowerCase()) || p.vendor.toLowerCase().includes(query.toLowerCase())),
    [purchaseRequests, query]
  );

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingApprovals = expenses.filter((e) => e.status === "Pending").length + purchaseRequests.filter((p) => p.status === "Pending").length;

  const list = tab === "expenses" ? filteredExpenses : filteredPurchases;
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Expenses & Procurement"
        subtitle="Operational spend, purchase requests and vendor management."
        action={
          <Button variant="secondary" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> {tab === "expenses" ? "Add Expense" : "New Purchase Request"}
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard tone="navy" label="Total Expenses" value={currency(totalExpense)} />
        <StatCard label="Pending Approvals" value={pendingApprovals.toString()} />
        <StatCard label="Active Vendors" value="4" />
        <StatCard label="Open Purchase Requests" value={purchaseRequests.filter((p) => p.status === "Pending").length.toString()} />
      </div>

      <div className="mb-4 inline-flex rounded-lg bg-ink-100 p-1 text-sm">
        {(["expenses", "purchases"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(1); }}
            className={
              tab === t
                ? "rounded-md bg-white px-4 py-1.5 font-semibold text-navy-900 shadow-sm"
                : "rounded-md px-4 py-1.5 font-medium text-ink-500"
            }
          >
            {t === "expenses" ? "Expense Records" : "Purchase Requests"}
          </button>
        ))}
      </div>

      <Toolbar>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder={tab === "expenses" ? "Search category or purpose..." : "Search item or vendor..."} />
        <span className="ml-auto text-xs text-ink-400">{list.length} results</span>
      </Toolbar>

      <div className="rounded-xl border border-ink-100 bg-white p-2 shadow-[var(--shadow-card)]">
        {tab === "expenses" ? (
          <Table head={["Category", "Purpose", "Branch", "Submitted By", "Amount", "Date", "Status"]}>
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState text="No expenses match your search." />
                </td>
              </tr>
            )}
            {filteredExpenses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((e) => (
              <tr key={e.id} className="hover:bg-ink-50">
                <td className="px-3 py-2.5 font-medium text-navy-900">{e.category}</td>
                <td className="px-3 py-2.5 text-ink-600">{e.purpose}</td>
                <td className="px-3 py-2.5 text-ink-500">{e.branch}</td>
                <td className="px-3 py-2.5 text-ink-500">{e.submittedBy}</td>
                <td className="px-3 py-2.5 font-semibold text-navy-900">{currency(e.amount)}</td>
                <td className="px-3 py-2.5 text-ink-500">{e.date}</td>
                <td className="px-3 py-2.5">
                  <Badge>{e.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Table head={["Item", "Qty", "Requested By", "Department", "Vendor", "Required By", "Status"]}>
            {filteredPurchases.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState text="No purchase requests match your search." />
                </td>
              </tr>
            )}
            {filteredPurchases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((p) => (
              <tr key={p.id} className="hover:bg-ink-50">
                <td className="px-3 py-2.5 font-medium text-navy-900">{p.item}</td>
                <td className="px-3 py-2.5 text-ink-700">{p.quantity}</td>
                <td className="px-3 py-2.5 text-ink-500">{p.requestedBy}</td>
                <td className="px-3 py-2.5 text-ink-500">{p.department}</td>
                <td className="px-3 py-2.5 text-ink-500">{p.vendor}</td>
                <td className="px-3 py-2.5 text-ink-500">{p.requiredDate}</td>
                <td className="px-3 py-2.5">
                  <Badge>{p.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      {showAdd && tab === "expenses" && (
        <AddExpenseModal
          onClose={() => setShowAdd(false)}
          onAdd={(exp) => {
            setExpenses((list) => [exp, ...list]);
            setShowAdd(false);
            setPage(1);
          }}
        />
      )}

      {showAdd && tab === "purchases" && (
        <AddPurchaseModal
          onClose={() => setShowAdd(false)}
          onAdd={(pr) => {
            setPurchaseRequests((list) => [pr, ...list]);
            setShowAdd(false);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

function AddExpenseModal({ onClose, onAdd }: { onClose: () => void; onAdd: (e: Expense) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const expense: Expense = {
      id: `EXP-NEW-${Date.now()}`,
      category: String(data.get("category")),
      branch: String(data.get("branch")),
      amount: Number(data.get("amount")) || 0,
      date: localDateStr(),
      submittedBy: String(data.get("submittedBy")),
      status: "Pending",
      purpose: String(data.get("purpose")),
    };
    onAdd(expense);
  }

  return (
    <Modal title="Add Expense" subtitle="Record an operational expense" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Category">
            <NativeSelect name="category" defaultValue={expenseCategories[0]} options={expenseCategories} />
          </Field>
          <Field label="Branch">
            <NativeSelect name="branch" defaultValue={branches[0]} options={branches} />
          </Field>
          <Field label="Purpose" span>
            <Input name="purpose" defaultValue="Site patrol vehicle fuel" />
          </Field>
          <Field label="Submitted By">
            <NativeSelect name="submittedBy" defaultValue={submitterNames[0]} options={submitterNames} />
          </Field>
          <Field label="Amount (UGX)">
            <Input name="amount" type="number" step={10000} defaultValue={250000} />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Add Expense" />
      </form>
    </Modal>
  );
}

function AddPurchaseModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: PurchaseRequest) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const request: PurchaseRequest = {
      id: `PR-NEW-${Date.now()}`,
      item: String(data.get("item")),
      quantity: Number(data.get("quantity")) || 1,
      requestedBy: String(data.get("requestedBy")),
      department: String(data.get("department")),
      status: "Pending",
      requiredDate: String(data.get("requiredDate")),
      vendor: String(data.get("vendor")),
    };
    onAdd(request);
  }

  const requiredDefault = localDateStr(10 * 86400000);

  return (
    <Modal title="New Purchase Request" subtitle="Raise a request for stock or equipment" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Field label="Item" span>
            <Input name="item" defaultValue="Security Uniforms (M)" />
          </Field>
          <Field label="Quantity">
            <Input name="quantity" type="number" min={1} defaultValue={20} />
          </Field>
          <Field label="Vendor">
            <NativeSelect name="vendor" defaultValue={vendors[0]} options={vendors} />
          </Field>
          <Field label="Requested By">
            <NativeSelect name="requestedBy" defaultValue={submitterNames[0]} options={submitterNames} />
          </Field>
          <Field label="Required Date">
            <Input name="requiredDate" type="date" defaultValue={requiredDefault} />
          </Field>
          <Field label="Department" span>
            <Input name="department" defaultValue="Guarding Operations" />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Submit Request" />
      </form>
    </Modal>
  );
}
