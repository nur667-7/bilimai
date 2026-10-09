"use client";

import * as React from "react";
import { CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  value: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  value: "",
  disabled: false
});

interface RadioGroupProps extends React.ComponentProps<"div"> {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

function RadioGroup({
  className,
  value: controlledValue,
  defaultValue = "",
  disabled = false,
  onValueChange,
  ...props
}: RadioGroupProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : uncontrolled;

  const handleChange = React.useCallback(
    (next: string) => {
      if (disabled) return;
      if (controlledValue === undefined) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlledValue, disabled, onValueChange]
  );

  return (
    <RadioGroupContext.Provider value={{ value, disabled, onValueChange: handleChange }}>
      <div
        role="radiogroup"
        aria-disabled={disabled || undefined}
        data-slot="radio-group"
        className={cn("grid gap-2.5", className)}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps extends Omit<React.ComponentProps<"button">, "value"> {
  value: string;
}

function RadioGroupItem({
  className,
  value,
  disabled: itemDisabled,
  onClick,
  ...props
}: RadioGroupItemProps) {
  const ctx = React.useContext(RadioGroupContext);
  const isChecked = ctx.value === value;
  const isDisabled = Boolean(ctx.disabled || itemDisabled);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      data-slot="radio-group-item"
      disabled={isDisabled}
      onClick={(e) => {
        if (!isDisabled) ctx.onValueChange?.(value);
        onClick?.(e);
      }}
      className={cn(
        "relative aspect-square size-4 shrink-0 cursor-pointer rounded-full border border-input text-primary shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        isChecked && "border-primary bg-primary/10",
        className
      )}
      {...props}
    >
      {isChecked && (
        <span
          data-slot="radio-group-indicator"
          className="relative flex items-center justify-center"
        >
          <CircleIcon className="size-2.5 fill-primary text-primary" />
        </span>
      )}
    </button>
  );
}

export { RadioGroup, RadioGroupItem };
