import type { ReactNode } from 'react'

interface AlertProps {
  variant?: 'error' | 'info'
  title?: string
  children: ReactNode
  action?: ReactNode
}

export function Alert({ variant = 'info', title, children, action }: AlertProps) {
  return (
    <div className={`alert alert--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <div>
        {title && <strong className="alert-title">{title}</strong>}
        <div>{children}</div>
      </div>
      {action}
    </div>
  )
}
