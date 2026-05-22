import { cn } from "@/lib/utils";

export interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
}

export function MaterialIcon({ name, className, filled }: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}
