import type { ReactNode, ComponentType, MouseEventHandler } from 'react'

export type ButtonVariant =
  'primary' | 'lime' | 'brand' | 'secondary' | 'subtle' | 'outline' | 'danger' | 'ghost' | string
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
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/35'

  const sizeStyles =
    {
      xs: 'text-xs px-3 py-1.5 gap-1.5',
      sm: 'text-xs px-3.5 py-2 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-sm px-5 py-3 gap-2.5',
    }[size] || 'text-xs px-3.5 py-2 gap-1.5'

  const brandPrimary =
    'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold shadow-sm hover:shadow active:translate-y-px'

  const variantStyles =
    {
      primary:
        'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold shadow-sm hover:shadow active:translate-y-px',
      brand: brandPrimary,
      lime: brandPrimary,
      secondary:
        'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow active:translate-y-px',
      subtle:
        'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
      outline:
        'border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-200 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20',
      danger:
        'bg-rose-50 dark:bg-rose-950/35 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 shadow-sm',
      ghost:
        'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/70',
    }[variant] ||
    'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'

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
