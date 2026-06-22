"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode; // Hỗ trợ cả string và custom ReactNode (như subheader)
  children: ReactNode;
  maxWidthClassName?: string; // Chỉ dùng cho variant="modal". Ví dụ: "sm:max-w-lg"
  variant?: "modal" | "drawer";
  footer?: ReactNode; // Hỗ trợ thanh footer cố định phía dưới cho drawer
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidthClassName = "sm:max-w-lg",
  variant = "modal",
  footer,
}: ModalProps) {
  // Cản cuộn trang khi Modal/Drawer đang mở
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  // Đóng modal bằng phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  if (variant === "drawer") {
    return (
      <div 
        className="fixed inset-0 z-100 flex justify-end items-end md:items-stretch bg-dark-slate/40 p-0 backdrop-blur-sm animate-fadeInBackdrop"
        onClick={onClose}
      >
        <div
          className="drawer-panel glass-card flex flex-col w-full md:w-1/2 md:max-w-2xl h-[85dvh] md:h-full rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-t md:border-t-0 md:border-l border-white/50 shadow-2xl overflow-hidden bg-white/30 backdrop-blur-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-glass-border flex items-center justify-between shrink-0 bg-white/40">
            <div>
              {typeof title === "string" ? (
                <h3 className="font-headline text-xl font-bold text-dark-slate">{title}</h3>
              ) : (
                title
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-white/50 flex items-center justify-center text-on-surface-variant/80 hover:text-on-surface transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-6 sm:p-8 border-t border-glass-border bg-white/50 backdrop-blur-md flex justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-100 flex items-end justify-center bg-dark-slate/40 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-fadeInBackdrop"
      onClick={onClose}
    >
      <div
        className={`animate-slideUp glass-card max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/50 p-6 shadow-2xl transition-all sm:rounded-3xl sm:p-8 ${maxWidthClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            {typeof title === "string" ? (
              <h3 className="font-headline text-xl font-bold text-dark-slate">{title}</h3>
            ) : (
              title
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/50 flex items-center justify-center text-on-surface-variant/80 hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
