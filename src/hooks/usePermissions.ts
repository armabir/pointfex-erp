import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export function usePermissions() {
  const {
    rolePermissions,
    myPermissions,
    directPermissions,
    hasPermission,
    hasAnyPermission,
    refreshPermissions,
  } = useApp()

  const permissionSet = useMemo(() => new Set(myPermissions), [myPermissions])

  return {
    rolePermissions,
    permissions: myPermissions,
    directPermissions,
    permissionSet,
    hasPermission,
    hasAnyPermission,
    refreshPermissions,
  }
}
