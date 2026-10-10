import { httpClient } from '../../lib/http/httpClient'
import type { PagedResult } from '../../lib/pagination'
import type { Product, ProductFilters, ProductInput } from './types'

const BASE_PATH = '/products'

export const productsApi = {
  getPaged: (filters: ProductFilters, signal?: AbortSignal) =>
    httpClient.get<PagedResult<Product>>(BASE_PATH, { ...filters }, signal),
  getById: (id: number, signal?: AbortSignal) => httpClient.get<Product>(`${BASE_PATH}/${id}`, undefined, signal),
  create: (input: ProductInput) => httpClient.post<Product>(BASE_PATH, input),
  update: (id: number, input: ProductInput) => httpClient.put<Product>(`${BASE_PATH}/${id}`, input),
  remove: (id: number) => httpClient.delete(`${BASE_PATH}/${id}`),
}
