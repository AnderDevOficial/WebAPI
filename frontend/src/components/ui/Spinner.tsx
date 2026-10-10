interface SpinnerProps {
  size?: 'sm' | 'md'
  label?: string
}

export function Spinner({ size = 'md', label }: SpinnerProps) {
  return (
    <span className="spinner-wrapper" role={label ? 'status' : undefined}>
      <span className={`spinner spinner--${size}`} aria-hidden="true" />
      {label && <span className="spinner-label">{label}</span>}
    </span>
  )
}
