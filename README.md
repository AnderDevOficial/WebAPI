# Inventario — Web API .NET + React

Sistema de gestión de inventario (productos y categorías) compuesto por una **Web API REST en ASP.NET Core 10** con **Entity Framework Core** sobre **MySQL**, y una interfaz web en **React + TypeScript**.

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Backend | .NET 10, ASP.NET Core (controladores), EF Core 10, `MySql.EntityFrameworkCore` (proveedor oficial de Oracle) |
| Base de datos | MySQL 8 |
| Documentación API | OpenAPI + Scalar (`/scalar`) |
| Pruebas | xUnit + NSubstitute |
| Frontend | React 19, TypeScript, Vite, TanStack Query, React Router |

## Arquitectura

```
backend/
├── src/
│   ├── Inventory.Domain          → Entidades y reglas del dominio (sin dependencias)
│   ├── Inventory.Application     → Casos de uso: servicios, DTOs, validación, contratos de persistencia
│   ├── Inventory.Infrastructure  → EF Core: DbContext, configuraciones, repositorios, migraciones
│   └── Inventory.Api             → Controladores, manejo global de errores, CORS, OpenAPI
└── tests/
    └── Inventory.Application.Tests

frontend/src/
├── app/            → Router y cliente de React Query
├── components/     → UI reutilizable (Button, Modal, Pagination, Toast…) y layout
├── features/       → Módulos por funcionalidad (categories, products): api, hooks, componentes, páginas
├── lib/            → Cliente HTTP, manejo de errores, formateo
└── styles/         → Tokens de diseño y estilos (modo claro/oscuro)
```

# VIDEO:  https://youtu.be/bt5AVyhDoJA
