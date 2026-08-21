import {
  ShieldCheck,
  UserCog,
  ClipboardList,
  MapPin,
  Wallet,
  Eye,
  FileCheck2,
  UserCheck,
  Bell,
  Lock,
  KeyRound,
  History,
  DatabaseBackup,
} from "lucide-react";
import { PageHeader, SectionCard, Card } from "../components/ui";

const roles = [
  { name: "System Admin", desc: "Full system access and configuration control.", icon: UserCog },
  { name: "Operations Manager", desc: "Manage operations, sites, rosters and reports.", icon: ClipboardList },
  { name: "Site Supervisor", desc: "Oversee site activities, guards and attendance.", icon: MapPin },
  { name: "Accounts User", desc: "Manage billing, payments and financial records.", icon: Wallet },
  { name: "View Only User", desc: "Read-only access to assigned data.", icon: Eye },
];

const approvalSteps = [
  { step: "1. Request", desc: "User creates a request (leave, purchase, expense or change).", icon: FileCheck2 },
  { step: "2. Review", desc: "Assigned approver reviews the request and adds comments if needed.", icon: UserCheck },
  { step: "3. Approval", desc: "Approver approves or rejects the request securely.", icon: ShieldCheck },
  { step: "4. Notification", desc: "System updates request status and notifies the user automatically.", icon: Bell },
];

const securityControls = [
  { name: "Role-Based Access Control", desc: "Users access only what they need to perform their tasks.", icon: Lock },
  { name: "Data Encryption", desc: "All sensitive data is encrypted in transit and at rest.", icon: ShieldCheck },
  { name: "Multi-Factor Authentication", desc: "Additional verification for enhanced account security.", icon: KeyRound },
  { name: "Audit Trail & Logs", desc: "Track all user activities and system changes.", icon: History },
  { name: "Data Backup & Recovery", desc: "Regular backups and secure recovery to prevent data loss.", icon: DatabaseBackup },
];

export default function Roles() {
  return (
    <div>
      <PageHeader title="Roles, Approvals & Security" subtitle="Right access. Right approvals. Complete security." />

      <SectionCard title="Role-Based Access">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {roles.map((r) => (
            <Card key={r.name} className="p-4">
              <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                <r.icon size={17} />
              </div>
              <p className="text-sm font-semibold text-navy-900">{r.name}</p>
              <p className="mt-1 text-xs leading-snug text-ink-500">{r.desc}</p>
            </Card>
          ))}
        </div>
      </SectionCard>

      <div className="mt-4">
        <SectionCard title="Approval Workflow">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            {approvalSteps.map((s) => (
              <div key={s.step} className="rounded-lg border border-ink-100 p-4 text-center">
                <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-gold-400 text-navy-950">
                  <s.icon size={19} />
                </div>
                <p className="text-sm font-semibold text-navy-900">{s.step}</p>
                <p className="mt-1 text-xs leading-snug text-ink-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-4">
        <SectionCard title="Security Controls">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {securityControls.map((c) => (
              <div key={c.name} className="flex items-start gap-3 rounded-lg border border-ink-100 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-navy-900">
                  <c.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-900">{c.name}</p>
                  <p className="mt-0.5 text-xs leading-snug text-ink-500">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
