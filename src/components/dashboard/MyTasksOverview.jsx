import React from 'react'
import { Card } from '../common/Card.jsx'
import { Badge } from '../common/Badge.jsx'
import { StatusPill } from '../common/StatusPill.jsx'
import { Button } from '../common/Button.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import { CheckSquare, ArrowRight } from 'lucide-react'

export function MyTasksOverview({ tasks }) {
  const { setRoute, setSelectedTaskModal } = useApp()

  return (
    <Card
      title="My Tasks"
      icon={CheckSquare}
      action={
        <Button
          variant="ghost"
          size="xs"
          rightIcon={ArrowRight}
          onClick={() => setRoute('tasks')}
        >
          View all
        </Button>
      }
      noPadding
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium bg-slate-50/50">
              <th className="py-3 px-5 font-medium">Task</th>
              <th className="py-3 px-3 font-medium">Project</th>
              <th className="py-3 px-3 font-medium">Priority</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 px-5 font-medium text-right">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No active tasks.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => setSelectedTaskModal(task)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  {/* Title */}
                  <td className="py-3.5 px-5 min-w-[220px]">
                    <span className="font-medium text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                      {task.title}
                    </span>
                  </td>

                  {/* Project */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <Badge variant="indigo" size="xs">
                      {task.project?.code || 'PROJ'}
                    </Badge>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <Badge
                      variant={
                        task.priority === 'urgent'
                          ? 'rose'
                          : task.priority === 'high'
                          ? 'amber'
                          : 'slate'
                      }
                      size="xs"
                    >
                      {task.priority}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusPill status={task.status} size="sm" />
                  </td>

                  {/* Deadline */}
                  <td className="py-3.5 px-5 whitespace-nowrap text-right text-slate-500">
                    {formatDate(task.dueDate, 'short')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
