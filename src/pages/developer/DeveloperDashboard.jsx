import React, { useState } from 'react'
import { useDeveloperData } from '../../hooks/useDeveloperData.js'
import { WelcomeBanner } from '../../components/dashboard/WelcomeBanner.jsx'
import { StatsSection } from '../../components/dashboard/StatsSection.jsx'
import { MyTasksOverview } from '../../components/dashboard/MyTasksOverview.jsx'
import { MyProjectsOverview } from '../../components/dashboard/MyProjectsOverview.jsx'
import { UpcomingDeadlines } from '../../components/dashboard/UpcomingDeadlines.jsx'
import { RecentActivityFeed } from '../../components/dashboard/RecentActivityFeed.jsx'
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
    recentActivities,
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tasks, Projects & Activity */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <MyTasksOverview tasks={urgentTasksOverview} />
          <MyProjectsOverview projects={devProjects} />
          <RecentActivityFeed activities={recentActivities} />
        </div>

        {/* Right Column: Deadlines, Performance & Announcements */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <UpcomingDeadlines
            deadlines={upcomingDeadlines}
            overdueTasks={overdueTasks}
          />
          <PerformanceSummary performance={performance} />
          <AnnouncementsWidget announcements={announcements} />
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
