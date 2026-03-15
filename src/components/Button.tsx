import React from "react";
import { cn } from "../lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const fontSize = size === "sm" ? "12px" : "13px";

  return (
    <button
      style={{ fontSize }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-black text-white hover:bg-gray-800 font-semibold tracking-[0.01em]",
        variant === "secondary" &&
          "border border-black/10 bg-white hover:bg-gray-50 font-medium text-gray-800",
        variant === "ghost" &&
          "bg-transparent hover:bg-gray-100 font-medium text-gray-700",
        size === "sm" && "px-4 py-2",
        size === "md" && "px-6 py-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}