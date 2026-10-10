import type { CategoryInput } from './types'

export const CATEGORY_LIMITS = { nameMin: 2, nameMax: 100, descriptionMax: 500 } as const

export type CategoryFormErrors = Partial<Record<keyof CategoryInput, string>>

export function validateCategory(input: CategoryInput): CategoryFormErrors {
  const errors: CategoryFormErrors = {}
  const name = input.name.trim()

  if (!name) errors.name = 'El nombre es obligatorio.'
  else if (name.length < CATEGORY_LIMITS.nameMin || name.length > CATEGORY_LIMITS.nameMax)
    errors.name = `El nombre debe tener entre ${CATEGORY_LIMITS.nameMin} y ${CATEGORY_LIMITS.nameMax} caracteres.`

  if ((input.description?.length ?? 0) > CATEGORY_LIMITS.descriptionMax)
    errors.description = `La descripción no puede superar los ${CATEGORY_LIMITS.descriptionMax} caracteres.`

  return errors
}
