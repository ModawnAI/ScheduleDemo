"use client"

import * as React from "react"

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Force light mode only - no theme switching
  return <div className="light">{children}</div>
}
