import React from "react";
import { cn } from "../lib/cn";

type TogglePillProps = {
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

export function TogglePill({
  active,
  onClick,
  icon,
  children,
}: TogglePillProps) {
  return (
    <button
      onClick={onClick}
      style={{ fontSize: "12px" }}   // match Button
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all font-semibold tracking-[0.01em]",
        active
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      )}
    >
      {icon}
      {children}
    </button>
  );
}