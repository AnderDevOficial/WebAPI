import { useState, type SubmitEvent } from 'react'
import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { FormField } from '../../../components/ui/FormField'
import { ApiError, getErrorMessage } from '../../../lib/http/apiError'
import type { Category, CategoryInput } from '../types'
import { CATEGORY_LIMITS, validateCategory, type CategoryFormErrors } from '../validation'

interface CategoryFormProps {
  category?: Category
  isSubmitting: boolean
  onSubmit: (input: CategoryInput) => Promise<unknown>
  onCancel: () => void
}

export function CategoryForm({ category, isSubmitting, onSubmit, onCancel }: CategoryFormProps) {
  const [values, setValues] = useState<CategoryInput>({
    name: category?.name ?? '',
    description: category?.description ?? '',
  })
  const [errors, setErrors] = useState<CategoryFormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const setField = <K extends keyof CategoryInput>(field: K, value: CategoryInput[K]) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const validationErrors = validateCategory(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    try {
      await onSubmit({ name: values.name.trim(), description: values.description?.trim() || null })
    } catch (error) {
      if (error instanceof ApiError && error.problem.errors) setErrors(error.fieldErrors)
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}

      <FormField label="Nombre" error={errors.name} required>
        <input
          className="input"
          value={values.name}
          maxLength={CATEGORY_LIMITS.nameMax}
          onChange={(event) => setField('name', event.target.value)}
          autoFocus
        />
      </FormField>

      <FormField label="Descripción" error={errors.description} hint="Opcional">
        <textarea
          className="input"
          rows={3}
          value={values.description ?? ''}
          maxLength={CATEGORY_LIMITS.descriptionMax}
          onChange={(event) => setField('description', event.target.value)}
        />
      </FormField>

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {category ? 'Guardar cambios' : 'Crear categoría'}
        </Button>
      </div>
    </form>
  )
}
