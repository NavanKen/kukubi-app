"use client";

import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function ThemeAwareButton({
  className,
  children,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  return (
    <Button
      suppressHydrationWarning
      {...props}
      variant={theme === "dark" ? "secondary" : "default"}
      className={cn(className)}
    >
      {children}
    </Button>
  );
}
