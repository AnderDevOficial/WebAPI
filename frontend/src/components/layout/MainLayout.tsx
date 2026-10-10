import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { to: '/products', label: 'Productos' },
  { to: '/categories', label: 'Categorías' },
]

export function MainLayout() {
  return (
    <div className="layout">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">▣</span>
            Inventario
          </NavLink>
          <nav className="nav" aria-label="Navegación principal">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`.trim()}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
