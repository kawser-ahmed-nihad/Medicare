import {
  Bell,
  CalendarDays,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Plus,
  Stethoscope,
  UsersRound,
  Wallet,
} from "lucide-react";

// This list is shared by the sidebar, mobile drawer, and search.
// badgeKey: which count to display from useBadgeCounts().
export const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", end: true },

  // Patient
  { label: "My Appointments", icon: CalendarDays, to: "/dashboard/my-appointments", allowedRoles: ["patient"] },
  { label: "Book Appointment", icon: Plus, to: "/dashboard/book-appointment", allowedRoles: ["patient"] },
  { label: "Medical Records", icon: FileText, to: "/dashboard/medical-records", allowedRoles: ["patient"] },

  // Doctor
  { label: "Appointment", icon: CalendarDays, to: "/dashboard/doctors-appointment", allowedRoles: ["doctor"] },
  { label: "Patients", icon: UsersRound, to: "/dashboard/patients", allowedRoles: ["doctor"] },

  // Admin
  { label: "Doctor Management", icon: Stethoscope, to: "/dashboard/doctor-management", allowedRoles: ["admin"] },
  { label: "Patient Management", icon: UsersRound, to: "/dashboard/patient-management", allowedRoles: ["admin"] },
  { label: "Appointment Management", icon: CalendarDays, to: "/dashboard/appointment-management", allowedRoles: ["admin"] },
  { label: "Payments", icon: Wallet, to: "/dashboard/payments-revenue", allowedRoles: ["admin"] },

  // Messages and notifications (the page varies by role).
  { label: "Messages", icon: MessageCircle, to: "/dashboard/messages", badgeKey: "messages", allowedRoles: ["patient", "doctor"] },
  { label: "Messages", icon: MessageCircle, to: "/dashboard/admin-messages", allowedRoles: ["admin"] },
  { label: "Notifications", icon: Bell, to: "/dashboard/notifications", badgeKey: "notifications", allowedRoles: ["patient", "doctor"] },
  { label: "Notifications", icon: Bell, to: "/dashboard/admin-notificationspage", allowedRoles: ["admin"] },
];

export const getNavItems = (role) =>
  NAV_ITEMS.filter((item) => !item.allowedRoles || item.allowedRoles.includes(role));

export const formatBadge = (n) => (n > 9 ? "9+" : n);