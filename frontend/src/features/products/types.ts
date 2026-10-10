export interface Product {
  id: number
  name: string
  description: string | null
  sku: string
  price: number
  stock: number
  isActive: boolean
  categoryId: number
  categoryName: string
  createdAt: string
  updatedAt: string | null
}

export interface ProductInput {
  name: string
  description: string | null
  sku: string
  price: number
  stock: number
  isActive: boolean
  categoryId: number
}

export type ProductSortField = 'Name' | 'Price' | 'Stock' | 'CreatedAt'

export interface ProductFilters {
  page: number
  pageSize: number
  search?: string
  categoryId?: number
  isActive?: boolean
  sortBy: ProductSortField
  descending: boolean
}
