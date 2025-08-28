"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import DailyDashboard from "@/components/dashboard/DailyDashboard";
import DragDropDashboard from "@/components/dashboard/DragDropDashboard";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, MousePointer, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const [isDragDropMode, setIsDragDropMode] = useState(false);

  return (
    <AppShell>
      <div className="w-full bg-background text-foreground">
        <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
            
            {/* Breadcrumb Navigation */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Daily Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Dashboard Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Dashboard Mode</h2>
                <Badge variant={isDragDropMode ? "default" : "secondary"} className="text-xs">
                  {isDragDropMode ? "Interactive" : "Overview"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={!isDragDropMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsDragDropMode(false)}
                  className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={isDragDropMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsDragDropMode(true)}
                  className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                >
                  <MousePointer className="w-4 h-4 mr-2" />
                  Interactive
                </Button>
              </div>
            </div>

            {/* Dashboard Component */}
            {isDragDropMode ? <DragDropDashboard /> : <DailyDashboard />}

          </div>
        </div>
      </div>
    </AppShell>
  );
}