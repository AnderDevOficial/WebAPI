import { useId, type ReactElement, cloneElement } from 'react'

interface FormFieldProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactElement<{ id?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }>
}

export function FormField({ label, error, hint, required, children }: FormFieldProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={`form-field ${error ? 'form-field--invalid' : ''}`.trim()}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="form-required" aria-hidden="true"> *</span>}
      </label>
      {cloneElement(children, { id, 'aria-invalid': Boolean(error) || undefined, 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-error`} className="form-error">{error}</p>
      ) : (
        hint && <p id={`${id}-hint`} className="form-hint">{hint}</p>
      )}
    </div>
  )
}
