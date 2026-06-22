"use client";

import { useState, useRef, useEffect, PointerEvent } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

interface DraggableAssistiveButtonProps {
  onClick?: () => void;
}

export function DraggableAssistiveButton({ onClick }: DraggableAssistiveButtonProps = {}) {
  const [position, setPosition] = useState({ x: 20, y: 100 }); // Default position from top right
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, isDragging: false, moved: false });
  const wasDraggedRef = useRef(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("assistiveButtonPos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosition(parsed);
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
      if (mounted) {
        localStorage.setItem("assistiveButtonPos", JSON.stringify(position));
      }
    }
  }, [isDragging, position, mounted]);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      isDragging: true,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    // Only set as dragging if moved more than 5px to allow clicks
    if (!isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      setIsDragging(true);
      dragRef.current.moved = true;
    }

    if (dragRef.current.moved) {
      let newX = dragRef.current.initialX - dx; // - dx because we anchor to right
      let newY = dragRef.current.initialY + dy; // + dy because we anchor to top

      // Bounds check
      const btn = buttonRef.current;
      if (btn) {
        const maxX = window.innerWidth - btn.offsetWidth;
        const maxY = window.innerHeight - btn.offsetHeight;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
      }

      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    wasDraggedRef.current = dragRef.current.moved;
    dragRef.current.isDragging = false;

    // Edge snapping logic
    const btn = buttonRef.current;
    if (btn && dragRef.current.moved) {
      const margin = 20;
      const btnWidth = btn.offsetWidth;
      const maxX = window.innerWidth - btnWidth;
      const midX = maxX / 2;

      // If x (distance from right) is greater than midX, it's closer to the left edge
      const targetX = position.x > midX ? maxX - margin : margin;

      // Keep vertical position within safe window margins
      const btnHeight = btn.offsetHeight;
      const maxY = window.innerHeight - btnHeight;
      const targetY = Math.max(margin, Math.min(position.y, maxY - margin));

      setPosition({ x: targetX, y: targetY });
    }

    dragRef.current.moved = false;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      e.preventDefault(); // Prevent click if just dragged
      return;
    }
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  if (!mounted) return null;

  const innerContent = (
    <>
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <MaterialIcon 
        name="edit_calendar" 
        className="text-[20px] drop-shadow-md shrink-0 text-champagne-gold group-hover:text-charcoal-black transition-colors duration-300" 
        filled 
      />
      <span className="font-serif italic text-[14.5px] tracking-wide text-warm-ivory group-hover:text-charcoal-black transition-colors duration-300 select-none pr-0.5">
        Đặt lịch
      </span>

      {/* Subtle gold pulse badge */}
      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-champagne-gold opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-champagne-gold border border-charcoal-black/50"></span>
      </span>
    </>
  );

  const btnClass = "flex h-[46px] px-4.5 items-center justify-center gap-2 rounded-full bg-charcoal-black/90 backdrop-blur-md border border-champagne-gold/30 text-champagne-gold shadow-[0_8px_32px_rgba(212,175,55,0.12)] overflow-hidden group transition-all duration-300 group-hover:bg-champagne-gold group-hover:border-champagne-gold/80";

  return (
    <>
      <style>{`
        @keyframes float-subtle {
          0%, 100% { 
            transform: translateY(0); 
            box-shadow: 0 8px 32px rgba(212, 175, 55, 0.12); 
          }
          50% { 
            transform: translateY(-4px); 
            box-shadow: 0 12px 38px rgba(212, 175, 55, 0.22); 
          }
        }
        .animate-float-subtle {
          animation: float-subtle 3s infinite ease-in-out;
        }
      `}</style>
      <div
        ref={buttonRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Đặt lịch ngay"
        className={`fixed z-[999] touch-none rounded-full outline-none ${
          isDragging 
            ? 'scale-110 cursor-grabbing' 
            : 'cursor-grab hover:scale-105 animate-float-subtle'
        }`}
        style={{
          right: `${position.x}px`,
          top: `${position.y}px`,
          transition: isDragging
            ? 'none'
            : 'right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), transform 0.2s',
        }}
      >
        <div className={`${btnClass} pointer-events-none`}>
          {innerContent}
        </div>
      </div>
    </>
  );
}
