import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users2, CalendarClock, Receipt } from "lucide-react";
import logo from "../assets/logo.png";
import { Button } from "../components/ui";

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/");
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-950 p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="relative flex items-center gap-3">
          <div className="shrink-0 rounded-md bg-white p-1.5">
            <img src={logo} alt="Tight Security" className="h-8 w-auto object-contain" />
          </div>
          <div className="text-xs font-medium text-gold-400">Security Workforce Management ERP</div>
        </div>

        <div className="relative">
          <h2 className="max-w-md text-3xl font-bold leading-tight">
            One platform. Complete control of your guard force.
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/60">
            Workforce, rostering, deployment, attendance, billing and insights &mdash; unified in a single
            secure operations platform built for Tight Security Ltd.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { icon: Users2, label: "Workforce & Guard Master" },
              { icon: CalendarClock, label: "Roster & Deployment" },
              { icon: ShieldCheck, label: "Attendance & Leave" },
              { icon: Receipt, label: "Billing & Receivables" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 rounded-lg bg-white/5 px-3.5 py-3 ring-1 ring-white/10">
                <f.icon size={16} className="text-gold-400" />
                <span className="text-xs font-medium text-white/80">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/30">Northstar Technologies &times; Tight Security Ltd. &mdash; Demo environment</p>
      </div>

      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={logo} alt="Tight Security" className="h-9 w-auto object-contain" />
          </div>

          <h1 className="text-2xl font-bold text-navy-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink-500">Sign in to access the operations dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-700">Email or Username</label>
              <input
                defaultValue="sarah.n@tightsecurity.co.ug"
                className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-700">Password</label>
              <input
                type="password"
                defaultValue="••••••••••"
                className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-ink-500">
                <input type="checkbox" defaultChecked className="rounded border-ink-300" /> Remember me
              </label>
              <span className="font-medium text-navy-700">Forgot password?</span>
            </div>
            <Button type="submit" className="w-full justify-center py-2.5">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] text-ink-400">
            Demo build for client presentation purposes only. No live data connected.
          </p>
        </div>
      </div>
    </div>
  );
}
