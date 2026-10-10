import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryKeys } from '../categories/hooks'
import { productsApi } from './api'
import type { ProductFilters, ProductInput } from './types'

export const productKeys = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => [...productKeys.all, 'list', filters] as const,
}

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: ({ signal }) => productsApi.getPaged(filters, signal),
    placeholderData: keepPreviousData,
  })
}

function useInvalidateCatalog() {
  const queryClient = useQueryClient()
  return () => Promise.all([
    queryClient.invalidateQueries({ queryKey: productKeys.all }),
    queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  ])
}

export function useSaveProduct() {
  const invalidate = useInvalidateCatalog()
  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: ProductInput }) =>
      id ? productsApi.update(id, input) : productsApi.create(input),
    onSuccess: invalidate,
  })
}

export function useDeleteProduct() {
  const invalidate = useInvalidateCatalog()
  return useMutation({
    mutationFn: (id: number) => productsApi.remove(id),
    onSuccess: invalidate,
  })
}
