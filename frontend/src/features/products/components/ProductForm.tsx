import { useState, type SubmitEvent } from 'react'
import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { FormField } from '../../../components/ui/FormField'
import { CURRENCY_SYMBOL } from '../../../lib/format'
import { ApiError, getErrorMessage } from '../../../lib/http/apiError'
import type { Category } from '../../categories/types'
import type { Product, ProductInput } from '../types'
import { PRODUCT_LIMITS, validateProduct, type ProductFormErrors } from '../validation'

interface ProductFormProps {
  product?: Product
  categories: Category[]
  isSubmitting: boolean
  onSubmit: (input: ProductInput) => Promise<unknown>
  onCancel: () => void
}

interface FormValues {
  name: string
  description: string
  sku: string
  price: string
  stock: string
  isActive: boolean
  categoryId: string
}

function toFormValues(product?: Product): FormValues {
  return {
    name: product?.name ?? '',
    description: product?.description ?? '',
    sku: product?.sku ?? '',
    price: product ? String(product.price) : '',
    stock: product ? String(product.stock) : '0',
    isActive: product?.isActive ?? true,
    categoryId: product ? String(product.categoryId) : '',
  }
}

function toInput(values: FormValues): ProductInput {
  return {
    name: values.name.trim(),
    description: values.description.trim() || null,
    sku: values.sku.trim().toUpperCase(),
    price: values.price === '' ? Number.NaN : Number(values.price),
    stock: values.stock === '' ? Number.NaN : Number(values.stock),
    isActive: values.isActive,
    categoryId: Number(values.categoryId) || 0,
  }
}

export function ProductForm({ product, categories, isSubmitting, onSubmit, onCancel }: ProductFormProps) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(product))
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const setField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const input = toInput(values)
    const validationErrors = validateProduct(input)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    try {
      await onSubmit(input)
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
          maxLength={PRODUCT_LIMITS.nameMax}
          onChange={(event) => setField('name', event.target.value)}
          autoFocus
        />
      </FormField>

      <div className="form-grid">
        <FormField label="SKU" error={errors.sku} hint="Letras, números y guiones" required>
          <input
            className="input mono"
            value={values.sku}
            maxLength={PRODUCT_LIMITS.skuMax}
            onChange={(event) => setField('sku', event.target.value)}
          />
        </FormField>

        <FormField label="Categoría" error={errors.categoryId} required>
          <select
            className="input"
            value={values.categoryId}
            onChange={(event) => setField('categoryId', event.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={`Precio (${CURRENCY_SYMBOL})`} error={errors.price} required>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={values.price}
            onChange={(event) => setField('price', event.target.value)}
          />
        </FormField>

        <FormField label="Stock" error={errors.stock} required>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={values.stock}
            onChange={(event) => setField('stock', event.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Descripción" error={errors.description} hint="Opcional">
        <textarea
          className="input"
          rows={3}
          value={values.description}
          maxLength={PRODUCT_LIMITS.descriptionMax}
          onChange={(event) => setField('description', event.target.value)}
        />
      </FormField>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(event) => setField('isActive', event.target.checked)}
        />
        Producto activo
      </label>

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {product ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  )
}
