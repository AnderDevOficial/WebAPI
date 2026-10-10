import type { ProductInput } from './types'

export const PRODUCT_LIMITS = {
  nameMin: 2,
  nameMax: 150,
  descriptionMax: 1000,
  skuMin: 3,
  skuMax: 50,
  priceMax: 99_999_999.99,
} as const

const SKU_PATTERN = /^[A-Za-z0-9-]+$/

export type ProductFormErrors = Partial<Record<keyof ProductInput, string>>

export function validateProduct(input: ProductInput): ProductFormErrors {
  const errors: ProductFormErrors = {}
  const name = input.name.trim()
  const sku = input.sku.trim()

  if (!name) errors.name = 'El nombre es obligatorio.'
  else if (name.length < PRODUCT_LIMITS.nameMin || name.length > PRODUCT_LIMITS.nameMax)
    errors.name = `El nombre debe tener entre ${PRODUCT_LIMITS.nameMin} y ${PRODUCT_LIMITS.nameMax} caracteres.`

  if (!sku) errors.sku = 'El SKU es obligatorio.'
  else if (sku.length < PRODUCT_LIMITS.skuMin || sku.length > PRODUCT_LIMITS.skuMax)
    errors.sku = `El SKU debe tener entre ${PRODUCT_LIMITS.skuMin} y ${PRODUCT_LIMITS.skuMax} caracteres.`
  else if (!SKU_PATTERN.test(sku)) errors.sku = 'El SKU solo puede contener letras, números y guiones.'

  if (!Number.isFinite(input.price) || input.price < 0 || input.price > PRODUCT_LIMITS.priceMax)
    errors.price = 'Ingresa un precio válido mayor o igual a 0.'

  if (!Number.isInteger(input.stock) || input.stock < 0) errors.stock = 'El stock debe ser un número entero no negativo.'

  if (!input.categoryId) errors.categoryId = 'Debe seleccionar una categoría.'

  if ((input.description?.length ?? 0) > PRODUCT_LIMITS.descriptionMax)
    errors.description = `La descripción no puede superar los ${PRODUCT_LIMITS.descriptionMax} caracteres.`

  return errors
}
