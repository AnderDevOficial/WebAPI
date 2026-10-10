import { formatNumber } from '../../lib/format'
import { Button } from './Button'

interface PaginationProps {
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, totalCount, pageSize, onPageChange }: PaginationProps) {
  if (totalCount === 0) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalCount)

  return (
    <nav className="pagination" aria-label="Paginación">
      <span className="pagination-summary">
        Mostrando {formatNumber(from)}–{formatNumber(to)} de {formatNumber(totalCount)}
      </span>
      <div className="pagination-controls">
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Anterior
        </Button>
        <span className="pagination-page">
          Página {page} de {Math.max(totalPages, 1)}
        </span>
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Siguiente
        </Button>
      </div>
    </nav>
  )
}
