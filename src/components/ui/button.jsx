import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-slate-900 text-white hover:bg-slate-800",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
  outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
};

export function Button({ className = "", variant = "default", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}