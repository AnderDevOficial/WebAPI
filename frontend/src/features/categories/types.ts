export interface Category {
  id: number
  name: string
  description: string | null
  productCount: number
  createdAt: string
  updatedAt: string | null
}

export interface CategoryInput {
  name: string
  description: string | null
}
