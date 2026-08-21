import type {
  Employee,
  Client,
  Site,
  RosterEntry,
  AttendanceRecord,
  LeaveRequest,
  Invoice,
  Expense,
  PurchaseRequest,
  Incident,
  Deployment,
} from "./types";

// deterministic pseudo-random so the demo looks identical on every load/refresh
let seed = 42;
function rand() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const maleNames = [
  "Okello Brian", "Ssentamu David", "Mugisha Peter", "Kato Emmanuel", "Wasswa James",
  "Kiggundu Robert", "Ochieng Moses", "Byaruhanga Allan", "Tumwine Isaac", "Lubega Frank",
  "Nsubuga Henry", "Kasozi Joseph", "Muwonge Vincent", "Ssekandi Paul", "Opio Denis",
  "Kirunda Andrew", "Mwesigwa Ronald", "Ntale Charles", "Kayongo Steven", "Bbosa Richard",
  "Ojok Patrick", "Ssemwogerere Ivan", "Mubiru Simon", "Katongole Fred", "Nabende George",
];
const femaleNames = [
  "Nakato Sarah", "Namutebi Grace", "Achieng Faith", "Nabukenya Joan", "Aketch Irene",
  "Namusoke Diana", "Akello Sharon", "Nassuna Winnie", "Kyomuhendo Ruth", "Nalubega Betty",
  "Auma Patience", "Nakimuli Esther", "Nabirye Christine", "Namubiru Doreen", "Adong Susan",
];
const branches = ["Kampala HQ", "Entebbe Branch", "Jinja Branch", "Mbarara Branch"];
const departments = ["Guarding Operations", "K9 Unit", "Control Room", "Client Relations", "Administration"];

export const employees: Employee[] = Array.from({ length: 64 }).map((_, i) => {
  const isFemale = rand() > 0.82;
  const name = isFemale ? pick(femaleNames) : pick(maleNames);
  const status: Employee["status"] = rand() > 0.93 ? "On Leave" : rand() > 0.97 ? "Suspended" : rand() > 0.06 ? "Active" : "Inactive";
  return {
    id: `EMP-${i + 1}`,
    empId: `TSL-${String(1000 + i)}`,
    name: `${name} ${i > 45 ? randInt(2, 9) : ""}`.trim(),
    photo: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`,
    designation: i < 6 ? "Shift Commander" : i < 16 ? "Site Supervisor" : i < 20 ? "Operations Staff" : i < 23 ? "K9 Handler" : "Security Guard",
    department: pick(departments),
    branch: pick(branches),
    phone: `+256 7${randInt(10, 99)} ${randInt(100, 999)} ${randInt(100, 999)}`,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@tightsecurity.co.ug`,
    gender: isFemale ? "Female" : "Male",
    joinDate: `20${randInt(19, 25)}-${String(randInt(1, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    status,
    currentSite: status === "Active" ? null : null,
    rating: Number((3 + rand() * 2).toFixed(1)),
    experienceYears: randInt(0, 12),
    idNumber: `CM${randInt(70000000, 99999999)}${String.fromCharCode(65 + randInt(0, 25))}${randInt(10, 99)}`,
  };
});

const clientNames = [
  "Bank of Kampala Ltd", "Nile Breweries PLC", "Garden City Mall", "Acacia Mall",
  "Uganda Clays Ltd", "Serena Hotel Kampala", "Kampala International University",
  "Quality Chemicals Ltd", "Mukwano Group", "Crane Bank Towers", "Northgate Business Park",
  "Victoria Mall Entebbe", "Cipla Quality Chemicals", "Kampala Golf Course Estate",
  "Nakumatt Warehouse", "DFCU Bank HQ", "Total Energies Depot", "Speke Resort Munyonyo",
];
const categories = ["Banking & Finance", "Retail & Malls", "Hospitality", "Manufacturing", "Education", "Corporate Offices", "Residential Estate"];

export const clients: Client[] = clientNames.map((name, i) => ({
  id: `CLI-${i + 1}`,
  name,
  category: pick(categories),
  contactPerson: pick([...maleNames, ...femaleNames]),
  phone: `+256 7${randInt(10, 99)} ${randInt(100, 999)} ${randInt(100, 999)}`,
  email: `ops@${name.toLowerCase().replace(/[^a-z]+/g, "")}.com`,
  sitesCount: randInt(1, 4),
  status: rand() > 0.12 ? "Active" : "Inactive",
  contractValue: randInt(8, 120) * 1_000_000,
  accountManager: pick(maleNames.slice(0, 10)),
  since: `20${randInt(18, 25)}`,
}));

const kampalaAreas = ["Nakasero", "Bugolobi", "Ntinda", "Muyenga", "Kololo", "Naguru", "Kansanga", "Industrial Area", "Lugogo", "Munyonyo"];

export const sites: Site[] = clients.flatMap((client) =>
  Array.from({ length: client.sitesCount }).map((_, j) => {
    const guardsRequired = randInt(3, 14);
    const gap = rand() > 0.6 ? 0 : rand() > 0.45 ? randInt(1, 3) * -1 : randInt(1, 2);
    const deployed = Math.max(0, guardsRequired + gap);
    return {
      id: `SITE-${client.id}-${j + 1}`,
      name: `${client.name}${client.sitesCount > 1 ? ` - Gate ${j + 1}` : ""}`,
      clientId: client.id,
      clientName: client.name,
      address: `${pick(kampalaAreas)} Rd, Kampala`,
      posts: randInt(1, 5),
      guardsRequired,
      guardsDeployed: deployed,
      supervisor: pick(maleNames.slice(0, 15)),
      status: deployed < guardsRequired ? "Understaffed" : deployed > guardsRequired ? "Overstaffed" : "Fully Staffed",
      shiftPattern: pick(["Day/Night 12hr", "3-Shift Rotation", "General Shift"]),
    };
  })
);

const shifts: RosterEntry["shift"][] = ["Day (07:00-19:00)", "Night (19:00-07:00)", "General (09:00-17:00)"];
const guardPool = employees.filter((e) => e.designation === "Security Guard" || e.designation === "Operations Staff");

function dateOffset(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  // Local date parts, not toISOString() — that converts to UTC first and
  // rolls local midnight back a day in any timezone ahead of UTC.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const roster: RosterEntry[] = Array.from({ length: 90 }).map((_, i) => {
  const emp = pick(guardPool);
  const site = pick(sites);
  return {
    id: `ROS-${i + 1}`,
    date: dateOffset(randInt(-3, 6)),
    employeeId: emp.id,
    employeeName: emp.name,
    siteId: site.id,
    siteName: site.name,
    shift: pick(shifts),
    status: rand() > 0.9 ? "Vacant" : rand() > 0.85 ? "Replaced" : rand() > 0.5 ? "Confirmed" : "Scheduled",
  };
});

export const deployments: Deployment[] = Array.from({ length: 70 }).map((_, i) => {
  const emp = pick(guardPool);
  const site = pick(sites);
  return {
    id: `DEP-${i + 1}`,
    employeeId: emp.id,
    employeeName: emp.name,
    siteId: site.id,
    siteName: site.name,
    post: `Post ${randInt(1, site.posts)}`,
    startDate: `20${randInt(24, 26)}-${String(randInt(1, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    status: rand() > 0.9 ? "Standby" : rand() > 0.95 ? "Vacant" : rand() > 0.92 ? "Transferred" : "Deployed",
  };
});

export const attendance: AttendanceRecord[] = Array.from({ length: 120 }).map((_, i) => {
  const emp = pick(guardPool);
  const site = pick(sites);
  const r = rand();
  const status: AttendanceRecord["status"] =
    r > 0.985 ? "Absent" : r > 0.965 ? "Late" : r > 0.95 ? "On Leave" : r > 0.93 ? "Half Day" : "Present";
  return {
    id: `ATT-${i + 1}`,
    date: dateOffset(-randInt(0, 6)),
    employeeId: emp.id,
    employeeName: emp.name,
    siteName: site.name,
    shift: pick(shifts),
    checkIn: status === "Absent" || status === "On Leave" ? null : `${String(randInt(6, 9)).padStart(2, "0")}:${String(randInt(0, 59)).padStart(2, "0")}`,
    checkOut: status === "Absent" || status === "On Leave" ? null : `${String(randInt(17, 20)).padStart(2, "0")}:${String(randInt(0, 59)).padStart(2, "0")}`,
    status,
    overtimeHrs: rand() > 0.75 ? randInt(1, 4) : 0,
  };
});

export const leaveRequests: LeaveRequest[] = Array.from({ length: 30 }).map((_, i) => {
  const emp = pick(employees);
  const days = randInt(1, 10);
  return {
    id: `LV-${i + 1}`,
    employeeId: emp.id,
    employeeName: emp.name,
    type: pick(["Annual", "Sick", "Emergency", "Unpaid"]),
    from: dateOffset(randInt(-10, 15)),
    to: dateOffset(randInt(16, 25)),
    days,
    status: pick(["Pending", "Approved", "Approved", "Rejected"]),
    reason: pick(["Family function", "Medical treatment", "Personal emergency", "Rest & recovery", "Travel upcountry"]),
    appliedOn: dateOffset(randInt(-20, -1)),
  };
});

export const invoices: Invoice[] = Array.from({ length: 40 }).map((_, i) => {
  const client = pick(clients);
  const amount = randInt(2, 25) * 1_000_000;
  const tax = Math.round(amount * 0.18);
  return {
    id: `INV-${i + 1}`,
    invoiceNo: `TSL/INV/2026/${String(1000 + i)}`,
    clientId: client.id,
    clientName: client.name,
    siteName: pick(sites.filter((s) => s.clientId === client.id))?.name ?? "All Sites",
    period: pick(["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026"]),
    amount,
    tax,
    total: amount + tax,
    status: pick(["Paid", "Paid", "Issued", "Overdue", "Partially Paid", "Draft"]),
    dueDate: dateOffset(randInt(-15, 20)),
    issuedDate: dateOffset(randInt(-40, -5)),
  };
});

const expenseCategories: Record<string, string[]> = {
  Fuel: ["Site patrol vehicle fuel", "Supervisor vehicle refuel", "Generator diesel top-up"],
  Uniforms: ["New guard uniform set", "Replacement boots and belts", "Rain coats for night shift guards"],
  "Equipment Repair": ["Radio equipment repair", "CCTV DVR unit servicing", "Torch light battery replacement"],
  "Office Supplies": ["Printer & stationery", "ID card printing supplies", "Filing and record folders"],
  Travel: ["Upcountry site visit", "Client meeting transport", "Branch inspection travel"],
  Communication: ["Airtime for supervisors", "Internet subscription - control room", "Bulk SMS notification credit"],
};
const expenseCategoryNames = Object.keys(expenseCategories);

export const expenses: Expense[] = Array.from({ length: 24 }).map((_, i) => {
  const category = pick(expenseCategoryNames);
  return {
    id: `EXP-${i + 1}`,
    category,
    branch: pick(branches),
    amount: randInt(50_000, 3_000_000),
    date: dateOffset(-randInt(0, 30)),
    submittedBy: pick(maleNames.slice(0, 12)),
    status: pick(["Pending", "Approved", "Approved", "Paid", "Rejected"]),
    purpose: pick(expenseCategories[category]),
  };
});

const purchaseItems: Record<string, string> = {
  "Security Uniforms (M)": "Uganda Uniform Suppliers",
  "Rain Coats": "Uganda Uniform Suppliers",
  "Boots (Size 42)": "Safety Gear Uganda",
  Batons: "Safety Gear Uganda",
  "Torch Lights": "SecureTech Equipment Ltd",
  "CCTV DVR Unit": "SecureTech Equipment Ltd",
  "Two-way Radios": "Kampala Radio Co.",
};
const purchaseItemNames = Object.keys(purchaseItems);

export const purchaseRequests: PurchaseRequest[] = Array.from({ length: 16 }).map((_, i) => {
  const item = pick(purchaseItemNames);
  return {
    id: `PR-${i + 1}`,
    item,
    quantity: randInt(5, 100),
    requestedBy: pick(maleNames.slice(0, 10)),
    department: pick(departments),
    status: pick(["Pending", "Approved", "Ordered", "Received"]),
    requiredDate: dateOffset(randInt(2, 30)),
    vendor: purchaseItems[item],
  };
});

export const incidents: Incident[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `INC-${i + 1}`,
  siteName: pick(sites).name,
  severity: pick(["Critical", "High", "Medium", "Low", "Low", "Medium"]),
  title: pick(["Unauthorized access attempt", "Guard absent without notice", "Equipment malfunction", "Minor altercation at gate", "Late shift handover", "Perimeter breach alert"]),
  reportedBy: pick(maleNames.slice(0, 15)),
  date: dateOffset(-randInt(0, 20)),
  status: pick(["Open", "Investigating", "Resolved", "Resolved"]),
}));

export const revenueTrend = [
  { month: "Mar", revenue: 178, expenses: 112 },
  { month: "Apr", revenue: 192, expenses: 118 },
  { month: "May", revenue: 205, expenses: 124 },
  { month: "Jun", revenue: 198, expenses: 121 },
  { month: "Jul", revenue: 221, expenses: 130 },
  { month: "Aug", revenue: 245, expenses: 138 },
];

export const attendanceTrend = [
  { day: "Mon", rate: 94 },
  { day: "Tue", rate: 96 },
  { day: "Wed", rate: 93 },
  { day: "Thu", rate: 97 },
  { day: "Fri", rate: 95 },
  { day: "Sat", rate: 91 },
  { day: "Sun", rate: 89 },
];

export const deploymentBySite = sites.slice(0, 6).map((s) => ({ name: s.name.split(" - ")[0].slice(0, 14), guards: s.guardsDeployed }));

export const kpis = {
  totalGuards: employees.filter((e) => e.designation !== "Operations Staff").length,
  activeSites: sites.length,
  attendanceRate: Number(((attendance.filter((a) => a.status === "Present").length / attendance.length) * 100).toFixed(1)),
  revenueMTD: invoices.reduce((sum, i) => (i.status === "Paid" ? sum + i.total : sum), 0),
  pendingLeave: leaveRequests.filter((l) => l.status === "Pending").length,
  openIncidents: incidents.filter((i) => i.status !== "Resolved").length,
  overdueInvoices: invoices.filter((i) => i.status === "Overdue").length,
  vacantShifts: roster.filter((r) => r.status === "Vacant").length,
};

export function currency(n: number) {
  return `UGX ${n.toLocaleString("en-UG")}`;
}

// Local calendar date as YYYY-MM-DD — never toISOString(), which converts to
// UTC first and rolls the date back a day in any timezone ahead of UTC.
export function localDateStr(offsetMs = 0) {
  const d = new Date(Date.now() + offsetMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
