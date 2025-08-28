import AppShell from "@/components/AppShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import SystemStatus from "@/components/dashboard/SystemStatus";
import DataValidation from "@/components/dashboard/DataValidation";

export default function Home() {
  return (
    <AppShell>
      <div className="w-full bg-background">
        {/* Main Content Container */}
        <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
            
            {/* Dashboard Header */}
            <DashboardHeader />
            
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              
              {/* Left Column - Primary Actions */}
              <div className="xl:col-span-2 space-y-4 md:space-y-6">
                <QuickActions />
                <DataValidation />
              </div>
              
              {/* Right Column - System Status */}
              <div className="xl:col-span-1">
                <SystemStatus />
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    </AppShell>
  );
}
