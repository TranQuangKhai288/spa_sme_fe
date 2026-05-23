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
  const [spa] = useState<SpaInfo>(initialData.spa);
  const [appointments, setAppointments] = useState<Appointment[]>(
    initialData.appointments as Appointment[]
  );
  const [treatmentProgress] = useState<TreatmentProgress[]>(
    initialData.treatmentProgress
  );
  const [therapists] = useState<Therapist[]>(initialData.therapists);
  const [services] = useState<Service[]>(initialData.services);
  const [clients, setClients] = useState<Client[]>(initialData.clients);
  const [calendarDays] = useState<CalendarDay[]>(initialData.calendarDays);
  const [workflows, setWorkflows] = useState<Workflow[]>(initialData.workflows);
  const [notifications, setNotifications] = useState<Notification[]>(
    initialData.notifications
  );
  const [revenueChart] = useState<RevenueChartItem[]>(initialData.revenueChart);
  const [currentUser] = useState<CurrentUser>(initialData.currentUser);
  const [stats, setStats] = useState<Stats>(initialData.stats);

  useEffect(() => {
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
      .reduce((sum, a) => sum + a.price, 0);
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
      availableSlots: Math.max(0, 16 - totalBookingsToday),
    }));
  }, [appointments]);

  const addAppointment = useCallback(
    (newApt: Omit<Appointment, "id" | "status" | "statusLabel">) => {
      const appointment: Appointment = {
        ...newApt,
        id: `apt-${Date.now()}`,
        status: "confirmed",
        statusLabel: "Đã xác nhận",
      };
      setAppointments((prev) => [appointment, ...prev]);
      setClients((prev) =>
        prev.map((c) =>
          c.name === newApt.clientName
            ? {
                ...c,
                totalVisits: c.totalVisits + 1,
                totalSpent: c.totalSpent + newApt.price,
                memberPoints: c.memberPoints + Math.floor(newApt.price / 10000),
                lastVisit: newApt.date,
              }
            : c
        )
      );
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "success",
          title: "Đã tạo lịch hẹn mới",
          message: `${newApt.clientName} đã đặt lịch ${newApt.service} lúc ${newApt.startTime}`,
          time: "Vừa xong",
          read: false,
          priority: "normal",
        },
        ...prev,
      ]);
      return appointment;
    },
    []
  );

  const updateAppointmentStatus = useCallback(
    (id: string, newStatus: string) => {
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
    },
    []
  );

  const deleteAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleWorkflow = useCallback((id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => (wf.id === id ? { ...wf, active: !wf.active } : wf))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addClient = useCallback(
    (newClient: Omit<Client, "id" | "totalVisits" | "totalSpent" | "memberPoints" | "lastVisit" | "joinDate">) => {
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
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "info",
          title: "Khách hàng mới đăng ký",
          message: `${newClient.name} đã được thêm vào hệ thống quản lý.`,
          time: "Vừa xong",
          read: false,
          priority: "normal",
        },
        ...prev,
      ]);
      return client;
    },
    []
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
    <SpaDataContext.Provider value={value}>{children}</SpaDataContext.Provider>
  );
}

export function useSpaData(): SpaDataContextValue {
  const ctx = useContext(SpaDataContext);
  if (!ctx) {
    throw new Error("useSpaData must be used within SpaDataProvider");
  }
  return ctx;
}
