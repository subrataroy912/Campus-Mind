import DashboardHeader from '../../components/dashboard/DashboardHeader'
import StatsGrid from '../../components/dashboard/StatsGrid'
import ClassesSection from '../../components/dashboard/ClassesSection'
import ClassCard from '../../components/dashboard/ClassCard'
import StatCard from '../../components/dashboard/StatCard'

function DashboardPage() {
  return (
    <div className="dashboard">
      <DashboardHeader />
      <StatsGrid />
      <ClassesSection />
      <StatCard/>
      <ClassCard/>
    </div>
  )
}

export default DashboardPage
