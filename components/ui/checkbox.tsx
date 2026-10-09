"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<React.ComponentProps<"button">, "checked" | "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function Checkbox({
  className,
  checked = false,
  onCheckedChange,
  disabled,
  onClick,
  ...props
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      data-slot="checkbox"
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) {
          onCheckedChange?.(!checked);
        }
        onClick?.(e);
      }}
      className={cn(
        "peer inline-flex size-4.5 shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-input bg-white shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      {checked && (
        <span
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none"
        >
          <CheckIcon className="size-3.5" />
        </span>
      )}
    </button>
  );
}

export { Checkbox };
