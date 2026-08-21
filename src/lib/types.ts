export type Status = "Active" | "Inactive" | "On Leave" | "Suspended";

export interface Employee {
  id: string;
  empId: string;
  name: string;
  photo: string;
  designation: "Security Guard" | "Site Supervisor" | "Shift Commander" | "Operations Staff" | "K9 Handler";
  department: string;
  branch: string;
  phone: string;
  email: string;
  gender: "Male" | "Female";
  joinDate: string;
  status: Status;
  currentSite: string | null;
  rating: number;
  experienceYears: number;
  idNumber: string;
}

export interface Client {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  sitesCount: number;
  status: Status;
  contractValue: number;
  accountManager: string;
  since: string;
}

export interface Site {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  address: string;
  posts: number;
  guardsRequired: number;
  guardsDeployed: number;
  supervisor: string;
  status: "Fully Staffed" | "Understaffed" | "Overstaffed";
  shiftPattern: string;
}

export interface RosterEntry {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  siteId: string;
  siteName: string;
  shift: "Day (07:00-19:00)" | "Night (19:00-07:00)" | "General (09:00-17:00)";
  status: "Scheduled" | "Confirmed" | "Vacant" | "Replaced";
}

export interface AttendanceRecord {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  siteName: string;
  shift: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "Present" | "Absent" | "Late" | "Half Day" | "On Leave";
  overtimeHrs: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "Annual" | "Sick" | "Emergency" | "Unpaid";
  from: string;
  to: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
  appliedOn: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  clientId: string;
  clientName: string;
  siteName: string;
  period: string;
  amount: number;
  tax: number;
  total: number;
  status: "Draft" | "Issued" | "Paid" | "Partially Paid" | "Overdue";
  dueDate: string;
  issuedDate: string;
}

export interface Expense {
  id: string;
  category: string;
  branch: string;
  amount: number;
  date: string;
  submittedBy: string;
  status: "Pending" | "Approved" | "Rejected" | "Paid";
  purpose: string;
}

export interface PurchaseRequest {
  id: string;
  item: string;
  quantity: number;
  requestedBy: string;
  department: string;
  status: "Pending" | "Approved" | "Ordered" | "Received";
  requiredDate: string;
  vendor: string;
}

export interface Incident {
  id: string;
  siteName: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  title: string;
  reportedBy: string;
  date: string;
  status: "Open" | "Investigating" | "Resolved";
}

export interface Deployment {
  id: string;
  employeeId: string;
  employeeName: string;
  siteId: string;
  siteName: string;
  post: string;
  startDate: string;
  status: "Deployed" | "Standby" | "Vacant" | "Transferred";
}
