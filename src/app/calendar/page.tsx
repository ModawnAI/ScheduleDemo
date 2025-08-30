"use client";
import StrategicCalendar from "@/components/StrategicCalendar";
import { CalendarProvider } from "@/contexts/CalendarContext";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export default function CalendarPage() {
  return (
    <CalendarProvider>
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
                    <BreadcrumbPage>Strategic Calendar</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Page Header */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Strategic Calendar
                </h1>
                <p className="text-sm sm:text-lg text-muted-foreground">
                  Yearly and monthly view of all scheduled services and contract planning
                </p>
              </div>

              {/* Calendar Component */}
              <StrategicCalendar />

            </div>
          </div>
        </div>
    </CalendarProvider>
  );
}