"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Pusher from "pusher-js";
import { api } from "@/lib/api";
import type {
  Appointment,
  CalendarDay,
  Client,
  CurrentUser,
  Notification,
  RevenueChartItem,
  SpaDataContextValue,
  SpaInfo,
  Stats,
  Therapist,
  TreatmentProgress,
  Service,
  Workflow,
} from "@/types/spa";

const defaultSpa: SpaInfo = {
  name: "",
  tagline: "",
  phone: "",
  email: "",
  address: "",
  hours: { weekday: "", weekend: "" },
  version: "1.0.0",
};

const defaultCurrentUser: CurrentUser = {
  id: "",
  name: "",
  role: "",
  avatar: "",
  greeting: "",
};

const defaultStats: Stats = {
  totalBookingsToday: 0,
  vipClients: 0,
  revenueToday: "0M",
  revenueTarget: 0,
  pendingReminders: 0,
  availableSlots: 16,
  revenueTrend: "",
};

const SpaDataContext = createContext<SpaDataContextValue | null>(null);

export function SpaDataProvider({ children }: { children: ReactNode }) {
  const [spa, setSpa] = useState<SpaInfo>(defaultSpa);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatmentProgress, setTreatmentProgress] = useState<TreatmentProgress[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [revenueChart, setRevenueChart] = useState<RevenueChartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(defaultCurrentUser);
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [pendingOnlineBookingsCount, setPendingOnlineBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load all data from API
  const loadData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const [
        dashboardSummary,
        clientsList,
        servicesList,
        therapistsList,
        appointmentsList,
        workflowsList,
        notificationsList,
        pendingBookingsList,
      ] = await Promise.all([
        api.getDashboardSummary(),
        api.getClients(),
        api.getServices(),
        api.getTherapists(),
        api.getAppointments(),
        api.getWorkflows(),
        api.getNotifications(),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787/api"}/bookings?status=pending`).then(res => res.json()).catch(() => []),
      ]);

      setSpa(dashboardSummary.spa);
      setCurrentUser(dashboardSummary.currentUser);
      setRevenueChart(dashboardSummary.revenueChart);
      setTreatmentProgress(dashboardSummary.treatmentProgress);
      setCalendarDays(dashboardSummary.calendarDays);

      setClients(clientsList);
      setServices(servicesList);
      setTherapists(therapistsList);
      setAppointments(appointmentsList);
      setWorkflows(workflowsList);
      setNotifications(notificationsList);
      setPendingOnlineBookingsCount(Array.isArray(pendingBookingsList) ? pendingBookingsList.length : 0);
    } catch (err) {
      console.error("Failed to load data from Backend API:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Pusher listener đã được chuyển sang hook useOperatorPusher
  // và chỉ được gọi trong layout của dashboard/portal.

  // Recalculate stats based on appointments (keeps frontend responsive & matches server calculations)
  useEffect(() => {
    if (appointments.length === 0) return;
    const todayAppointments = appointments.filter((a) => a.status !== "cancelled");
    const totalBookingsToday = todayAppointments.length;
    const pendingReminders = appointments.filter(
      (a) => a.status === "confirmed" && a.startTime > "12:00"
    ).length;
    const totalRevenueVND = appointments
      .filter(
        (a) =>
          a.status === "completed" ||
          a.status === "in_progress" ||
          a.status === "confirmed"
      )
      .reduce((sum, a) => sum + Number(a.price), 0);
    const formattedRevenue = (totalRevenueVND / 1_000_000).toFixed(1) + "M";
    const vipToday = appointments.filter(
      (a) =>
        (a.clientTier === "Kim Cương" || a.clientTier === "Bạch Kim") &&
        a.status !== "cancelled"
    ).length;

    setStats((prev) => ({
      ...prev,
      totalBookingsToday,
      pendingReminders: pendingReminders + 2,
      revenueToday: formattedRevenue,
      vipClients: vipToday || prev.vipClients,
      availableSlots: Math.max(0, 16 - todayAppointments.length),
    }));
  }, [appointments]);

  const addAppointment = useCallback(
    async (newApt: Omit<Appointment, "id" | "status" | "statusLabel">) => {
      try {
        const appointment = await api.createAppointment(newApt);
        // Refresh all data silently to sync client total visits/spend/points and notifications
        await loadData(true);
        return appointment;
      } catch (err) {
        console.error("Failed to create appointment via API:", err);
        throw err;
      }
    },
    [loadData]
  );

  const updateAppointment = useCallback(
    async (id: string, updatedApt: Partial<Appointment>) => {
      try {
        const appointment = await api.updateAppointment(id, updatedApt);
        await loadData(true);
        return appointment;
      } catch (err) {
        console.error("Failed to update appointment via API:", err);
        throw err;
      }
    },
    [loadData]
  );

  const updateAppointmentStatus = useCallback(
    async (id: string, newStatus: string) => {
      try {
        await api.updateAppointmentStatus(id, newStatus);
        setAppointments((prev) =>
          prev.map((apt) => {
            if (apt.id !== id) return apt;
            const labels: Record<string, string> = {
              in_progress: "Đang xử lý",
              completed: "Hoàn tất",
              cancelled: "Đã hủy",
              confirmed: "Đã xác nhận",
            };
            return {
              ...apt,
              status: newStatus,
              statusLabel: labels[newStatus] ?? "Đã xác nhận",
            };
          })
        );
      } catch (err) {
        console.error("Failed to update appointment status via API:", err);
      }
    },
    []
  );

  const deleteAppointment = useCallback(async (id: string) => {
    try {
      await api.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete appointment via API:", err);
    }
  }, []);

  const toggleWorkflow = useCallback(async (id: string) => {
    try {
      await api.toggleWorkflow(id);
      setWorkflows((prev) =>
        prev.map((wf) => (wf.id === id ? { ...wf, active: !wf.active } : wf))
      );
    } catch (err) {
      console.error("Failed to toggle workflow via API:", err);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications read via API:", err);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await api.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification via API:", err);
    }
  }, []);

  const addClient = useCallback(
    async (newClient: Omit<Client, "id" | "totalVisits" | "totalSpent" | "memberPoints" | "lastVisit" | "joinDate">) => {
      try {
        const client = await api.createClient(newClient);
        await loadData(true);
        return client;
      } catch (err) {
        console.error("Failed to create client via API:", err);
        throw err;
      }
    },
    [loadData]
  );

  const updateClient = useCallback(
    async (id: string, updatedClient: Partial<Client>) => {
      try {
        const client = await api.updateClient(id, updatedClient);
        await loadData(true);
        return client;
      } catch (err) {
        console.error("Failed to update client via API:", err);
        throw err;
      }
    },
    [loadData]
  );

  const deleteClient = useCallback(
    async (id: string) => {
      try {
        await api.deleteClient(id);
        await loadData(true);
      } catch (err) {
        console.error("Failed to delete client via API:", err);
        throw err;
      }
    },
    [loadData]
  );

  const addTherapist = useCallback(
    async (newTherapist: Omit<Therapist, "id" | "rating" | "totalReviews" | "availability">) => {
      try {
        const therapist = await api.createTherapist(newTherapist);
        await loadData(true);
        return therapist;
      } catch (err) {
        console.error("Failed to create therapist via API:", err);
        throw err;
      }
    },
    [loadData]
  );

  const updateTherapist = useCallback(
    async (id: string, updatedTherapist: Partial<Therapist>) => {
      try {
        const therapist = await api.updateTherapist(id, updatedTherapist);
        await loadData(true);
        return therapist;
      } catch (err) {
        console.error("Failed to update therapist via API:", err);
        throw err;
      }
    },
    [loadData]
  );

  const deleteTherapist = useCallback(
    async (id: string) => {
      try {
        await api.deleteTherapist(id);
        await loadData(true);
      } catch (err) {
        console.error("Failed to delete therapist via API:", err);
        throw err;
      }
    },
    [loadData]
  );

  const switchRole = useCallback(
    async (role: string) => {
      try {
        setLoading(true);
        await api.updateCurrentUserRole(role);
        await loadData(false);
      } catch (err) {
        console.error("Failed to switch role via API:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadData]
  );

  const decrementPendingOnlineBookingsCount = useCallback(() => {
    setPendingOnlineBookingsCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value = useMemo<SpaDataContextValue>(
    () => ({
      spa,
      stats,
      appointments,
      treatmentProgress,
      therapists,
      services,
      clients,
      calendarDays,
      workflows,
      notifications,
      revenueChart,
      currentUser,
      addAppointment,
      updateAppointment,
      updateAppointmentStatus,
      deleteAppointment,
      toggleWorkflow,
      markAllNotificationsAsRead,
      deleteNotification,
      addClient,
      updateClient,
      deleteClient,
      addTherapist,
      updateTherapist,
      deleteTherapist,
      switchRole,
      pendingOnlineBookingsCount,
      decrementPendingOnlineBookingsCount,
      loadData,
    }),
    [
      spa,
      stats,
      appointments,
      treatmentProgress,
      therapists,
      services,
      clients,
      calendarDays,
      workflows,
      notifications,
      revenueChart,
      currentUser,
      addAppointment,
      updateAppointment,
      updateAppointmentStatus,
      deleteAppointment,
      toggleWorkflow,
      markAllNotificationsAsRead,
      deleteNotification,
      addClient,
      updateClient,
      deleteClient,
      addTherapist,
      updateTherapist,
      deleteTherapist,
      switchRole,
      pendingOnlineBookingsCount,
      decrementPendingOnlineBookingsCount,
      loadData,
    ]
  );

  return (
    <SpaDataContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
          <div className="text-center">
            <span className="relative flex h-10 w-10 mx-auto mb-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-jade-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-10 w-10 bg-jade-green"></span>
            </span>
            <p className="font-headline text-sm font-semibold text-primary">Đang kết nối hệ thống ZenFlow...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </SpaDataContext.Provider>
  );
}

export function useSpaData(): SpaDataContextValue {
  const ctx = useContext(SpaDataContext);
  if (!ctx) {
    throw new Error("useSpaData must be used within SpaDataProvider");
  }
  return ctx;
}
