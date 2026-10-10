import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { formatCurrency, formatNumber } from '../../../lib/format'
import type { Product, ProductSortField } from '../types'

const LOW_STOCK_THRESHOLD = 10

interface ProductTableProps {
  products: Product[]
  sortBy: ProductSortField
  descending: boolean
  onSort: (field: ProductSortField) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

interface SortableHeaderProps {
  field: ProductSortField
  label: string
  numeric?: boolean
  sortBy: ProductSortField
  descending: boolean
  onSort: (field: ProductSortField) => void
}

function SortableHeader({ field, label, numeric, sortBy, descending, onSort }: SortableHeaderProps) {
  const isActive = sortBy === field
  const ariaSort = isActive ? (descending ? 'descending' : 'ascending') : 'none'

  return (
    <th scope="col" className={numeric ? 'num' : undefined} aria-sort={ariaSort}>
      <button type="button" className="sort-button" onClick={() => onSort(field)}>
        {label}
        <span className="sort-indicator" aria-hidden="true">
          {isActive ? (descending ? '▼' : '▲') : '↕'}
        </span>
      </button>
    </th>
  )
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge tone="danger">Agotado</Badge>
  if (stock < LOW_STOCK_THRESHOLD) return <Badge tone="warning">{formatNumber(stock)}</Badge>
  return <span>{formatNumber(stock)}</span>
}

export function ProductTable({ products, sortBy, descending, onSort, onEdit, onDelete }: ProductTableProps) {
  const sortProps = { sortBy, descending, onSort }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <SortableHeader field="Name" label="Producto" {...sortProps} />
            <th scope="col">SKU</th>
            <th scope="col">Categoría</th>
            <SortableHeader field="Price" label="Precio" numeric {...sortProps} />
            <SortableHeader field="Stock" label="Stock" numeric {...sortProps} />
            <th scope="col">Estado</th>
            <th scope="col" className="actions"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="strong">{product.name}</div>
                {product.description && <div className="muted small truncate">{product.description}</div>}
              </td>
              <td className="mono nowrap">{product.sku}</td>
              <td>{product.categoryName}</td>
              <td className="num nowrap">{formatCurrency(product.price)}</td>
              <td className="num"><StockBadge stock={product.stock} /></td>
              <td>
                <Badge tone={product.isActive ? 'success' : 'neutral'}>
                  {product.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className="actions">
                <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                  Editar
                </Button>
                <Button variant="ghost" size="sm" className="text-danger" onClick={() => onDelete(product)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
