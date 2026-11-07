import React, { useState } from 'react'
import { useDeveloperData } from '../../hooks/useDeveloperData.js'
import { WelcomeBanner } from '../../components/dashboard/WelcomeBanner.jsx'
import { StatsSection } from '../../components/dashboard/StatsSection.jsx'
import { MyTasksOverview } from '../../components/dashboard/MyTasksOverview.jsx'
import { MyProjectsOverview } from '../../components/dashboard/MyProjectsOverview.jsx'
import { UpcomingDeadlines } from '../../components/dashboard/UpcomingDeadlines.jsx'
import { AnnouncementsWidget } from '../../components/dashboard/AnnouncementsWidget.jsx'
import { PerformanceSummary } from '../../components/dashboard/PerformanceSummary.jsx'
import { QuickTaskCreateModal } from '../../components/dashboard/QuickTaskCreateModal.jsx'

export function DeveloperDashboard() {
  const {
    dev,
    stats,
    devProjects,
    urgentTasksOverview,
    upcomingDeadlines,
    overdueTasks,
    announcements,
    performance,
  } = useDeveloperData()

  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* 1. Welcome Section */}
      <WelcomeBanner
        dev={dev}
        onOpenQuickTask={() => setIsQuickTaskOpen(true)}
      />

      {/* 2. Key Metrics & Statistics - Soft Pastel Cards */}
      <StatsSection stats={stats} />

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tasks -> Performance -> Projects */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Tasks Overview with Sorting Buttons */}
          <MyTasksOverview tasks={urgentTasksOverview} />

          {/* Performance Summary (replacing Recent Activity) */}
          <PerformanceSummary performance={performance} />

          {/* Projects Overview (moved below Performance) */}
          <MyProjectsOverview projects={devProjects} />
        </div>

        {/* Right Column: Announcements & Deadlines */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <AnnouncementsWidget announcements={announcements} />

          <UpcomingDeadlines
            deadlines={upcomingDeadlines}
            overdueTasks={overdueTasks}
          />
        </div>
      </div>

      {/* Quick Task Modal */}
      <QuickTaskCreateModal
        isOpen={isQuickTaskOpen}
        onClose={() => setIsQuickTaskOpen(false)}
      />
    </div>
  )
}
