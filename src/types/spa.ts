export interface SpaInfo {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: { weekday: string; weekend: string };
  version: string;
}

export interface Stats {
  totalBookingsToday: number;
  vipClients: number;
  revenueToday: string;
  revenueTarget: number;
  pendingReminders: number;
  availableSlots: number;
  revenueTrend: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientTier: string;
  clientAvatar: string;
  service?: string;
  serviceIcon?: string;
  therapist: string;
  therapistId: string;
  startTime: string;
  endTime: string;
  date: string;
  status: "confirmed" | "in_progress" | "completed" | "cancelled" | string;
  statusLabel: string;
  price: number;
  notes?: string;
  reminderSent?: boolean;
  reminderTime?: number;
}


export interface TreatmentProgress {
  id: string;
  clientId: string;
  clientName: string;
  packageName: string;
  totalSessions: number;
  completedSessions: number;
  nextDate: string;
  nextTime: string;
  color: string;
}

export interface Therapist {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  experience: string;
  rating: number;
  totalReviews: number;
  availability: string;
  bio: string;
  services: string[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  priceUSD: number;
  description: string;
  features: string[];
  image: string;
  popular: boolean;
  featured: boolean;
}

export interface Client {
  id: string;
  name: string;
  avatar: string;
  tier: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpent: number;
  memberPoints: number;
  lastVisit: string;
  joinDate: string;
  notes: string;
}

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  hasAppointment?: boolean;
}

export interface WorkflowAction {
  type: string;
  label: string;
  channel: string;
  icon: string;
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  filter: string;
  actions: WorkflowAction[];
  active: boolean;
  totalSent: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: string;
}

export interface RevenueChartItem {
  day: string;
  amount: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  greeting: string;
}

export interface SpaDataContextValue {
  spa: SpaInfo;
  stats: Stats;
  appointments: Appointment[];
  treatmentProgress: TreatmentProgress[];
  therapists: Therapist[];
  services: Service[];
  clients: Client[];
  calendarDays: CalendarDay[];
  workflows: Workflow[];
  notifications: Notification[];
  revenueChart: RevenueChartItem[];
  currentUser: CurrentUser;
  addAppointment: (
    apt: Omit<Appointment, "id" | "status" | "statusLabel">
  ) => Promise<Appointment> | Appointment;
  updateAppointment: (
    id: string,
    apt: Partial<Appointment>
  ) => Promise<Appointment> | Appointment;
  updateAppointmentStatus: (id: string, status: string) => Promise<void> | void;
  deleteAppointment: (id: string) => Promise<void> | void;
  toggleWorkflow: (id: string) => Promise<void> | void;
  markAllNotificationsAsRead: () => Promise<void> | void;
  deleteNotification: (id: string) => Promise<void> | void;
  addClient: (
    client: Omit<
      Client,
      "id" | "totalVisits" | "totalSpent" | "memberPoints" | "lastVisit" | "joinDate"
    >
  ) => Promise<Client> | Client;
  updateClient: (
    id: string,
    client: Partial<Client>
  ) => Promise<Client> | Client;
  deleteClient: (id: string) => Promise<void> | void;
  addTherapist: (
    therapist: Omit<Therapist, "id" | "rating" | "totalReviews" | "availability">
  ) => Promise<Therapist> | Therapist;
  updateTherapist: (
    id: string,
    therapist: Partial<Therapist>
  ) => Promise<Therapist> | Therapist;
  deleteTherapist: (id: string) => Promise<void> | void;
  switchRole: (role: string) => Promise<void>;
  pendingOnlineBookingsCount: number;
  decrementPendingOnlineBookingsCount: () => void;
  loadData: (isSilent?: boolean) => Promise<void>;
}
