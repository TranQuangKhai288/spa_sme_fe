import type {
  Appointment,
  Client,
  Notification,
  Service,
  Therapist,
  Workflow,
  SpaInfo,
  CurrentUser,
  RevenueChartItem,
  CalendarDay,
} from "@/types/spa";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export interface DashboardSummaryResponse {
  spa: SpaInfo;
  currentUser: CurrentUser;
  revenueChart: RevenueChartItem[];
  treatmentProgress: any[];
  calendarDays: CalendarDay[];
}

export const api = {
  // Spa Info & Dashboard
  getSpaInfo: () => request<SpaInfo>("/spa-info"),
  getStats: () => request<any>("/stats"),
  getDashboardSummary: () => request<DashboardSummaryResponse>("/dashboard-summary"),

  // Clients
  getClients: () => request<Client[]>("/clients"),
  createClient: (client: Omit<Client, "id" | "totalVisits" | "totalSpent" | "memberPoints" | "lastVisit" | "joinDate">) =>
    request<Client>("/clients", {
      method: "POST",
      body: JSON.stringify(client),
    }),
  updateClient: (id: string, client: Partial<Client>) =>
    request<Client>(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(client),
    }),
  deleteClient: (id: string) =>
    request<{ success: boolean; message: string }>(`/clients/${id}`, {
      method: "DELETE",
    }),

  // Services & Therapists
  getServices: () => request<Service[]>("/services"),
  getTherapists: () => request<Therapist[]>("/therapists"),

  // Appointments
  getAppointments: () => request<Appointment[]>("/appointments"),
  createAppointment: (appt: Omit<Appointment, "id" | "status" | "statusLabel">) =>
    request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(appt),
    }),
  updateAppointment: (id: string, appt: Partial<Appointment>) =>
    request<Appointment>(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(appt),
    }),
  updateAppointmentStatus: (id: string, status: string) =>
    request<Appointment>(`/appointments/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  deleteAppointment: (id: string) =>
    request<{ success: boolean; message: string }>(`/appointments/${id}`, {
      method: "DELETE",
    }),

  // Workflows
  getWorkflows: () => request<Workflow[]>("/workflows"),
  toggleWorkflow: (id: string) =>
    request<Workflow>(`/workflows/${id}/toggle`, {
      method: "PUT",
    }),

  // Notifications
  getNotifications: () => request<Notification[]>("/notifications"),
  markAllNotificationsAsRead: () =>
    request<{ success: boolean }>("/notifications/read-all", {
      method: "POST",
    }),
  deleteNotification: (id: string) =>
    request<{ success: boolean }>(`/notifications/${id}`, {
      method: "DELETE",
    }),

  // Current User Role Switcher
  updateCurrentUserRole: (role: string) =>
    request<CurrentUser>("/current-user", {
      method: "PUT",
      body: JSON.stringify({ role }),
    }),

  // Therapists (KTV)
  createTherapist: (therapist: Omit<Therapist, "id" | "rating" | "totalReviews" | "availability">) =>
    request<Therapist>("/therapists", {
      method: "POST",
      body: JSON.stringify(therapist),
    }),
  updateTherapist: (id: string, therapist: Partial<Therapist>) =>
    request<Therapist>(`/therapists/${id}`, {
      method: "PUT",
      body: JSON.stringify(therapist),
    }),
  deleteTherapist: (id: string) =>
    request<{ success: boolean; message: string }>(`/therapists/${id}`, {
      method: "DELETE",
    }),
};
