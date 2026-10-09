"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  onValueChange: (val: string) => void;
  orientation: "horizontal" | "vertical";
};

const TabsContext = React.createContext<TabsContextValue>({
  value: "",
  onValueChange: () => {},
  orientation: "horizontal"
});

interface TabsProps extends React.ComponentProps<"div"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

function Tabs({
  className,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (next: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [controlledValue, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, orientation }}>
      <div
        data-slot="tabs"
        data-orientation={orientation}
        className={cn(
          "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-xl p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

function TabsList({
  className,
  variant = "default",
  onKeyDown,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof tabsListVariants>) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") {
      return;
    }
    const list = e.currentTarget;
    const triggers = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
    );
    if (triggers.length === 0) return;
    const currentIndex = triggers.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % triggers.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = currentIndex <= 0 ? triggers.length - 1 : currentIndex - 1;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = triggers.length - 1;
    }
    const target = triggers[nextIndex];
    if (target) {
      e.preventDefault();
      target.focus();
      target.click();
    }
  };

  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      data-variant={variant}
      onKeyDown={handleKeyDown}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

interface TabsTriggerProps extends React.ComponentProps<"button"> {
  value: string;
}

function TabsTrigger({ className, value, onClick, ...props }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      data-active={isActive ? "" : undefined}
      data-slot="tabs-trigger"
      tabIndex={isActive ? 0 : -1}
      onClick={(e) => {
        ctx.onValueChange(value);
        onClick?.(e);
      }}
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-foreground/70 transition-all select-none hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    />
  );
}

interface TabsContentProps extends React.ComponentProps<"div"> {
  value: string;
}

function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx.value === value;
  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      data-slot="tabs-content"
      data-state="active"
      className={cn("flex-1 outline-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
