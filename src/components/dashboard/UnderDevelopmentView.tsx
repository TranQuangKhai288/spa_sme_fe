"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

interface UnderDevelopmentViewProps {
  title: string;
  description: string;
  icon: string;
  completionPercentage?: number;
}

export function UnderDevelopmentView({
  title,
  description,
  icon,
  completionPercentage = 75,
}: UnderDevelopmentViewProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <GlassCard className="max-w-md w-full p-8 text-center rounded-3xl border border-white/50 shadow-xl bg-white/40 backdrop-blur-xl">
        {/* Animated Icon Container */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/10 to-primary/20 text-primary shadow-inner">
          <MaterialIcon name={icon} className="text-[40px] animate-pulse" />
          
          {/* Subtle spinning indicator */}
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-soft-gold text-white shadow-md border-2 border-white">
            <MaterialIcon name="construction" className="text-[14px]" />
          </div>
        </div>

        {/* Title & Description */}
        <h1 className="font-headline text-2xl font-bold text-dark-slate mb-3">
          {title}
        </h1>
        <p className="text-sm text-on-surface-variant/80 leading-relaxed mb-6">
          {description}
        </p>

        {/* Progress bar container */}
        <div className="bg-white/40 border border-glass-border rounded-2xl p-4 mb-8">
          <div className="flex justify-between items-center text-xs font-semibold text-dark-slate mb-2">
            <span>Tiến độ hoàn thiện</span>
            <span className="text-jade-green font-bold">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-primary/10 h-3 rounded-full overflow-hidden p-[1px] border border-primary/5">
            <div 
              className="bg-gradient-to-r from-primary to-jade-green h-full rounded-full transition-all duration-1000 shadow-md shadow-primary/20"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-on-surface-variant/60 font-medium mt-2 italic flex items-center justify-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-jade-green animate-ping" />
            Đang tối ưu hóa UI/UX & cơ sở dữ liệu mẫu...
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" passHref legacyBehavior>
            <Button className="w-full sm:w-auto shadow-md" size="md">
              <div className="flex items-center justify-center gap-2">
                <MaterialIcon name="arrow_back" className="text-[16px]" />
                <span>Bảng điều hành</span>
              </div>
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
