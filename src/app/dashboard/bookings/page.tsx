"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { useSpaData } from "@/providers/SpaDataProvider";

interface Booking {
  id: string;
  guestName: string;
  guestPhone: string;
  serviceRequested: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: string;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { addAppointment, decrementPendingOnlineBookingsCount } = useSpaData();

  const fetchBookings = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/bookings`);
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Lỗi từ API:", data.error || data);
        setBookings([]);
        return;
      }

      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đặt chỗ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Khởi tạo Pusher
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.warn("Chưa cấu hình Pusher. Tính năng Real-time sẽ không hoạt động.");
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe("spa-channel");
    channel.bind("new-booking", (data: Booking) => {
      // Khi có booking mới, thêm vào đầu danh sách
      setBookings((prev) => [data, ...prev]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string, bookingData?: Booking) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      // Giảm số lượng thông báo nếu booking đó đang từ trạng thái pending sang trạng thái khác
      const oldBooking = bookings.find((b) => b.id === id);
      if (oldBooking?.status === "pending") {
        decrementPendingOnlineBookingsCount();
      }

      showToast(`Đã ${newStatus === "confirmed" ? "xác nhận" : "từ chối"} đơn đặt chỗ.`, "success");

      // Nếu confirm thì tự động tạo Appointment (Tạm gán cho nhân viên đầu tiên hoặc để trống)
      // Chú ý: Ở hệ thống thực tế có thể cần Modal chọn nhân viên. Ở đây gán ID tạm.
      if (newStatus === "confirmed" && bookingData) {
        await addAppointment({
          clientId: "guest", // Trong thực tế, cần tạo Client record nếu chưa có
          clientName: bookingData.guestName,
          clientTier: "Thành viên",
          clientAvatar: "https://i.pravatar.cc/150?u=" + bookingData.guestPhone,
          service: bookingData.serviceRequested,
          therapist: "Chưa phân bổ",
          therapistId: "unassigned",
          startTime: bookingData.preferredTime,
          endTime: bookingData.preferredTime, // Có thể cộng thêm phút
          date: bookingData.preferredDate,
          price: 0,
          notes: bookingData.notes,
        });
        showToast("Đã tạo Lịch hẹn thành công, vui lòng phân bổ nhân viên sau.", "info");
      }
    } catch (error) {
      showToast("Có lỗi xảy ra", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-jade-green border-t-transparent"></div>
      </div>
    );
  }

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const historyBookings = bookings.filter((b) => b.status !== "pending");

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-dark-slate">
            Đặt chỗ trực tuyến (Khách vãng lai)
          </h1>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Danh sách khách hàng điền form Đặt lịch từ trang chủ
          </p>
        </div>
      </div>

      {/* Đơn chờ xác nhận */}
      <div className="glass-card rounded-3xl border border-white/50 p-6 shadow-xl">
        <h2 className="font-headline text-lg font-bold text-dark-slate mb-4 flex items-center gap-2">
          <MaterialIcon name="pending_actions" className="text-soft-gold" />
          Chờ xác nhận ({pendingBookings.length})
        </h2>

        {pendingBookings.length === 0 ? (
          <div className="py-8 text-center text-on-surface-variant bg-white/30 rounded-2xl">
            Không có đơn đặt chỗ nào đang chờ.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingBookings.map((b) => (
              <div key={b.id} className="p-4 bg-white/60 rounded-2xl border border-glass-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-soft-gold"></div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline text-md font-bold text-dark-slate">{b.guestName}</h3>
                  <span className="text-xs bg-soft-gold/20 text-soft-gold px-2 py-1 rounded-full font-medium">Chờ duyệt</span>
                </div>
                <div className="space-y-1 text-sm text-on-surface-variant mb-4">
                  <p className="flex items-center gap-2"><MaterialIcon name="call" className="text-[16px]" /> {b.guestPhone}</p>
                  <p className="flex items-center gap-2"><MaterialIcon name="spa" className="text-[16px]" /> {b.serviceRequested}</p>
                  <p className="flex items-center gap-2"><MaterialIcon name="event" className="text-[16px]" /> {b.preferredTime} ngày {new Date(b.preferredDate).toLocaleDateString("vi-VN")}</p>
                  {b.notes && <p className="mt-2 text-xs italic bg-white/50 p-2 rounded-lg">"{b.notes}"</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 !py-2 text-sm text-red-500 border-red-500/30 hover:bg-red-500/10" onClick={() => handleUpdateStatus(b.id, "rejected")}>
                    Từ chối
                  </Button>
                  <Button variant="primary" className="flex-1 !py-2 text-sm" onClick={() => handleUpdateStatus(b.id, "confirmed", b)}>
                    Xác nhận
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lịch sử đơn */}
      <div className="glass-card rounded-3xl border border-white/50 p-6 shadow-xl">
        <h2 className="font-headline text-lg font-bold text-dark-slate mb-4 flex items-center gap-2">
          <MaterialIcon name="history" className="text-on-surface-variant" />
          Lịch sử đặt chỗ
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-dark-slate">
            <thead>
              <tr className="border-b border-glass-border text-on-surface-variant">
                <th className="pb-3 pr-4 font-medium">Khách hàng</th>
                <th className="pb-3 pr-4 font-medium">SĐT</th>
                <th className="pb-3 pr-4 font-medium">Dịch vụ</th>
                <th className="pb-3 pr-4 font-medium">Lịch mong muốn</th>
                <th className="pb-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {historyBookings.map((b) => (
                <tr key={b.id} className="border-b border-glass-border/50 hover:bg-white/30 transition-colors">
                  <td className="py-3 pr-4 font-medium">{b.guestName}</td>
                  <td className="py-3 pr-4">{b.guestPhone}</td>
                  <td className="py-3 pr-4">{b.serviceRequested}</td>
                  <td className="py-3 pr-4">{b.preferredTime} - {new Date(b.preferredDate).toLocaleDateString("vi-VN")}</td>
                  <td className="py-3">
                    {b.status === "confirmed" ? (
                      <span className="bg-jade-green/10 text-jade-green px-2 py-1 rounded-full text-xs font-medium">Đã xác nhận</span>
                    ) : (
                      <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded-full text-xs font-medium">Đã từ chối</span>
                    )}
                  </td>
                </tr>
              ))}
              {historyBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-on-surface-variant">Chưa có lịch sử.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
