import React from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { useDeveloperData } from '../../hooks/useDeveloperData.js'
import { useApp } from '../../context/AppContext.jsx'
import {
  User,
  RotateCcw,
  GitBranch,
  Mail,
  Globe,
  Tag,
} from 'lucide-react'

export function DeveloperSettingsPage() {
  const { dev } = useDeveloperData()
  const { resetDemoData } = useApp()

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-display">
          Profile & Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Developer preferences and configuration
        </p>
      </div>

      {/* Developer Profile Info */}
      <Card title="Profile" icon={User}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {dev?.initials || 'AR'}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{dev?.name}</span>
              <Badge variant="lime" size="xs">
                {dev?.title}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-slate-500 pt-1 text-[11px]">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" /> {dev?.email}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" /> {dev?.timezone}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <GitBranch className="w-3 h-3 text-slate-400" /> {dev?.github}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card title="Skills" icon={Tag}>
        <div className="flex flex-wrap gap-2 text-xs">
          {dev?.skills?.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </Card>

      {/* Demo Controls */}
      <Card title="Reset Data" icon={RotateCcw}>
        <div className="flex items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            Restore sample data back to default state anytime.
          </p>

          <Button
            variant="danger"
            size="sm"
            icon={RotateCcw}
            onClick={resetDemoData}
          >
            Reset
          </Button>
        </div>
      </Card>
    </div>
  )
}
