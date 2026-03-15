import React from "react";
import { cn } from "../lib/cn";

type SectionHeaderProps = {
  icon?: React.ReactNode;
  title: string;
  className?: string;
};

export function SectionHeader({ icon, title, className }: SectionHeaderProps) {
  return (
    <div className={cn("p-4 border-b border-black/5 bg-gray-50/50 flex items-center gap-2", className)}>
      {icon}
      <h2 className="text-[14px] font-mono uppercase tracking-wider text-gray-1000">
        {title}
      </h2>
    </div>
  );
}