"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(var(--popover))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--success-bg": "hsl(var(--chart-1))",
          "--success-text": "hsl(var(--primary-foreground))",
          "--error-bg": "hsl(var(--chart-5))",
          "--error-text": "hsl(var(--primary-foreground))",
          "--warning-bg": "hsl(var(--chart-3))",
          "--warning-text": "hsl(var(--primary-foreground))",
          "--info-bg": "hsl(var(--chart-2))",
          "--info-text": "hsl(var(--primary-foreground))",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
