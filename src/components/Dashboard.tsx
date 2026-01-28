import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export function Dashboard() {
  return (
    <div className="min-h-svh bg-background">
      <DashboardHeader />
      <DashboardContent />
    </div>
  )
}
