import React from "react";
import { cn } from "../lib/cn";

type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <section className={cn("bg-white border border-black/5 rounded-2xl shadow-sm", className)}>
      {children}
    </section>
  );
}