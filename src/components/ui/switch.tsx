"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
}

function Switch({ className, checked, defaultChecked, onCheckedChange, onChange, ...props }: SwitchProps) {
  return (
    <label
      className={cn(
        "relative inline-flex h-5 w-9 cursor-pointer items-center",
        props.disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(e) => {
          onChange?.(e);
          onCheckedChange?.(e.target.checked);
        }}
        {...props}
      />
      {/* Track */}
      <span className="block h-5 w-9 rounded-full border-2 border-transparent bg-input shadow-xs transition-all peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50 peer-focus-visible:ring-offset-1 dark:bg-input/80" />
      {/* Thumb */}
      <span className="absolute left-0.5 top-0.5 block size-4 rounded-full bg-background shadow-lg transition-transform peer-checked:translate-x-4 dark:peer-not-checked:bg-foreground" />
    </label>
  )
}

export { Switch }
