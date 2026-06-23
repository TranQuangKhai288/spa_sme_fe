"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import { showToast } from "@/components/ui/Toast";

/**
 * Hook này lắng nghe sự kiện Pusher "new-booking" và hiển thị toast thông báo.
 * CHỈ được gọi trong layout của các trang vận hành (dashboard, portal).
 * KHÔNG được đặt trong RootLayout để tránh hiển thị cho khách landing page.
 */
export function useOperatorPusher(onNewBooking?: (data: any) => void) {
  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!pusherKey || !pusherCluster) return;

    const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
    const channel = pusher.subscribe("spa-channel");

    channel.bind("new-booking", (data: any) => {
      showToast(
        `Có đơn đặt chỗ mới từ ${data?.guestName || "khách hàng"}!`,
        "success"
      );
      onNewBooking?.(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [onNewBooking]);
}
