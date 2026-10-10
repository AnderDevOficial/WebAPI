import { Button } from '../../../components/ui/Button'
import { formatDateTime, formatNumber } from '../../../lib/format'
import type { Category } from '../types'

interface CategoryTableProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col" className="num">Productos</th>
            <th scope="col">Última modificación</th>
            <th scope="col" className="actions"><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="strong">{category.name}</td>
              <td className="muted">{category.description ?? '—'}</td>
              <td className="num">{formatNumber(category.productCount)}</td>
              <td className="muted nowrap">{formatDateTime(category.updatedAt ?? category.createdAt)}</td>
              <td className="actions">
                <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-danger"
                  onClick={() => onDelete(category)}
                  disabled={category.productCount > 0}
                  title={category.productCount > 0 ? 'No se puede eliminar: tiene productos asociados' : undefined}
                >
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
