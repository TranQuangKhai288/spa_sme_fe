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
import initialData from "@/data/mockdata.json";
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

const SpaDataContext = createContext<SpaDataContextValue | null>(null);

export function SpaDataProvider({ children }: { children: ReactNode }) {
  const [spa, setSpa] = useState<SpaInfo>(initialData.spa);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatmentProgress, setTreatmentProgress] = useState<TreatmentProgress[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>(initialData.calendarDays);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [revenueChart, setRevenueChart] = useState<RevenueChartItem[]>(initialData.revenueChart);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(initialData.currentUser);
  const [stats, setStats] = useState<Stats>(initialData.stats);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

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
      ] = await Promise.all([
        api.getDashboardSummary(),
        api.getClients(),
        api.getServices(),
        api.getTherapists(),
        api.getAppointments(),
        api.getWorkflows(),
        api.getNotifications(),
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
      setUsingFallback(false);
    } catch (err) {
      console.warn("Failed to load data from Backend API, falling back to local mockdata.json:", err);
      // Fallback to initial mock data
      setSpa(initialData.spa);
      setCurrentUser(initialData.currentUser);
      setRevenueChart(initialData.revenueChart as any);
      setTreatmentProgress(initialData.treatmentProgress);
      setCalendarDays(initialData.calendarDays);
      setClients(initialData.clients);
      setServices(initialData.services);
      setTherapists(initialData.therapists);
      setAppointments(initialData.appointments as any);
      setWorkflows(initialData.workflows);
      setNotifications(initialData.notifications);
      setUsingFallback(true);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

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
      if (usingFallback) {
        // Fallback local mode
        const appointment: Appointment = {
          ...newApt,
          id: `apt-${Date.now()}`,
          status: "confirmed",
          statusLabel: "Đã xác nhận",
        };
        setAppointments((prev) => [appointment, ...prev]);
        return appointment;
      }

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
    [usingFallback, loadData]
  );

  const updateAppointmentStatus = useCallback(
    async (id: string, newStatus: string) => {
      if (usingFallback) {
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
        return;
      }

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
    [usingFallback]
  );

  const deleteAppointment = useCallback(async (id: string) => {
    if (usingFallback) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      return;
    }

    try {
      await api.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete appointment via API:", err);
    }
  }, [usingFallback]);

  const toggleWorkflow = useCallback(async (id: string) => {
    if (usingFallback) {
      setWorkflows((prev) =>
        prev.map((wf) => (wf.id === id ? { ...wf, active: !wf.active } : wf))
      );
      return;
    }

    try {
      await api.toggleWorkflow(id);
      setWorkflows((prev) =>
        prev.map((wf) => (wf.id === id ? { ...wf, active: !wf.active } : wf))
      );
    } catch (err) {
      console.error("Failed to toggle workflow via API:", err);
    }
  }, [usingFallback]);

  const markAllNotificationsAsRead = useCallback(async () => {
    if (usingFallback) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      return;
    }

    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications read via API:", err);
    }
  }, [usingFallback]);

  const deleteNotification = useCallback(async (id: string) => {
    if (usingFallback) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      return;
    }

    try {
      await api.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification via API:", err);
    }
  }, [usingFallback]);

  const addClient = useCallback(
    async (newClient: Omit<Client, "id" | "totalVisits" | "totalSpent" | "memberPoints" | "lastVisit" | "joinDate">) => {
      if (usingFallback) {
        const client: Client = {
          ...newClient,
          id: `client-${Date.now()}`,
          totalVisits: 0,
          totalSpent: 0,
          memberPoints: 0,
          lastVisit: "Chưa có",
          joinDate: new Date().toLocaleDateString("vi-VN"),
        };
        setClients((prev) => [client, ...prev]);
        return client;
      }

      try {
        const client = await api.createClient(newClient);
        await loadData(true);
        return client;
      } catch (err) {
        console.error("Failed to create client via API:", err);
        throw err;
      }
    },
    [usingFallback, loadData]
  );

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
      updateAppointmentStatus,
      deleteAppointment,
      toggleWorkflow,
      markAllNotificationsAsRead,
      deleteNotification,
      addClient,
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
      updateAppointmentStatus,
      deleteAppointment,
      toggleWorkflow,
      markAllNotificationsAsRead,
      deleteNotification,
      addClient,
    ]
  );

  return (
    <SpaDataContext.Provider value={value}>
      {loading && !usingFallback ? (
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
