import { useEffect, type InputHTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("rounded-xl border border-ink-100 bg-white shadow-[var(--shadow-card)]", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "white",
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  tone?: "navy" | "gold" | "white";
}) {
  const isDark = tone === "navy";
  return (
    <Card className={clsx("p-5", tone === "navy" && "bg-navy-900! border-navy-900!", tone === "gold" && "bg-gold-400! border-gold-400!")}>
      <div className="flex items-start justify-between">
        <span className={clsx("text-xs font-semibold uppercase tracking-wide", isDark ? "text-white/70" : tone === "gold" ? "text-navy-900/70" : "text-ink-500")}>
          {label}
        </span>
        {icon && (
          <span className={clsx("rounded-lg p-2", isDark ? "bg-white/10" : tone === "gold" ? "bg-navy-950/10" : "bg-ink-50")}>
            {icon}
          </span>
        )}
      </div>
      <div className={clsx("mt-3 text-2xl font-bold", isDark ? "text-white" : "text-navy-900")}>{value}</div>
      {delta && (
        <div className={clsx("mt-1 text-xs font-medium", isDark ? "text-gold-300" : "text-emerald-600")}>{delta}</div>
      )}
    </Card>
  );
}

const badgeTone: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Present: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Deployed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Received: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Fully Staffed": "bg-emerald-50 text-emerald-700 ring-emerald-200",

  Scheduled: "bg-sky-50 text-sky-700 ring-sky-200",
  Issued: "bg-sky-50 text-sky-700 ring-sky-200",
  Ordered: "bg-sky-50 text-sky-700 ring-sky-200",
  Standby: "bg-sky-50 text-sky-700 ring-sky-200",
  Investigating: "bg-sky-50 text-sky-700 ring-sky-200",

  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  "On Leave": "bg-amber-50 text-amber-700 ring-amber-200",
  "Half Day": "bg-amber-50 text-amber-700 ring-amber-200",
  Late: "bg-amber-50 text-amber-700 ring-amber-200",
  Draft: "bg-slate-100 text-slate-600 ring-slate-200",
  "Partially Paid": "bg-amber-50 text-amber-700 ring-amber-200",
  Understaffed: "bg-amber-50 text-amber-700 ring-amber-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Overstaffed: "bg-amber-50 text-amber-700 ring-amber-200",
  Transferred: "bg-amber-50 text-amber-700 ring-amber-200",

  Absent: "bg-rose-50 text-rose-700 ring-rose-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  Overdue: "bg-rose-50 text-rose-700 ring-rose-200",
  Vacant: "bg-rose-50 text-rose-700 ring-rose-200",
  Suspended: "bg-rose-50 text-rose-700 ring-rose-200",
  Critical: "bg-rose-50 text-rose-700 ring-rose-200",
  High: "bg-orange-50 text-orange-700 ring-orange-200",
  Open: "bg-rose-50 text-rose-700 ring-rose-200",

  Inactive: "bg-slate-100 text-slate-500 ring-slate-200",
  Low: "bg-slate-100 text-slate-500 ring-slate-200",
  Replaced: "bg-violet-50 text-violet-700 ring-violet-200",
};

export function Badge({ children }: { children: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        badgeTone[children] ?? "bg-slate-100 text-slate-600 ring-slate-200"
      )}
    >
      {children}
    </span>
  );
}

export function SectionCard({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={clsx("p-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
            {head.map((h, i) => (
              <th key={i} className="whitespace-nowrap px-3 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Avatar({ src, name, size = 32 }: { src?: string; name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover ring-1 ring-ink-100"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-navy-800 text-xs font-semibold text-white"
    >
      {initials}
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-center gap-3">{children}</div>;
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Search..."}
      className="w-full max-w-xs rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
    />
  );
}

export function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function Button({
  children,
  variant = "primary",
  onClick,
  className,
  type = "button",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
        variant === "primary" && "bg-navy-900 text-white hover:bg-navy-800",
        variant === "secondary" && "bg-gold-400 text-navy-950 hover:bg-gold-500",
        variant === "ghost" && "bg-white text-navy-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className="px-3 py-10 text-center text-sm text-ink-400">{text}</div>;
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={clsx(
          "relative max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white shadow-xl",
          wide ? "max-w-2xl" : "max-w-md"
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-ink-50">
            <X size={18} className="text-ink-500" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children, span }: { label: string; children: ReactNode; span?: boolean }) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <label className="mb-1.5 block text-xs font-semibold text-ink-700">{label}</label>
      {children}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100",
        props.className
      )}
    />
  );
}

export function NativeSelect({
  name,
  defaultValue,
  options,
  entries,
  className,
}: {
  name: string;
  defaultValue?: string;
  options?: string[];
  entries?: { value: string; label: string }[];
  className?: string;
}) {
  const items = entries ?? (options ?? []).map((o) => ({ value: o, label: o }));
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className={clsx(
        "w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-700 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100",
        className
      )}
    >
      {items.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

export function FormActions({ onCancel, submitLabel = "Save" }: { onCancel: () => void; submitLabel?: string }) {
  return (
    <div className="mt-6 flex gap-2 border-t border-ink-100 pt-5">
      <Button variant="ghost" className="flex-1 justify-center" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" className="flex-1 justify-center">
        {submitLabel}
      </Button>
    </div>
  );
}

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-ink-500">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-md border border-ink-200 px-2.5 py-1 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-md border border-ink-200 px-2.5 py-1 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
