import { useMemo, useState, type FormEvent } from "react";
import { MapPinned, Plus } from "lucide-react";
import { PageHeader, Toolbar, SearchInput, Button, Avatar, Badge, Card, Modal, Field, Input, NativeSelect, FormGrid, FormActions } from "../components/ui";
import { deployments as initialDeployments, employees, sites, localDateStr } from "../lib/mockData";
import type { Deployment as DeploymentType } from "../lib/types";

const columns: DeploymentType["status"][] = ["Deployed", "Standby", "Vacant", "Transferred"];
const guardPool = employees.filter((e) => e.designation === "Security Guard" || e.designation === "Operations Staff");

export default function Deployment() {
  const [deployments, setDeployments] = useState<DeploymentType[]>(initialDeployments);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(
    () =>
      deployments.filter(
        (d) => d.employeeName.toLowerCase().includes(query.toLowerCase()) || d.siteName.toLowerCase().includes(query.toLowerCase())
      ),
    [deployments, query]
  );

  return (
    <div>
      <PageHeader
        title="Guard Deployment"
        subtitle="Live view of who is deployed, on standby, transferred or vacant across all sites."
        action={
          <Button variant="secondary" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> New Deployment
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search guard or site..." />
        <span className="ml-auto text-xs text-ink-400">{filtered.length} of {deployments.length} deployments</span>
      </Toolbar>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const items = filtered.filter((d) => d.status === col);
          return (
            <div key={col} className="flex flex-col">
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-navy-900">{col}</h3>
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-semibold text-ink-500">{items.length}</span>
              </div>
              <div className="flex-1 space-y-3">
                {items.length === 0 && (
                  <Card className="p-4 text-center text-xs text-ink-400">No records</Card>
                )}
                {items.map((d) => (
                  <Card key={d.id} className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={d.employeeName} size={30} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-navy-900">{d.employeeName}</p>
                        <p className="truncate text-xs text-ink-400">{d.post}</p>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-ink-500">
                      <MapPinned size={12} />
                      <span className="truncate">{d.siteName}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-ink-400">Since {d.startDate}</span>
                      <Badge>{d.status}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <AddDeploymentModal
          onClose={() => setShowAdd(false)}
          onAdd={(dep) => {
            setDeployments((list) => [dep, ...list]);
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}

function AddDeploymentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (d: DeploymentType) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const siteName = String(data.get("siteName"));
    const site = sites.find((s) => s.name === siteName);
    const guard = guardPool.find((g) => g.empId === data.get("guardEmpId")) ?? guardPool[0];
    const deployment: DeploymentType = {
      id: `DEP-NEW-${Date.now()}`,
      employeeId: guard.id,
      employeeName: guard.name,
      siteId: site?.id ?? sites[0].id,
      siteName,
      post: String(data.get("post")),
      startDate: localDateStr(),
      status: data.get("status") as DeploymentType["status"],
    };
    onAdd(deployment);
  }

  return (
    <Modal title="New Deployment" subtitle="Assign a guard to a site post" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <FormGrid>
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
          <Field label="Post">
            <Input name="post" defaultValue="Post 1" />
          </Field>
          <Field label="Status">
            <NativeSelect name="status" defaultValue="Deployed" options={["Deployed", "Standby", "Vacant", "Transferred"]} />
          </Field>
        </FormGrid>
        <FormActions onCancel={onClose} submitLabel="Deploy Guard" />
      </form>
    </Modal>
  );
}
