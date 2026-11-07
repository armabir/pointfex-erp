import type { ReactNode, ComponentType, MouseEventHandler } from 'react'

export type ButtonVariant = 'primary' | 'lime' | 'secondary' | 'subtle' | 'outline' | 'danger' | 'ghost' | string
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | string

export interface ButtonProps {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ComponentType<{ className?: string }>
  rightIcon?: ComponentType<{ className?: string }>
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  title?: string
}

export function Button({
  children,
  variant = 'secondary',
  size = 'sm',
  icon: Icon,
  rightIcon: RightIcon,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  title,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

  const sizeStyles = {
    xs: 'text-xs px-2.5 py-1 gap-1',
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2.5',
  }[size] || 'text-xs px-3 py-1.5 gap-1.5'

  const variantStyles = {
    primary:
      'bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium shadow-xs active:translate-y-px',
    lime:
      'bg-[#e2f952] hover:bg-[#d9f538] text-slate-950 font-semibold shadow-xs active:translate-y-px',
    secondary:
      'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs active:translate-y-px',
    subtle:
      'bg-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
    outline:
      'border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800',
    danger:
      'bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50',
    ghost:
      'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800',
  }[variant] || 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
      {RightIcon && <RightIcon className="w-3.5 h-3.5 shrink-0" />}
    </button>
  )
}

