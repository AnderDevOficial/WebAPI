import type { Category } from '../../categories/types'

export type StatusFilter = 'all' | 'active' | 'inactive'

interface ProductFiltersBarProps {
  search: string
  categoryId: string
  status: StatusFilter
  categories: Category[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
}

export function ProductFiltersBar({
  search,
  categoryId,
  status,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: ProductFiltersBarProps) {
  return (
    <div className="filters" role="search">
      <input
        type="search"
        className="input filters-search"
        placeholder="Buscar por nombre o SKU…"
        aria-label="Buscar productos"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <select
        className="input"
        aria-label="Filtrar por categoría"
        value={categoryId}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        className="input"
        aria-label="Filtrar por estado"
        value={status}
        onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
      >
        <option value="all">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>
    </div>
  )
}
