import { httpClient } from '../../lib/http/httpClient'
import type { Category, CategoryInput } from './types'

const BASE_PATH = '/categories'

export const categoriesApi = {
  getAll: (signal?: AbortSignal) => httpClient.get<Category[]>(BASE_PATH, undefined, signal),
  getById: (id: number, signal?: AbortSignal) => httpClient.get<Category>(`${BASE_PATH}/${id}`, undefined, signal),
  create: (input: CategoryInput) => httpClient.post<Category>(BASE_PATH, input),
  update: (id: number, input: CategoryInput) => httpClient.put<Category>(`${BASE_PATH}/${id}`, input),
  remove: (id: number) => httpClient.delete(`${BASE_PATH}/${id}`),
}
