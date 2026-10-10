import { Link } from 'react-router-dom'
import { EmptyState } from '../ui/EmptyState'

export function NotFoundPage() {
  return (
    <section className="card">
      <EmptyState
        title="Página no encontrada"
        description="La página que buscas no existe o fue movida."
        action={<Link to="/products" className="btn btn--primary btn--md">Ir a productos</Link>}
      />
    </section>
  )
}
