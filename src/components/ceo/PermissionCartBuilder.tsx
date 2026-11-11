import React, { useState, useMemo } from 'react'
import { Briefcase, Plus, Check, Search, Trash2, ShieldAlert, X } from 'lucide-react'
import { erpApi } from '../../api/client'
import { useApp } from '../../context/AppContext'
import {
  CORPORATE_DEPARTMENTS,
  DEPARTMENT_SUBTITLES,
  getPermissionDisplay,
  type CorporateDepartment,
} from '../../utils/permission-dictionary'
import { Card } from '../common/Card'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { SecurityConfirmModal } from '../common/SecurityConfirmModal'

export interface CartPermissionItem {
  id: string
  code: string
  resource: string
  action: string
  module: string
  description: string
  isSensitive: boolean
}

export interface CartRolePreset {
  id: string
  slug: string
  name: string
  rolePermissions: Array<{ permission: { code: string } }>
}

interface PermissionCartBuilderProps {
  permissions: CartPermissionItem[]
  existingRoles: CartRolePreset[]
  onRoleCreated: (createdRole: any) => Promise<void> | void
}

export function PermissionCartBuilder({
  permissions,
  existingRoles,
  onRoleCreated,
}: PermissionCartBuilderProps) {
  const { showToast } = useApp()

  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<'all' | CorporateDepartment>('all')

  const [roleName, setRoleName] = useState('')
  const [roleDesc, setRoleDesc] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const enrichedPermissions = useMemo(() => {
    return permissions.map((p) => {
      const display = getPermissionDisplay(p.code, p.description)
      return {
        ...p,
        displayLabel: display.label,
        displayDesc: display.description,
        department: display.department,
      }
    })
  }, [permissions])

  const groupedByDepartment = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const filtered = enrichedPermissions.filter((p) => {
      if (departmentFilter !== 'all' && p.department !== departmentFilter) return false
      if (!q) return true
      return (
        p.displayLabel.toLowerCase().includes(q) ||
        p.displayDesc.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q)
      )
    })

    return CORPORATE_DEPARTMENTS.map((dept) => ({
      department: dept,
      subtitle: DEPARTMENT_SUBTITLES[dept],
      items: filtered
        .filter((p) => p.department === dept)
        .sort((a, b) => a.displayLabel.localeCompare(b.displayLabel)),
    })).filter((group) => group.items.length > 0)
  }, [enrichedPermissions, searchQuery, departmentFilter])

  const assignedItems = useMemo(
    () =>
      enrichedPermissions
        .filter((p) => selectedCodes.has(p.code))
        .sort((a, b) => a.displayLabel.localeCompare(b.displayLabel)),
    [enrichedPermissions, selectedCodes],
  )

  const toggleCapability = (code: string) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  const toggleDepartmentAll = (items: typeof enrichedPermissions) => {
    const allSelected = items.every((i) => selectedCodes.has(i.code))
    setSelectedCodes((prev) => {
      const next = new Set(prev)
      for (const item of items) {
        if (allSelected) next.delete(item.code)
        else next.add(item.code)
      }
      return next
    })
  }

  const handleLoadPreset = (roleId: string) => {
    if (!roleId) return
    const preset = existingRoles.find((r) => r.id === roleId)
    if (!preset) return
    setSelectedCodes(new Set(preset.rolePermissions.map((rp) => rp.permission.code)))
    showToast(`Loaded capabilities from "${preset.name}"`, 'info')
  }

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleName.trim()) {
      showToast('Please enter a Role Name before saving', 'warning')
      return
    }
    if (selectedCodes.size === 0) {
      showToast('Please select at least one capability for this role', 'warning')
      return
    }
    setIsConfirmOpen(true)
  }

  const executeCreateRole = async () => {
    setIsSubmitting(true)
    try {
      const created = await erpApi.createRole({
        name: roleName.trim(),
        description: roleDesc.trim() || undefined,
        permissionCodes: Array.from(selectedCodes),
      })
      setIsConfirmOpen(false)
      setRoleName('')
      setRoleDesc('')
      setSelectedCodes(new Set())
      showToast(`New role "${created.name}" successfully saved to the system.`, 'success')
      await onRoleCreated(created)
    } catch (err: any) {
      showToast(err?.message || 'Unable to save new role', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Capabilities Grouped by Corporate Department */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-white dark:bg-[#0f1422] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-3.5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/Logo.png"
                alt="Pointfex Logo"
                className="w-9 h-9 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-2xs shrink-0"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Custom Role Creator ({permissions.length} Business Capabilities)</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select operational capabilities across corporate departments to build a tailored
                  role.
                </p>
              </div>
            </div>

            <select
              defaultValue=""
              onChange={(e) => {
                handleLoadPreset(e.target.value)
                e.target.value = ''
              }}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">Start from an Existing Role...</option>
              {existingRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.rolePermissions.length} capabilities)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="sm:col-span-2 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search business capabilities (e.g. Budget, Performance, Projects)..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value as 'all' | CorporateDepartment)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments ({CORPORATE_DEPARTMENTS.length})</option>
              {CORPORATE_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {groupedByDepartment.map(({ department, subtitle, items }) => {
            const selectedInDept = items.filter((i) => selectedCodes.has(i.code)).length
            const allSelected = selectedInDept === items.length

            return (
              <Card
                key={department}
                title={department}
                subtitle={`${subtitle} • ${selectedInDept} of ${items.length} selected`}
                action={
                  <button
                    type="button"
                    onClick={() => toggleDepartmentAll(items)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {allSelected ? 'Clear Department' : 'Select All'}
                  </button>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {items.map((perm) => {
                    const isAssigned = selectedCodes.has(perm.code)
                    return (
                      <button
                        key={perm.id}
                        type="button"
                        title={perm.displayDesc}
                        onClick={() => toggleCapability(perm.code)}
                        className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 ${
                          isAssigned
                            ? 'bg-indigo-50/75 dark:bg-indigo-950/30 border-indigo-500 dark:border-indigo-600/70 shadow-sm'
                            : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="min-w-0 flex-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {perm.displayLabel}
                          </span>
                          {perm.isSensitive && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                              <ShieldAlert className="w-2.5 h-2.5" />
                              Restricted
                            </span>
                          )}
                        </div>

                        <span
                          className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${
                            isAssigned
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isAssigned ? (
                            <>
                              <Check className="w-3 h-3" />
                              Assigned
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              Add
                            </>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Right: Sticky Assigned Capabilities & Save Role Form */}
      <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
        <Card
          title="Assigned Capabilities"
          icon={Briefcase}
          action={
            <div className="flex items-center gap-2">
              <Badge variant={assignedItems.length > 0 ? 'indigo' : 'slate'} size="xs">
                {assignedItems.length} selected
              </Badge>
              {assignedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedCodes(new Set())}
                  title="Clear all assigned capabilities"
                  className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          }
        >
          <div className="space-y-4">
            {/* Selected Capabilities List */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {assignedItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No capabilities assigned yet. Select items on the left to include them in this
                  role.
                </div>
              ) : (
                assignedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs"
                  >
                    <div className="min-w-0 flex items-center gap-1.5">
                      {item.isSensitive && (
                        <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
                      )}
                      <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate">
                        {item.displayLabel}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCapability(item.code)}
                      className="text-slate-400 hover:text-rose-500 shrink-0 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Save Role Form */}
            <form
              onSubmit={handleCreateRole}
              className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Regional Operations Lead"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Executive Summary
                </label>
                <textarea
                  rows={2}
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  placeholder="Describe the organizational scope and responsibilities..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                variant="brand"
                size="md"
                icon={Check}
                disabled={isSubmitting || selectedCodes.size === 0 || !roleName.trim()}
                className="w-full justify-center"
              >
                {isSubmitting ? 'Saving Role...' : `Save Role (${selectedCodes.size} Capabilities)`}
              </Button>
            </form>
          </div>
        </Card>
      </div>

      <SecurityConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => void executeCreateRole()}
        isSubmitting={isSubmitting}
        title="Confirm Create Custom Role"
        details={`Create custom role "${roleName.trim()}" with ${selectedCodes.size} business capabilities across departments.`}
        confirmLabel="Create Role"
      />
    </div>
  )
}
